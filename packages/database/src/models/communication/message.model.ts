import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFile {
  fieldname: string,
  originalname: string,
  size: number,
  filename?: string,
  encoding?: string,
  mimetype?: string,
  destination?: string,
  path?: string,
}
// "fieldname": "profilePicture",
//         "originalname": "download (2).png",
//         "encoding": "7bit",
//         "mimetype": "image/png",
//         "destination": "C:\\Users\\ROG\\Desktop\\monorepo\\apps\\backend\\src\\middlewares\\public",
//         "filename": "download (2).png",
//         "path": "C:\\Users\\ROG\\Desktop\\monorepo\\apps\\backend\\src\\middlewares\\public\\download (2).png",
//         "size": 583226
export interface IMessage extends Document {
  _id: Types.ObjectId,
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverIds: Types.ObjectId[];
  groupId?: Types.ObjectId;
  messageType: "text" | "image" | "video" | "audio" | "document" | "contact" | "location" | "poll" | "sticker" | "reply" | "forward" | "callLog" | "event" | "system" | string,
  textContent?: string;
  mediaUrl?: string; //could have been objectId //photo or videos or pdf || photos or videos or pdf maxLimit: 5 photo and  1 video at a time
  fileDetail?: IFile, //documents
  thumbnailUrl?: string;
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

const FileSchema = new Schema<IFile> ({
  fieldname: {type: String, required: true},
  originalname: {type: String, required: true},
  size: {type: Number, required: true},
  filename: {type: String},
  encoding: {type: String},
  mimetype: {type: String},
  destination: {type: String},
  path: {type: String},
}, { _id: false })

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    messageType: { 
      type: String, 
      enum: ["text", "image", "video", "audio", "document", "contact", "location", "poll", "sticker", "reply", "forward", "callLog", "event", "system"], 
      default: "text",
      required: true 
    },
    textContent: { type: String },
    mediaUrl: { type: String,},
    thumbnailUrl: { type: String },
    fileDetail: FileSchema,
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
