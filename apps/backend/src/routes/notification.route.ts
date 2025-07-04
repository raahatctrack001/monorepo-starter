import express, { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { createNotification } from "../controllers/notification.controllers";

const router = Router();

router.route("/create-notification/:creatorId").post(isUserLoggedIn, createNotification);

export default router;