import { ZodError, ZodIssue } from "zod";
import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { emailSchema, registerUserSchema } from "@repo/common";
import ApiResponse from "../utils/apiResponse";
import bcrypt from "bcrypt";
import { Otp, User } from "@repo/database";
import { generateAccessAndRefreshToken, options } from "../services/tokens/login.token";
import { generateNumericOTP, hashOTP } from "../services/email/generateOtp";
import { otpHtml } from "../services/email/email-template/otp.html";
import { sendEmail } from "../services/email/email.service";


export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {    
        try {
            console.log("inside register controller")
            //check if no fields are empty
            const { email, password: Password, repeatPassword, username, fullName } = req.body;
            if([email, Password, repeatPassword, username, fullName].some(field=>field?.trim()?0:1)){
                throw new ApiError(404, "All fields are necessary!");
            }
            
            //check if password and repeat password is matching
            if(Password !== repeatPassword){
                console.log("password didn't matched")
                throw new ApiError(409, "Password didn't matched")
            }
            
            //validate user data with zod schema
            const result = registerUserSchema.safeParse({ email, username, fullName, password: Password });
            if (!result.success) {
                const errors = (result.error as ZodError).errors.map((err: ZodIssue) => ({
                    path: err.path.join("."),  // e.g. "email"
                    message: err.message       // e.g. "Invalid email format"
                }));
    
                throw new ApiError(403, "Error while validating data", errors);
            }    
            
            //hash password before putting into database then create user
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
            //generate token to add into cookies for direct login after registration
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id as string);
            if(!(accessToken && refreshToken)){
                throw new ApiError(500, "Failed to generate access and refresh token!");
            }
            
            //set cookies and send required data
            return res
                .status(201)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(new ApiResponse(201, "User registered", newUser));
        } catch (error) {
            next(error)
        }
})

export const sendOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        //get and verify if email if is not empty
        const { email } = req.body;
        const emailCheck = emailSchema.safeParse(email);

        //validate using zod
        if (!emailCheck.success) {
            const errors = (emailCheck.error as ZodError).errors.map((err: ZodIssue) => ({
                path: err.path.join("."),  // e.g. "email"
                message: err.message       // e.g. "Invalid email format"
            }));

            throw new ApiError(403, "Error while validating email", errors);
        } 

        //check if user exist as this email will be inside opt schema ::: use cache redis in future
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(404, "User with this email doesn't exist");
        }
        
        //generate and hash otp, send simple otp in email and save hashedOTP in db
        const newOTP = generateNumericOTP();
        const otpHash = hashOTP(newOTP);

        //create otp
        const otp = await Otp.create({
            userId: user?._id,
            identifier: email,
            otpHash, 
            purpose: "email_verification"
        });
        if(!otp){
            throw new ApiError(500, "Failed to generate OTP, please try again later!");
        }
        
        //prepare data for sending email
        const subject = "Social Project: Email Verification";
        const emailHTML = otpHtml(email, newOTP);

        //send email
        const sentEmail  = await sendEmail(email, subject, emailHTML);
        const { success, message } = sentEmail;
        if(!success){
            throw new ApiError(500, message || "Failed to send otp on email, try again later");
        }
        
        //Inform that otp has been sent!
        return res.status(201).json(new ApiResponse(201, "Email Sent Successfully, Make sure to check spam folder if not in inbox!", {}))
    } catch (error) {
        next(error)
    }
})

export const verifyOTP = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        //extract data and validate if they are empty?
        console.log(req.body)
        const { email, otp } = req.body;
        if(!email){
            throw new ApiError(404, "Email is required");
        } 
        
        const emailCheck = emailSchema.safeParse(email);
        if (!emailCheck.success) {
            const errors = (emailCheck.error as ZodError).errors.map((err: ZodIssue) => ({
                path: err.path.join("."),  // e.g. "email"
                message: err.message       // e.g. "Invalid email format"
            }));
            
            throw new ApiError(403, "Error while validating email", errors);
        }

        if(!otp){
            throw new ApiError(404, "Please enter otp")
        }

        if(otp.length != 6){
            throw new ApiError(403, "Please enter valid otp");
        }
        
        //check if user exists :: user cached, redis in future
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(404, "User with this email doesn't exist");
        }
        
        //collective data
        const allCodes = await Otp.find({userId: user?._id, identifier: email});
        const latestHashedOTP = allCodes.at(-1);
        
        //hash user otp to compare with otpHash in db
        const userHashedOTP = hashOTP(otp);
        if(userHashedOTP !== latestHashedOTP?.otpHash){
            throw new ApiError(403, "Please enter valid OTP")
        }

        //update user that email has been verified
        const updateUser = await User.findOneAndUpdate({email}, {
            $set: {
                emailVerified: true,
            }
        }, {new: true})
        
        res.status(200).json(new ApiResponse(200, "Email verified!", updateUser));
    } catch (error) {
        next(error)
    }
})

export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userEmail, password } = req.body;
        if(!userEmail.trim()){
            throw new ApiError(404, "username or email is required!")
        }

        if(!password.trim()){
            throw new ApiError(404, "Password is missing!")
        }
        const query = userEmail.includes('@') ? { email: userEmail } : { username: userEmail };

        const user = await User.findOne(query).select("+password");
        if(!user){
            throw new ApiError(404, "User with this credentials does not exist!")
        }
        
        const isPasswordMatching = await bcrypt.compare(password, user?.password);
        if(!isPasswordMatching){
            throw new ApiError(404, "Authorization Failed due to credential's mismatch!")
        }
        
        // @ts-ignore
        const { password: Password, ...rest } = user?._doc;
        
        const tokens = await generateAccessAndRefreshToken(user?._id);
        const { accessToken, refreshToken } = tokens;
        
        return res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(new ApiResponse(200, "User Logged In!", rest));        

    } catch (error) {
        next(error)
    }
})