import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';
import { generateAccessToken, options, TokenPayload } from '../services/tokens/login.token';


export const isUserLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { accessToken, refreshToken } = req.cookies;

    // If no accessToken, but refreshToken exists
    if (!accessToken) {
      if (!refreshToken) {
        throw new ApiError(401, "Session expired, please log in again.");
      }

      // Verify refresh token
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as TokenPayload;
      if (!decodedRefresh) {
        throw new ApiError(403, "Failed to generate access token, please log in again!");
      }

      // Generate new access token
      const { _id, fullName, username } = decodedRefresh;
      const newAccessToken = generateAccessToken({ _id, fullName, username });

      // Set it in cookie
      res.cookie('accessToken', newAccessToken, options);

      // Attach to req.user and proceed
      req.user = decodedRefresh;
      return next();
    }

    // If accessToken exists
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
    req.user = decodedToken;

    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, "Access token expired, please log in again.");
    }
    throw new ApiError(401, "Invalid access token, please log in again.");
  }
});

