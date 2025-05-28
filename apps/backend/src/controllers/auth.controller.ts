import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from 'express';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    console.log("log something bro^$%@#$@")
    res.json({message:"req.body!!!$@#%@%^@#$@"})
})