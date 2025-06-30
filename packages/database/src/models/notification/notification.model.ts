import mongoose, { Schema, Document, Types } from 'mongoose';

// 1️⃣ TypeScript Interface for Notification
export interface INotification extends Document {
  receiverId: Types.ObjectId; //
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'reactions' | 'event_invite' | 'system';
  targetId: any;
  message: string;
  senderId: Types.ObjectId; //liker commenter follower .... or system
  actionUrl: string;
  delivered: boolean;
  read: boolean;
  pushSent: boolean;
  emailSent: boolean;
  priority: 'low' | 'normal' | 'high';
  isSystem: boolean;
  meta: any;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Mongoose Schema for Notification
const NotificationSchema: Schema = new Schema<INotification>(
  {
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'mention', 'repost', 'reactions', 'event_invite', 'system'],
      required: true,
    },
    targetId: { type: Schema.Types.Mixed, required: false },
    message: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actionUrl: { type: String, required: false },
    delivered: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    pushSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    isSystem: { type: Boolean, default: false },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  }
);

// 3️⃣ Mongoose Model
const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
