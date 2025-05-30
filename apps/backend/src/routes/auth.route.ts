import { upload } from './../middlewares/multer.middleware';
import express from "express";
import { registerUser } from "../controllers/auth.controller";

const router = express.Router();


router.route("/register").post(upload.none(), registerUser);
export default router