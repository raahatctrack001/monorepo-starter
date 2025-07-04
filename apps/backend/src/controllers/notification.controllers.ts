import { produceNotification } from '@repo/kafka';
import { notificationSchema } from '@repo/common';
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Notification } from "@repo/database";
import ApiError from '../utils/apiError';
import mongoose from 'mongoose';
import { validateData } from '../utils/zod.validator';
import ApiResponse from '../utils/apiResponse';

    
export const createNotification = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { creatorId } = req.params;
        if(!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)){
            throw new ApiError(404, 'Either userId is missing or invalid')
        }

        if(req.user?._id !== creatorId){
            throw new ApiError(401, 'Unauthorized attempt')
        }

        await validateData(notificationSchema, req.body);

        const notification = await Notification.create(req.body);
        if (!notification) {
          throw new ApiError(500, 'Failed to create notification');
        }        
        await produceNotification(notification)
        return res.status(201).json(
          new ApiResponse(201, 'Success Message', notification)
        );
    } catch (error) {
        next(error)
    }
        // receiverId: Types.ObjectId; //to whome sending
        // type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'reactions' | 'event_invite' | 'system';
        // targetId: any; //likedId, commedId, followId
        // message: string;
        // senderId: Types.ObjectId; //liker commenter follower .... or system
        // actionUrl: string;
        // delivered?: boolean;
        // read?: boolean;
        // pushSent: boolean;
        // emailSent: boolean;
        // priority: 'low' | 'normal' | 'high';
        // isSystem: boolean;
        // meta?: any;
        // createdAt?: Date;
        // updatedAt?: Date;
});