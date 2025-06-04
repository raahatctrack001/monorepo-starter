import { isUserLoggedIn } from './../middlewares/auth.middleware';
import { upload } from './../middlewares/multer.middleware';
import express from "express";
import { deleteUser, forgotPassword, loginUser, logoutUser, registerUser, resetPassword, updatePassword, verifyResetPasswordToken, } from "../controllers/auth.controller";
import { loginLimiter,registerLimiter } from '../middlewares/rateLimiter.middleware';


const router = express.Router();


router.route("/register").post(upload.none(), registerLimiter, registerUser);
router.route("/login").post(upload.none(), loginLimiter, loginUser);
router.route("/logout").post(upload.none(), isUserLoggedIn, logoutUser);

router.route("/update-password/:userId").patch(upload.none(), isUserLoggedIn,  updatePassword);
router.route("/send-reset-password-token").post(upload.none(), forgotPassword); //send reset password token
router.route("/verify-reset-password-token/:token").post(verifyResetPasswordToken);
router.route("/reset-password/:token").patch(upload.none(), resetPassword);
router.route("/delete-user").delete(isUserLoggedIn, deleteUser);
export default router