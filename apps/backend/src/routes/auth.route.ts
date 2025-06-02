import { isUserLoggedIn } from './../middlewares/auth.middleware';
import { upload } from './../middlewares/multer.middleware';
import express from "express";
import { loginUser, logoutUser, registerUser, sendOTP, verifyOTP } from "../controllers/auth.controller";
import { loginLimiter, otpLimiter, registerLimiter, veirfyOtpLimiter } from '../middlewares/rateLimiter.middleware';


const router = express.Router();


router.route("/register").post(upload.none(), registerLimiter, registerUser);
router.route("/send-otp").post(upload.none(), otpLimiter, sendOTP);
router.route("/verify-otp").post(upload.none(), veirfyOtpLimiter, verifyOTP);
router.route("/login").post(upload.none(), loginLimiter, loginUser);
router.route("/logout").post(upload.none(), isUserLoggedIn, logoutUser);
export default router