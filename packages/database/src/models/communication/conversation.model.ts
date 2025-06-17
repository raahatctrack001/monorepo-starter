import mongoose, { Schema, Document, Types } from "mongoose";

// TypeScript interface
export interface IConversation extends Document {
  conversationId?: Types.ObjectId;
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
  conversationType?: string;
  inviteCode?: string;
  messagesCount?: number;
  attachmentsCount?: number;
  archivedBy?: Types.ObjectId[];
  deletedBy?: Types.ObjectId[];
  blockStatus?: Record<string, boolean>;
  allowedMessageTypes?: string;
  lastTypingStatus?: Record<string, Date>;
  isEncrypted: boolean;
  encryptionKey?: string;
  customTheme?: {
    user: {
      color: string;
      bg: string;
      imageURL: string;
      fontSize: string;
    }
  }[];
  customNickname?: {
    user: string;
  }[];
  isDeleted: boolean;
  reportCount: number;
  activityLogs?: any;
  scheduledMessages?: string;
  customOrder?: Record<string, number>;
}

// Mongoose Schema
const ConversationSchema = new Schema<IConversation>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, required: true, default: false },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    groupName: { type: String },
    groupImage: { type: String },
    groupDescription: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: { type: Date },
    unreadCount: { type: Schema.Types.Mixed, default: {} },
    pinnedMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    mutedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    conversationType: { type: String },
    inviteCode: { type: String },
    messagesCount: { type: Number, default: 0 },
    attachmentsCount: { type: Number, default: 0 },
    archivedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    deletedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockStatus: { type: Schema.Types.Mixed, default: {} },
    allowedMessageTypes: { type: String },
    lastTypingStatus: { type: Schema.Types.Mixed, default: {} },
    isEncrypted: { type: Boolean, default: false },
    encryptionKey: { type: String },
    customTheme: [
      {
        user: {
          color: { type: String },
          bg: { type: String },
          imageURL: { type: String },
          fontSize: { type: String },
        },
      },
    ],
    customNickname: [
      {
        user: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    activityLogs: { type: Schema.Types.Mixed, default: {} },
    scheduledMessages: { type: String },
    customOrder: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
