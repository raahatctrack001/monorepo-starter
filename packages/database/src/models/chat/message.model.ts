import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverIds: Types.ObjectId[];
  groupId?: Types.ObjectId;
  messageType: string;
  textContent?: string;
  mediaUrl?: Types.ObjectId;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  contactDetails?: Record<string, any>;
  location?: Record<string, any>;
  pollDetails?: Types.ObjectId;
  voiceNoteUrl?: string;
  callLog?: Record<string, any>;
  eventDetails?: Record<string, any>;
  replyTo?: Types.ObjectId;
  forwardedFrom?: Types.ObjectId;
  forwardedFromUser?: Types.ObjectId;
  isDeletedFor?: Types.ObjectId[];
  isEdited?: boolean;
  editedAt?: Date;
  isPinned?: boolean;
  reactions?: Record<string, Types.ObjectId[]>;
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredTo?: Types.ObjectId[];
  seenBy?: Types.ObjectId[];
  systemEventType?: string;
  systemEventData?: Record<string, any>;
  isEncrypted?: boolean;
  encryptionKey?: string;
  extraMetadata?: Record<string, any>;
  deletedByAdmin?: boolean;
  priorityLevel?: string;
  attachmentsCount?: number;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    messageType: { type: String, required: true },
    textContent: String,
    mediaUrl: { type: Schema.Types.ObjectId, ref: "MediaURL" },
    thumbnailUrl: String,
    fileName: String,
    fileSize: Number,
    contactDetails: Schema.Types.Mixed,
    location: Schema.Types.Mixed,
    pollDetails: { type: Schema.Types.ObjectId, ref: "Poll" },
    voiceNoteUrl: String,
    callLog: Schema.Types.Mixed,
    eventDetails: Schema.Types.Mixed,
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    forwardedFrom: { type: Schema.Types.ObjectId, ref: "Message" },
    forwardedFromUser: { type: Schema.Types.ObjectId, ref: "User" },
    isDeletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    isPinned: { type: Boolean, default: false },
    reactions: Schema.Types.Mixed,
    scheduledAt: Date,
    sentAt: { type: Date, default: Date.now },
    deliveredTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    systemEventType: String,
    systemEventData: Schema.Types.Mixed,
    isEncrypted: { type: Boolean, default: false },
    encryptionKey: String,
    extraMetadata: Schema.Types.Mixed,
    deletedByAdmin: { type: Boolean, default: false },
    priorityLevel: String,
    attachmentsCount: Number,
  },
  { timestamps: true }
);

const Message = model<IMessage>("Message", MessageSchema);
export default Message;