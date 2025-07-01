import { ZodError, ZodIssue } from "zod";
import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { passwordSchema, registerUserSchema } from "@repo/common";
import ApiResponse from "../utils/apiResponse";
import bcrypt from "bcrypt";
import { User } from "@repo/database";
import { generateAccessAndRefreshToken, options } from "../services/tokens/login.token";
import { validateData } from "../utils/zod.validator";
import { emptyDeviceData } from "../utils/constants";
import { generatePasswordResetToken } from "../services/tokens/resetPassword.token";
import { resetPasswordHTML } from "../services/email/email-template/reset.password";
import { sendEmail } from "../services/email/email.service";








export const isAuthorised = asyncHandler(async (req:Request, res:Response, next:NextFunction)=>{
    //console.log(req.user)
    if(req.user){
        return res.status(200).json( new ApiResponse(200, "User is authorised to use this app!", {status:true, use: req.user}))
    }    
    return res.status(401).json( new ApiResponse(401, "Unauthorised!", {status: false}))
})

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {  
        try {
            //console.log("inside register controller", req.body);
            
            //check if no fields are empty
            const { email, password: Password, repeatPassword, username, fullName, device } = req.body;
            if([email, Password, repeatPassword, username, fullName].some(field=>field?.trim()?0:1)){
                throw new ApiError(404, "All fields are necessary!");
            }
            
            let deviceInfo = device || [emptyDeviceData];            
            /****
             * 
             * 
             * 
             * 
             * check if user with this email or username already exist?
             * 
             * 
             * 
             * 
             */
            
            //check if password and repeat password is matching
            if(Password !== repeatPassword){
                // console.log("password didn't matched")
                throw new ApiError(409, "Password didn't matched")
            }
            await validateData(registerUserSchema, {email, username, password: Password, repeatPassword, fullName});
            
            //validate user data with zod schema
            // const result = registerUserSchema.safeParse({ email, username, fullName, password: Password, repeatPassword });
            // if (!result.success) {
            //     const errors = (result.error as ZodError).errors.map((err: ZodIssue) => ({
            //         path: err.path.join("."),  // e.g. "email"
            //         message: err.message       // e.g. "Invalid email format"
            //     }));
    
            //     throw new ApiError(403, "Error while validating data", errors);
            // }    
            
            //hash password before putting into database then create user
            const hashedPassword =  await bcrypt.hash(Password, 10);
            const { token } = deviceInfo[0];
            const newUser = await User.create({
                 username,
                 password: hashedPassword,
                 email,
                 fullName,
                 lastLogin: new Date(),   
                 loginCount: 1,
                 loginDetail: [{ 
                     loginTimestamp: new Date(),   
                     deviceToken: token 
                 }],
                 device: deviceInfo[0]
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
      if([userEmail, password].some(field=>field?.trim() ? 0 : 1)){
        throw new ApiError(404, "All fields are necessary!")
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
      let deviceInfo = device || [emptyDeviceData];
      
      const { token } = deviceInfo[0];

      const { device: deviceData} = user;
      const isNewDevice = !deviceData.some(data=>data.token === token)
      //if(isNewDevice) sendWarningEmail with device details

      const { loginCount: lc } = user; 
      const updateUser = isNewDevice ? 
        await User.findByIdAndUpdate(user?._id, {
            $set: {
                lastLogin: new Date(),
                loginCount: lc+1,
            }, 
            $push: {
                loginDetail: {
                    loginTimestamp: new Date(),   
                    deviceToken: token
                },
                device: deviceInfo[0],
            }
        }, { new: true }) :
        await User.findByIdAndUpdate(user?._id, {
            $set: {
                lastLogin: new Date(),
                loginCount: lc+1,
            }, 
            $push: {
                loginDetail: {
                    loginTimestamp: new Date(),   
                    deviceToken: token
                },
                device: deviceInfo[0],
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
        console.log("logoutcontroller", req.body)
        const { token } = req.body || "";
        const currentUser = await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                refreshToken: null,
                lastLogout: new Date(),
            },
            $push: {
                logoutDetail: {
                    logoutTimestamp: new Date(),
                    deviceToken: token || "",
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
        // console.log(req.user);
        // console.log(req.params)
        if (req.user?._id !== req.params?.userId) {
            throw new ApiError(401, "Unauthorized attempt!")
        }

        const { oldPassword, newPassword, repeatPassword } = req.body;
        if (newPassword !== repeatPassword) {
            throw new ApiError(404, "repeat password didn't match");
        }
        
        await validateData(passwordSchema, newPassword);
        
        const currentUser = await User.findById(req.params?.userId).select("+password");
        if (!currentUser) {
            throw new ApiError(404, "User doesn't exist")
        }
        const isPasswordMatching = await bcrypt.compare(oldPassword, currentUser?.password);
        if (!isPasswordMatching) {
            throw new ApiError(404, "Please enter the correct password")
        }

        const isCurrentAndOldPasswordSame = await bcrypt.compare(newPassword, currentUser?.password)
        if (isCurrentAndOldPasswordSame) {
            throw new ApiError(406, "Old and new password can't be same!")
        }

        const hashedPassword =  await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(currentUser?._id, {
            $set: {
                password: hashedPassword,
            }
        }, {new: true})
        //console.log(updatedUser);
        return res.status(200).json( new ApiResponse(200, "Password updated successfully!", updatedUser))
    } catch (error) {
        // //console.log(error)
        next(error)
    }
})

export const sendPasswordResetEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //TO DO 
  /****
   * 1. Extract username or email from req.body
   * 2. set query if its username or email
   * 3. check if user with this credentials exits or not
   * 4. generate reset password token as set it in user's corresponding field
   * 5. send email the reset password link
   * 6. if everything is success then ok else clear resetPasswordToken field and reset passwor token expiry;
   */
    const { userEmail } = req.body;    
    const query = userEmail?.includes('@') ? { email: userEmail } : { username: userEmail };
    const currentUser = await User.findOne(query).select("+resetPasswordToken");
    try {
        if (!currentUser) {
            throw new ApiError(404, "User doesn't exist");
        }
        
        const resetToken = await generatePasswordResetToken(currentUser?._id as string);
        const resetPasswordURL = `${process.env.FRONTEND_URL}/token-verification/${resetToken}`;
        const html = resetPasswordHTML(currentUser?.fullName, resetPasswordURL);
        // console.log(html);
        const subject = "Social Media Account Recovery!";
        const emailStatus = await sendEmail(currentUser?.email, subject, html); // Ensure sendEmail returns a promise
         
        if (emailStatus.success) {
            return res.status(200).json(new ApiResponse(200, `reset token has been sent at ${currentUser?.email}, please click on the given link inside to reset password.`, {}))
        }
        throw new ApiError(500, "failed to send email!, please again after sometime.")
    
    } catch (error) {
        if (currentUser) { // Ensure currentUser is defined before attempting to reset the token
            currentUser.resetPasswordToken = undefined;
            currentUser.resetPasswordTokenExpiry = undefined;
            await currentUser.save();
        }
        next(error);
    }   
})

export const verifyPasswordResetToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
  /**To Do
   * 1. extract userId and token from req.params;
   * 2. search in the database whether use with this hashcode exist
   * 3. if yes send true else send false
   * 
   * 
   */
  try {
      //console.log(req.params);
      const { token } = req.params;
      const user = await User
          .findOne({
          resetPasswordToken: token, 
          resetPasswordTokenExpiry: {$gt: Date.now()}})
          .select("+resetPasswordToken, +resetPasswordTokenExpirty, +password");
      if(!user){
        throw new ApiError(404, "Token expired, resend reset password token email...")
      }

      return res.status(200).json(new ApiResponse(200, "token is found", user))

        

    } catch (error) {
      next(error)
    }
})

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
    } catch (error) {
      next(error)
    }
})

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //console.log("Update Password")
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
