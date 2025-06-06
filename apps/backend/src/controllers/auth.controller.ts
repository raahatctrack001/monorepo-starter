import { ZodError, ZodIssue } from "zod";
import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { passwordSchema, registerUserSchema } from "@repo/common";
import ApiResponse from "../utils/apiResponse";
import bcrypt from "bcrypt";
import { User } from "@repo/database";
import { generateAccessAndRefreshToken, options } from "../services/tokens/login.token";

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {  
        try {
            console.log("inside register controller")
            //check if no fields are empty
            const { email, password: Password, repeatPassword, username, fullName, device } = req.body;
            if([email, Password, repeatPassword, username, fullName].some(field=>field?.trim()?0:1)){
                throw new ApiError(404, "All fields are necessary!");
            }
            
            //check if password and repeat password is matching
            if(Password !== repeatPassword){
                console.log("password didn't matched")
                throw new ApiError(409, "Password didn't matched")
            }
            
            //validate user data with zod schema
            const result = registerUserSchema.safeParse({ email, username, fullName, password: Password, repeatPassword });
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
                 lastLogin: new Date(),   
                 loginCount: 1,
                 loginDetail: [{ 
                     loginTimestamp: new Date(),   
                     device 
                 }]
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
            newUser.password = "";
            return res
                .status(201)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(new ApiResponse(201, "User registered", newUser));
        } catch (error) {
            next(error)
        }
})

export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userEmail, password, device } = req.body;
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
        
        const tokens = await generateAccessAndRefreshToken(user?._id as string);
        const { accessToken, refreshToken } = tokens;

        const { loginCount: lc } = user;
        const updateUser = await User.findByIdAndUpdate(user?._id, {
            $set: {
                lastLogin: new Date(),
                loginCount: lc+1,
            }, 
            $push: {
                loginDetail: {
                    loginTimestamp: new Date(),   
                    device
                }
            }
        }, { new: true })
        return res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json(new ApiResponse(200, "User Logged In!", updateUser));        

    } catch (error) {
        next(error)
    }
})

export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear the user's refresh token in the database
        const { device } = req.body;
        const currentUser = await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                refreshToken: null,
                lastLogout: new Date(),
            },
            $push: {
                logoutDetail: {
                    logoutTimestamp: new Date(),
                    device,
                }
            }
        }, { new: true})

        if(!currentUser){
            throw new ApiError(500, "failed to clear refresh token!")
        }        

        // Clear cookies and respond
        return res
            .status(200)
            .clearCookie('accessToken', options)
            .clearCookie('refreshToken', options)
            .json(new ApiResponse(200, "User logged out", currentUser));
    } catch (error) {
        next(error);
    }
});

export const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{    
    try {        
        console.log(req.params)
        console.log(req.body)
        if(req.user?._id !== req.params?.userId){
            throw new ApiError(401, "Unauthorized attempt!")
        }

        const { oldPassword, newPassword, repeatPassword } = req.body;
        if(newPassword !== repeatPassword){
            throw new ApiError(404, "repeat password didn't match");
        }
        
        const result = passwordSchema.safeParse(newPassword);
        if (!result.success) {
            const errors = (result.error as ZodError).errors.map((err: ZodIssue) => ({
                path: err.path.join("."),  // e.g. "email"
                message: err.message       // e.g. "Invalid email format"
            }));

            throw new ApiError(403, "Password should contain capital letter, small letter, a digit and one special character, also it should be at least 8 characaters long", errors);
        }
        
        const currentUser = await User.findById(req.params?.userId).select("+password");
        if(!currentUser){
            throw new ApiError(404, "User doesn't exist")
        }
        const isPasswordMatching = await bcrypt.compare(oldPassword, currentUser?.password);
        if(isPasswordMatching){
            throw new ApiError(404, "old password is wrong")
        }

        if(!await bcrypt.compare(newPassword, currentUser?.password)){
            throw new ApiError(406, "Old and new password can't be same!")
        }

        const hashedPassword =  await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(currentUser?._id, {
            $set: {
                password: hashedPassword,
            }
        }, {new: true})
        console.log(updatedUser);
        return res.status(200).json( new ApiResponse(200, "Password updated successfully!", updatedUser))
    } catch (error) {
        // console.log(error)
        next(error)
    }
})

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Password")
})

export const verifyResetPasswordToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Password")
})

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Password")
})

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Password")
})

export const verifyEmailOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Email OTP verified." });
});

export const resendEmailOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Email OTP resent." });
});

export const sendPhoneVerificationOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Phone verification OTP sent." });
});

export const verifyPhoneOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Phone OTP verified." });
});

export const checkUsernameAvailability = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ available: true });
});

export const loginWithEmailAndPassword = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Login successful." });
});

export const loginWithPhoneAndOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Phone login successful." });
});

export const loginWithSocialProvider = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Social login successful." });
});

export const loginWithBiometricOrPasskey = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Biometric/Passkey login successful." });
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ token: "newAccessToken" });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully." });
});

export const sendPasswordResetEmail = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Password reset email sent." });
});

export const sendPhonePasswordResetOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Phone password reset OTP sent." });
});

export const verifyPhonePasswordResetOTP = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Phone password reset OTP verified." });
});

export const getActiveSessions = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ sessions: [] });
});

export const terminateSession = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Session terminated." });
});

export const terminateAllSessions = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "All sessions terminated." });
});

export const enableTwoFactorAuth = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "2FA enabled." });
});

export const disableTwoFactorAuth = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "2FA disabled." });
});

export const verifyTwoFactorAuthCode = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "2FA code verified." });
});

export const generateBackupCodes = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ codes: ["code1", "code2"] });
});

export const authorizeNewDevice = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Device authorized." });
});

export const getAuthorizedDevices = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ devices: [] });
});

export const revokeDeviceAccess = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Device access revoked." });
});

export const generateAPIKey = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ apiKey: "generatedKey" });
});

export const revokeAPIKey = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "API key revoked." });
});

export const listAPIKeys = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ keys: [] });
});

export const deactivateAccount = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Account deactivated." });
});

export const reactivateAccount = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Account reactivated." });
});

export const deleteAccountPermanently = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Account permanently deleted." });
});

export const verifyCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Current password verified." });
});

export const getAccountSecuritySettings = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ settings: {} });
});

export const updateAccountSecuritySettings = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Security settings updated." });
});

export const linkSocialAccount = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Social account linked." });
});

export const unlinkSocialAccount = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Social account unlinked." });
});

export const sendConsentUpdateNotification = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Consent update notification sent." });
});

export const recordUserConsent = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User consent recorded." });
});

export const verifyIdentityDocument = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Identity document verified." });
});

export const requestBiometricLoginSetup = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Biometric login setup requested." });
});
