import { Types } from "mongoose";

export interface IConversation {
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
    customNickname: Record<string, string>,
    isDeleted: boolean;
    deletedBy?: Types.ObjectId[];
    reportCount: number;
    activityLogs?: any;
    scheduledMessages?: string;
    customOrder?: Record<string, number>;
    createdAt: Date;
    updatedAt: Date;
  }  

  export interface ConversationSliceStateSchema {
    conversations: IConversation[],
    activeConversation: IConversation|null,
  }