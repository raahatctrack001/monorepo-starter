import { produceNotification } from '@repo/kafka';
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Notification } from "@repo/database";

    
export const testController = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    const notification = await Notification.find({});
    await produceNotification(notification[0]);
    res.status(200).json({message: "fetched", data: notification[0] });
});