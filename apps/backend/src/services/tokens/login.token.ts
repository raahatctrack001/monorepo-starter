import { User } from "@repo/database";
import ApiError from "../../utils/apiError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";
dotenv.config();

export interface TokenPayload {
  _id:  IUser["_id"],
  username: string;
  fullName: string;
}

// Validate and type the token secrets more strictly
const getTokenSecrets = () => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

  if (!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRY || 
      !REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRY) {
    throw new ApiError(500, "Token secrets or expiries are missing in environment variables!");
  }

  return {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY
  };
};

import { Secret, SignOptions } from 'jsonwebtoken';
import { IUser } from "@repo/database/dist/models/user/user.model";

// ... other code

export const generateAccessToken = (payload: TokenPayload): string => {
  const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = getTokenSecrets();
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = getTokenSecrets();
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new ApiError(404, "User not found");
    }
    
    const tokenPayload: TokenPayload = {
      _id: currentUser._id,
      username: currentUser.username,
      fullName: currentUser.fullName,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    currentUser.refreshToken = refreshToken;
    await currentUser.save();
    
    console.log("Tokens generated successfully!");
    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

// Cookie Options for refresh token
const isProduction = process.env.NODE_ENV === "production";
export const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};