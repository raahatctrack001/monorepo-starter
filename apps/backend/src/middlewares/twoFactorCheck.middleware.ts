import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import { User } from "@repo/database";

/**
 * Middleware to enforce Two-Factor Authentication where required
 */
export const twoFactorAuthRequired = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any)?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized: User information missing.");
    }

    // Fetch latest user record from DB
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // If 2FA not enabled, skip
    if (!user.isTwoFactorEnabled) {
      return next();
    }

    // If enabled but not verified in current session
    if (!user.isTwoFactorVerified) {
      throw new ApiError(403, "Two-Factor Authentication required. Please verify OTP.");
    }

    // All good
    next();

  } catch (error) {
    next(error);
  }
};
