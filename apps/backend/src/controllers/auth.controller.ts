import { ZodError, ZodIssue } from "zod";
import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from 'express';
import { registerUserSchema } from "@repo/common";

import ApiResponse from "../utils/apiResponse";
import bcrypt from "bcrypt";
import { User } from "@repo/database";
import { generateAccessAndRefreshToken } from "../services/tokens/login.token";



export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("inside register controller")
        const { email, password: Password, repeatPassword, username, fullName } = req.body;
        if([email, Password, repeatPassword, username, fullName].some(field=>field?.trim()?0:1)){
            throw new ApiError(404, "All fields are necessary!");
        }

        if(Password !== repeatPassword){
            console.log("password didn't matched")
            throw new ApiError(409, "Password didn't matched")
        }

    const result = registerUserSchema.safeParse({ email, username, fullName, password: Password });

    if (!result.success) {
        const errors = (result.error as ZodError).errors.map((err: ZodIssue) => ({
            path: err.path.join("."),  // e.g. "email"
            message: err.message       // e.g. "Invalid email format"
        }));

        throw new ApiError(403, "Error while validating data", errors);
    }

         
        
        // return;
        // ***********check using bloom filter before register controller is being hit**********************
        // const isExisting = await User.findOne({username});
        // if(isExisting){
        //     throw new ApiError(409, "User with this username already exists");
        // }

        const hashedPassword =  await bcrypt.hash(Password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            fullName,
        });

        if(!newUser){
            throw new ApiError(500, "Internal error while registering user", newUser);
        }
        const id = newUser?._id;
        const tokens = generateAccessAndRefreshToken(id as string);
        console.log(tokens);

        return res.status(201).json(new ApiResponse(201, "New User Created!", {newUser, tokens}));
    } catch (error) {
        next(error);
    }

})