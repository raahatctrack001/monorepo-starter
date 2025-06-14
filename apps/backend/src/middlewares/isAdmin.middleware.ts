// src/middlewares/authorizeRoles.ts
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "User not authenticated.");
      }

      const userRole = (req.user as any).role;

      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(
          403,
          `Access denied. Insufficient privileges to perform this action. Required: [${allowedRoles.join(
            ", "
          )}]`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
