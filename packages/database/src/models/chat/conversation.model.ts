import mongoose, { Schema, Document, Types } from 'mongoose';

// TypeScript Interface
export interface IConversation extends Document {
//   _id: Types.ObjectId; //already present in Document;
//   conversationId: Types.ObjectId;
  participants: Types.ObjectId[];
  isGroup: boolean;
  groupId?: Types.ObjectId;
  groupName?: string;
  groupImage?: string;
  groupDescription?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  unreadCount?: Record<string, number>;
  pinnedMessages?: Types.ObjectId[];
  mutedBy?: Types.ObjectId[];
  conversationType: string;
  inviteCode?: string;
  messagesCount?: number;
  attachmentsCount?: number;
  archivedBy?: Types.ObjectId[];
  deletedBy?: Types.ObjectId[];
  blockStatus?: Record<string, boolean>;
  allowedMessageTypes?: string;
  lastTypingStatus?: Record<string, Date>;
  isEncrypted?: boolean;
  encryptionKey?: string;
  customTheme?: Record<string, any>;
  customNickname?: Record<string, string>;
  isDeleted?: boolean;
  reportCount?: number;
  activityLogs?: Record<string, any>;
  scheduledMessages?: string;
  customOrder?: Record<string, number>;
}

// Mongoose Schema
const ConversationSchema = new Schema<IConversation>(
  {
    // conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isGroup: { type: Boolean, default: false },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
    groupName: String,
    groupImage: String,
    groupDescription: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: Date,
    unreadCount: { type: Schema.Types.Mixed, default: {} },
    pinnedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    mutedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    conversationType: { type: String, required: true },
    inviteCode: String,
    messagesCount: { type: Number, default: 0 },
    attachmentsCount: { type: Number, default: 0 },
    archivedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockStatus: { type: Schema.Types.Mixed, default: {} },
    allowedMessageTypes: String,
    lastTypingStatus: { type: Schema.Types.Mixed, default: {} },
    isEncrypted: { type: Boolean, default: false },
    encryptionKey: String,
    customTheme: { type: Schema.Types.Mixed, default: {} },
    customNickname: { type: Schema.Types.Mixed, default: {} },
    isDeleted: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    activityLogs: { type: Schema.Types.Mixed, default: {} },
    scheduledMessages: String,
    customOrder: { type: Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true
  }
);

// Mongoose Model
const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
