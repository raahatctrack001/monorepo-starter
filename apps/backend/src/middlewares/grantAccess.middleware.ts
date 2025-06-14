import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Enterprise-grade authorization middleware
 * 
 * @param allowedRoles array of roles permitted to access the route
 * @param getResourceOwnerId function to get resource's owner ID from DB using request params
 */
export const authorizeRolesOrOwner = (
  allowedRoles: string[],
  getResourceOwnerId: (req: Request) => Promise<string>
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as any;

    if (!currentUser) {
      throw new ApiError(401, "Unauthorized access. User not authenticated.");
    }

    // If user is in allowed roles, allow access
    if (allowedRoles.includes(currentUser.role)) {
      return next();
    }

    // If not, check if user is the owner of the resource
    const ownerId = await getResourceOwnerId(req);

    if (ownerId.toString() === currentUser._id.toString()) {
      return next();
    }

    throw new ApiError(403, "Forbidden: You don't have permission to access this resource.");
  });
