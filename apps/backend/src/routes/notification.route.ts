import express from 'express';
import * as notificationController from '../controllers/notification.controllers';
import { isUserLoggedIn } from '../middlewares/auth.middleware';

const router = express.Router();

// Notifications for a single user


router
  .route('/create-notification/:userId')
  .post(isUserLoggedIn, notificationController.createNotification)
  .get(isUserLoggedIn, notificationController.getUserNotifications)              // get all
  .delete(isUserLoggedIn, notificationController.deleteAllNotificationsForUser); // delete all

// Create new notification and bulk create
router
  .route('/')
  .post(notificationController.createNotification);

router
  .route('/bulk-create')
  .post(notificationController.bulkCreateNotifications);

// Specific notification by ID
router
  .route('/:notificationId')
  .get(notificationController.getNotificationById)
  .put(notificationController.updateNotification)
  .delete(notificationController.deleteNotification);

// Mark as read / delivered
router
  .route('/:notificationId/read')
  .patch(notificationController.markNotificationAsRead);

router
  .route('/:notificationId/delivered')
  .patch(notificationController.markNotificationAsDelivered);

// Mark all as read for user
router
  .route('/user/:userId/read-all')
  .patch(notificationController.markAllNotificationsAsRead);

// Get unread count for user
router
  .route('/user/:userId/unread-count')
  .get(notificationController.getUnreadNotificationCount);

// Get recent notifications (optionally pass ?limit=10)
router
  .route('/user/:userId/recent')
  .get(notificationController.getRecentNotifications);

export default router;
