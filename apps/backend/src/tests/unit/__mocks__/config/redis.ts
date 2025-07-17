import { vi } from "vitest";

export const getRedisClient = vi.fn(() => ({
  get: vi.fn(),
  set: vi.fn(),
}));
