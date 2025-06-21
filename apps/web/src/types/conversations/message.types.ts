import { Types } from "mongoose";

export interface IFile {
  fieldname?: string,
  originalname?: string,
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

export interface IMessage {
  _id: string,
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

export interface MessageSliceSchema {
  conversations: Record<string, IMessage[]>;
}