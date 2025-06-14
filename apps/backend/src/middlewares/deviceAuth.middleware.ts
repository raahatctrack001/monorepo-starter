import { Request, Response, NextFunction } from "express";
import useragent from "useragent";
import { User } from "@repo/database";
import ApiError from "../utils/apiError";

export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || "";
    const userAgentString = req.headers["user-agent"] || "Unknown";
    const agent = useragent.parse(userAgentString);

    const deviceDetails = {
      os: agent.os.toString(),
      browser: agent.toAgent(),
      platform: agent.device.toString(),
    };

    // Assume user ID is attached to request via previous authentication middleware
    const userId = req.user && typeof req.user !== "string" ? (req.user as any)._id : null;

    let isKnownDevice = false;

    // Only check known devices if user is authenticated
    if (userId) {
      const user = await User.findById(userId).select("+loginDetail");
      if (!user) {
        throw new ApiError(404, "User not found while detecting device.");
      }

      // Check if device already exists in user's loginDetail
      isKnownDevice = user.loginDetail.some((detail: any) =>
        detail.device.os === deviceDetails.os &&
        detail.device.browser === deviceDetails.browser &&
        detail.device.platform === deviceDetails.platform
      );
    }

    req.device = {
      userAgent: userAgentString,
      ip,
      details: deviceDetails,
      isKnownDevice,
    };

    next();
  } catch (error) {
    next(error);
  }
};
