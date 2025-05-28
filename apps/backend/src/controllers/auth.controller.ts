import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from 'express';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body);
    res.json(req.body)
})