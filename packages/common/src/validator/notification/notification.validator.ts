import { z } from 'zod';

// Regex to match MongoDB ObjectId (24-char hex)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const notificationSchema = z.object({
  receiverId: objectIdSchema,
  type: z.enum([
    'like',
    'comment',
    'follow',
    'mention',
    'repost',
    'reactions',
    'event_invite',
    'system',
  ]),
  targetId: objectIdSchema, // could be refined if you have expected types
  message: z.string().min(1, 'Message cannot be empty'),
  senderId: z.string(),
  actionURL: z.string().url('Invalid action URL'),
  delivered: z.boolean().optional(),
  read: z.boolean().optional(),
  pushSent: z.boolean().optional(),
  emailSent: z.boolean().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  isSystem: z.boolean().optional(),
  meta: z.any().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
