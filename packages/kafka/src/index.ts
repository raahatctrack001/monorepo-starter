import { INotification } from "@repo/database";

import { produceNotification } from "./producers/notification.producer";
import mongoose from "mongoose";

export * from "./config/kafka";
export * from "./producers/notification.producer";

const data = {
    _id: "685de70ac8855f4e2df217b4",
    receiverId: new mongoose.Types.ObjectId("6853afbde78ba1764d5e5ff9"),
    type: "follow",
    targetId: "685663e151695cec3d2c29a0",
    message: "test notification",
    senderId: new mongoose.Types.ObjectId("6853afbde78ba1764d5e5ff9"),
    delivered: false,
    read: false,
    pushSent: false,
    emailSent: false,
    priority: "normal",
    isSystem: false,
    createdAt: new Date(),
    updatedAt: new Date(),
}

produceNotification(data as INotification);
