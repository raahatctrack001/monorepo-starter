import { z } from 'zod';
import mongoose from 'mongoose';

// ObjectId validation using regex
const objectIdRegex = /^[a-f\d]{24}$/i;

const objectIdSchema = z.string().regex(objectIdRegex, {
  message: 'Invalid ObjectId format',
});

// Notification type enum
const notificationTypeEnum = z.enum([
  'like',
  'comment',
  'follow',
  'mention',
  'repost',
  'reactions',
  'event_invite',
  'system',
]);

// Priority enum
const priorityEnum = z.enum(['low', 'normal', 'high']);

// Main Notification schema
export const notificationSchema = z.object({
  receiverId: objectIdSchema,
  type: notificationTypeEnum,
  targetId: objectIdSchema,
  message: z.string().min(1),
  senderId: objectIdSchema,
  actionUrl: z.string().url(),
  delivered: z.boolean().optional(),
  read: z.boolean().optional(),
  pushSent: z.boolean().optional(),
  emailSent: z.boolean().optional(),
  priority: priorityEnum,
  isSystem: z.boolean().optional(),
  meta: z.any().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Type from schema if needed elsewhere
export type NotificationInput = z.infer<typeof notificationSchema>;
