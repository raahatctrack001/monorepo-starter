import { upload } from './../middlewares/multer.middleware';
import express from "express";
import { loginUser, registerUser, sendOTP, verifyOTP } from "../controllers/auth.controller";

const router = express.Router();


router.route("/register").post(upload.none(), registerUser);
router.route("/send-otp").post(upload.none(), sendOTP);
router.route("/verify-otp").post(upload.none(), verifyOTP);
router.route("/login").post(upload.none(), loginUser);
export default router