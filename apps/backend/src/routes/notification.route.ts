import express from 'express';
import * as notificationController from '../controllers/notification.controllers';

const router = express.Router();

// Create a new notification
router.post('/create-notification', notificationController.createNotification);

// Bulk create notifications (e.g., system announcements)
router.post('/bulk-create', notificationController.bulkCreateNotifications);

// Get all notifications for a specific user
router.get('/user/:userId', notificationController.getUserNotifications);

// Get a single notification by its ID
router.get('/:notificationId', notificationController.getNotificationById);

// Mark a notification as read
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);

// Mark all notifications for a user as read
router.patch('/user/:userId/read-all', notificationController.markAllNotificationsAsRead);

// Delete a single notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Delete all notifications for a user
router.delete('/user/:userId', notificationController.deleteAllNotificationsForUser);

// Update a notification (priority, delivery status, etc.)
router.put('/:notificationId', notificationController.updateNotification);

// Mark a notification as delivered (for push delivery tracking)
router.patch('/:notificationId/delivered', notificationController.markNotificationAsDelivered);

// Get unread notification count for a user
router.get('/user/:userId/unread-count', notificationController.getUnreadNotificationCount);

// Get recent N notifications for a user (optional query param ?limit=10)
router.get('/user/:userId/recent', notificationController.getRecentNotifications);

export default router;
