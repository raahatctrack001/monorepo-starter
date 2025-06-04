import express from "express";
import { upload } from "../middlewares/multer.middleware";
import { otpLimiter, veirfyOtpLimiter } from "../middlewares/rateLimiter.middleware";
import { sendOTP, verifyOTP } from "../controllers/otp.controller";

const router = express.Router();

router.route("/send-otp").post(upload.none(), otpLimiter, sendOTP);
router.route("/verify-otp").post(upload.none(), veirfyOtpLimiter, verifyOTP);

export default router;