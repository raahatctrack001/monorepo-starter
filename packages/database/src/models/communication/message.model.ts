import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
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
  isEdited: boolean;
  editedAt?: Date;
  isPinned: boolean;
  reactions?: Record<string, Types.ObjectId[]>;
  scheduledAt?: Date;
  sentAt: Date;
  deliveredTo?: Types.ObjectId[];
  seenBy?: Types.ObjectId[];
  systemEventType?: string;
  systemEventData?: Record<string, any>;
  isEncrypted: boolean;
  encryptionKey?: string;
  extraMetadata?: Record<string, any>;
  deletedByAdmin: boolean;
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
    textContent: { type: String },
    mediaUrl: { type: Schema.Types.ObjectId, ref: "MediaURL" },
    thumbnailUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    contactDetails: { type: Schema.Types.Mixed },
    location: { type: Schema.Types.Mixed },
    pollDetails: { type: Schema.Types.ObjectId, ref: "Poll" },
    voiceNoteUrl: { type: String },
    callLog: { type: Schema.Types.Mixed },
    eventDetails: { type: Schema.Types.Mixed },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    forwardedFrom: { type: Schema.Types.ObjectId, ref: "Message" },
    forwardedFromUser: { type: Schema.Types.ObjectId, ref: "User" },
    isDeletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isPinned: { type: Boolean, default: false },
    reactions: { type: Schema.Types.Mixed },
    scheduledAt: { type: Date },
    sentAt: { type: Date, default: Date.now },
    deliveredTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    systemEventType: { type: String },
    systemEventData: { type: Schema.Types.Mixed },
    isEncrypted: { type: Boolean, default: false },
    encryptionKey: { type: String },
    extraMetadata: { type: Schema.Types.Mixed },
    deletedByAdmin: { type: Boolean, default: false },
    priorityLevel: { type: String },
    attachmentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
