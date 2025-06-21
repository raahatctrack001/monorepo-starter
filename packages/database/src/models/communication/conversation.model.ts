import mongoose, { Schema, Document, Types } from "mongoose";

// TypeScript interface
export interface IConversation extends Document {
    _id: string,
    participants: Types.ObjectId[];
    isGroup: boolean;
    groupId?: Types.ObjectId;
    conversationName?: string;
    conversationImage?: string;
    conversationDescription?: string;
    createdBy: Types.ObjectId;
    lastMessage?: Types.ObjectId;
    lastMessageAt?: Date;
    unreadCount?: Record<string, number>;
    pinnedMessages?: Types.ObjectId[];
    mutedBy?: Types.ObjectId[];
    conversationType?: "personal"| "group"| "broadcast"| "secret"| string;
    inviteCode?: string;
    messagesCount?: number;
    attachmentsCount?: number;
    archivedBy?: Types.ObjectId[];
    blockStatus?: Record<string, boolean>;
    allowedMessageTypes?: string;
    lastTypingStatus?: Record<string, Date>;
    isEncrypted: boolean;
    encryptedKeys?: Record<string, string>;
    customTheme?: {
      user: {
        color: string;
        bg: string;
        imageURL: string;
        fontSize: string;
      }
    }[];
    customNickname?: Record<string, string>,
    isDeleted: boolean;
    deletedBy?: Types.ObjectId[];
    reportCount: number;
    activityLogs?: any;
    scheduledMessages?: string;
    customOrder?: Record<string, number>;
    createdAt: Date;
    updatedAt: Date;
  }   
  
  //Mongoose Schema
  const ConversationSchema = new Schema<IConversation>({
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, required: true, default: false },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    conversationName: { type: String },
    conversationImage: { type: String },
    conversationDescription: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: {type: Date, default: Date.now},
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    pinnedMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    mutedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    conversationType: { type: String, enum: ["personal", "group", "broadcast", "secret"] },
    inviteCode: { type: String },
    messagesCount: { type: Number, default: 0 },
    attachmentsCount: { type: Number, default: 0 },
    archivedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    deletedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockStatus: { type: Schema.Types.Mixed, default: {} },
    allowedMessageTypes: { type: String },
    lastTypingStatus: { type: Schema.Types.Mixed, default: {} },
    isEncrypted: { type: Boolean, default: false },
    encryptedKeys: {
      type: Map,
      of: String // base64 encrypted AES keys
    },
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
    customNickname: {
      type: Map,
      of: String
    },
    isDeleted: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    activityLogs: { type: Schema.Types.Mixed, default: {} },
    scheduledMessages: [{ type: String }],
    customOrder: [{ type: Schema.Types.Mixed, default: {} }],
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
