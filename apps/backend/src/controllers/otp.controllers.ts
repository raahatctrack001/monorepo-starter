import { emailSchema } from "@repo/common";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import ApiError from "../utils/apiError";
import { Otp, User } from "@repo/database";
import { generateNumericOTP, hashOTP } from "../services/email/generateOtp";
import { otpHtml } from "../services/email/email-template/otp.html";
import { sendEmail } from "../services/email/email.service";
import ApiResponse from "../utils/apiResponse";

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
        
        const updateUserOtpStore = await User.findOneAndUpdate({email}, {
            $push: {
                otpStore: otp
            }
        }, {new: true});
        // console.log(updateUserOtpStore);

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

        if (Date.now() - latestHashedOTP.createdAt.getTime() > 15 * 60 * 1000) {
            throw new ApiError(404, "OTP Expired!");
        }
        

        //check the frequency of request for otp verificatio using redis and deploy rate limit

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