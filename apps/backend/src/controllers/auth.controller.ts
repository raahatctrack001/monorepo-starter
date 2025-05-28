import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from 'express';
import { registerUserSchema } from "@repo/common";
import { z } from "zod";
import ApiResponse from "../utils/apiResponse";
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const { email, password, repeatPassword, username, fullName } = req.body;
        if([email, password, repeatPassword, username, fullName].some(field=>field?.trim()?0:1)){
            throw new ApiError(404, "All fields are necessary!");
        }

        if(password !== repeatPassword){
            console.log("password didn't matched")
            throw new ApiError(409, "Password didn't matched")
        }

        const result = registerUserSchema.safeParse({email, username, fullName, password});
        
        if(!result.success) {
            const errors = result.error.errors.map(err => ({
                path: err.path.join('.'),  // e.g. "email"
                message: err.message       // e.g. "Invalid email format"
            }))
            throw new ApiError(403, "Error while validating data", errors)
        }
        
        const hashedPassword =  await bcrypt.hash(password, 10);
        // const newUser = await User.create({
        //     username,
        //     password: hashedPassword,
        //     email,
        //     fullName,
        // });

        // if(!newUser){
        //     throw new ApiError(500, "Internal error while registering user", newUser);
        // }

        // return res.status(201).json(new ApiResponse(201, "New User Created!", newUser));
    } catch (error) {
        next(error);
    }

})