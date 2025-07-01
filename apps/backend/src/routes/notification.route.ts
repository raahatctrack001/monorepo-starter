import express, { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { testController } from "../controllers/notification.controllers";

const router = Router();

router.route("/test").post(isUserLoggedIn, testController);

export default router;