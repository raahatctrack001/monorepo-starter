import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';
import { generateAccessToken, options, TokenPayload } from '../services/tokens/login.token';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

// Utility to safely verify token
const verifyToken = (token: string, secret: string): TokenPayload | null => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (err) {
    return null;
  }
};

export const isUserLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies;
  // console.log("cookies is here bro!", req.cookies)
  // If accessToken exists, verify it
  if (accessToken) {
    const decodedAccess = verifyToken(accessToken, ACCESS_SECRET);

    if (decodedAccess) {
      req.user = decodedAccess;
      return next();
    } else {
      // Invalid or expired token — optionally log this
      console.log("[Auth] Access token expired or invalid.");
    }
  }

  // If no valid access token, check refresh token
  if (refreshToken) {
    const decodedRefresh = verifyToken(refreshToken, REFRESH_SECRET);

    if (decodedRefresh) {
      const { _id, username, fullName } = decodedRefresh;
      const newAccessToken = generateAccessToken({ _id, username, fullName });
      res.cookie("accessToken", newAccessToken, options);

      req.user = decodedRefresh;
      return next();
    } else {
      console.log("[Auth] Invalid refresh token.");
      res.clearCookie("refreshToken");
    }
  }


  // If neither token is valid
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  throw new ApiError(401, "Session expired. Please log in again.");
});
