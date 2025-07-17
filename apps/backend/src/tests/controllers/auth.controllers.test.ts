import { getRedisClient } from "@repo/redis";
import { Request, Response, NextFunction } from "express";
import { vi, describe, it, expect, beforeEach, Mock, afterEach } from "vitest";
import { checkIfUsernameExists } from "../../controllers/auth.controllers";
import ApiResponse from "../../utils/apiResponse";
import { User } from "@repo/database";

vi.mock("@repo/redis");
vi.mock("@repo/database");
vi.mock("../../utils/apiResponse.ts");

describe("checkIfUsernameExists", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: Mock;
  let statusMock: Mock;

  const redisMock = {
    get: vi.fn(),
    set: vi.fn(),
  };

  //initialise the variables
  beforeEach(() => {
    req = {
      query: {},
    };

    jsonMock = vi.fn(); //tracks res.json()
    statusMock = vi.fn().mockReturnValue({ json: jsonMock }); //tracks res.status() and chains .json()  

    res = {
      status: statusMock,
    };

    next = vi.fn();

    // Set mock redis
    (getRedisClient as Mock).mockReturnValue(redisMock);
  });

  //clear all mocked deps
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if username is missing", async () => {
    req.query = {};
    await checkIfUsernameExists(req as Request, res as Response, next as NextFunction);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.any(ApiResponse)
    );
  });

  it("should return cached response if username exists in cache", async () => {
    req.query = { username: "testuser" };
    redisMock.get.mockResolvedValue("available");

    await checkIfUsernameExists(req as Request, res as Response, next);

    expect(redisMock.get).toHaveBeenCalledWith("checkUsername:testuser");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.any(ApiResponse)
    );
    const data = jsonMock.mock.calls[0][0];
    expect(data.data.available).toBe(false); // means it already exists
  });

  it("should return from DB and cache if username exists", async () => {
    req.query = { username: "existinguser" };
    redisMock.get.mockResolvedValue(null);
    (User.exists as Mock).mockResolvedValue(true);

    await checkIfUsernameExists(req as Request, res as Response, next);

    expect(User.exists).toHaveBeenCalledWith({ username: "existinguser" });
    expect(redisMock.set).toHaveBeenCalledWith(
      "checkUsername:existinguser",
      "available",
      "EX",
      30
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock.mock.calls[0][0].data.available).toBe(false);
  });

  it("should return from DB and not cache if username does not exist", async () => {
    req.query = { username: "newuser" };
    redisMock.get.mockResolvedValue(null);
    (User.exists as Mock).mockResolvedValue(false);

    await checkIfUsernameExists(req as Request, res as Response, next);

    expect(User.exists).toHaveBeenCalledWith({ username: "newuser" });
    expect(redisMock.set).not.toHaveBeenCalled(); // only cache if exists
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock.mock.calls[0][0].data.available).toBe(true);
  });
});
