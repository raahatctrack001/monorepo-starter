import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ApiError from '../utils/apiError';
import { Notification } from '@repo/database';
import ApiResponse from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { validateData } from '../utils/zod.validator';
import { notificationSchema } from '@repo/common'
// Create a new notification
export const createNotification = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
    console.log("jsfklsadfj")
    const { userId } = req.params;
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(404, 'Either userId is missing or invalid')
    }

    if(req.user?._id !== userId){
        throw new ApiError(401, 'Unauthorized attempt')
    }

    const { receiverId, type, targetId, message, actionURL } = req.body;
    if([receiverId, type, targetId, message, actionURL].some(field=>field.trim()?0:1)){
        throw new ApiError(404, 'required fields are missing: check recieverId, type, targetId, message or actionURL')
    }

    const systemId = new mongoose.Types.ObjectId().toString();
    await validateData(notificationSchema, {
        receiverId, 
        type, 
        senderId: userId,
        targetId: type === 'system' ? systemId : userId, 
        message, 
        actionURL
    });

    const notification = await Notification.create({
        receiverId,
        senderId: type === 'system'
            ? systemId
            : new mongoose.Types.ObjectId(userId),
        type,
        targetId,
        actionURL,  // fixed casing here
        message,
    });


    if(!notification){
        throw new ApiError(500, 'Failed to create notification');
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, 'Notification Created', notification)
    )
  } catch (error) {
    next(error);
  }
});

// Get all notifications for a user
export const getUserNotifications = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Get a notification by its ID
export const getNotificationById = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Mark a notification as read
export const markNotificationAsRead = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Mark all notifications for a user as read
export const markAllNotificationsAsRead = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Delete a notification by ID
export const deleteNotification = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Delete all notifications for a user
export const deleteAllNotificationsForUser = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Update a notification (priority, delivered, etc.)
export const updateNotification = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Mark notification as delivered
export const markNotificationAsDelivered = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Get unread notification count for a user
export const getUnreadNotificationCount = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Bulk create notifications (for system messages, etc.)
export const bulkCreateNotifications = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});

// Get recent N notifications for a user (with pagination)
export const getRecentNotifications = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation here
  } catch (error) {
    next(error);
  }
});
