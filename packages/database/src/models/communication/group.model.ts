import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGroup extends Document {
  groupId: string;
  groupName: string;
  description?: string;
  groupType?: string;
  creatorId: Types.ObjectId;
  groupLogo?: string;
  groupCover?: string;
  membersCount: number;
  members: Types.ObjectId[];
  admins: Types.ObjectId[];
  groupCategory?: string;
  tags?: string;
  isActive: boolean;
  isVerified: boolean;
  privacyLevel: "open" | "close" | "hidden";
  rules?: string;
  moderators: Types.ObjectId[];
  lastActivity?: Date;
  groupURL?: string;
  invitesEnabled: boolean;
  pendingInvites: Types.ObjectId[];
  inviteCode?: string;
  joinRequests: Types.ObjectId[];
  events: Types.ObjectId[];
  pinnedPosts: Types.ObjectId[];
  postApprovalRequired: boolean;
  groupJoinDate?: Record<string, { joinedDate: Date; exitDate?: Date }>;
  isPublicContent: boolean;
  activityLogs?: any;
  reportsCount: number;
  reportedPosts: Types.ObjectId[];
  polls: Types.ObjectId[];
  groupInviteHistory: Types.ObjectId[];
  achievements?: Record<string, any>;
  scheduledPosts?: { post: Types.ObjectId; scheduledAt: Date }[];
  subscriptions?: string;
  bannerImage?: string;
  externalLinks?: string;
  isArchived: boolean;
  archivedAt?: Date;
  groupMessages: Types.ObjectId[];
  sharedFiles: Types.ObjectId[];
  mediaGallery: Types.ObjectId[];
  announcement?: Types.ObjectId;
  notificationSettings?: {
    sendToAllMembers: boolean;
    allowCustomNotification: boolean;
  };
  mentionSettings?: {
    allowMentions: boolean;
    mentionLimit?: number;
  };
  groupHistoryHighlights: Types.ObjectId[];
  isBroadcastAllowed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    groupId: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    description: { type: String },
    groupType: { type: String },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupLogo: { type: String },
    groupCover: { type: String },
    membersCount: { type: Number, default: 0 },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupCategory: { type: String },
    tags: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    privacyLevel: {
      type: String,
      enum: ["open", "close", "hidden"],
      default: "open",
    },
    rules: { type: String },
    moderators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastActivity: { type: Date },
    groupURL: { type: String },
    invitesEnabled: { type: Boolean, default: true },
    pendingInvites: [{ type: Schema.Types.ObjectId, ref: "Invite" }],
    inviteCode: { type: String },
    joinRequests: [{ type: Schema.Types.ObjectId, ref: "GroupJoinRequest" }],
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    pinnedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    postApprovalRequired: { type: Boolean, default: false },
    groupJoinDate: { type: Schema.Types.Mixed },
    isPublicContent: { type: Boolean, default: false },
    activityLogs: { type: Schema.Types.Mixed },
    reportsCount: { type: Number, default: 0 },
    reportedPosts: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    polls: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
    groupInviteHistory: [{ type: Schema.Types.ObjectId, ref: "Invite" }],
    achievements: { type: Schema.Types.Mixed },
    scheduledPosts: [
      {
        post: { type: Schema.Types.ObjectId, ref: "Post" },
        scheduledAt: { type: Date },
      },
    ],
    subscriptions: { type: String },
    bannerImage: { type: String },
    externalLinks: { type: String },
    isArchived: { type: Boolean, default: false },
    archivedAt: { type: Date },
    groupMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    sharedFiles: [{ type: Schema.Types.ObjectId, ref: "SharedFile" }],
    mediaGallery: [{ type: Schema.Types.ObjectId, ref: "MediaURL" }],
    announcement: { type: Schema.Types.ObjectId, ref: "Announcement" },
    notificationSettings: {
      sendToAllMembers: { type: Boolean, default: true },
      allowCustomNotification: { type: Boolean, default: true },
    },
    mentionSettings: {
      allowMentions: { type: Boolean, default: true },
      mentionLimit: { type: Number, default: 10 },
    },
    groupHistoryHighlights: [{ type: Schema.Types.ObjectId, ref: "Story" }],
    isBroadcastAllowed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Group = mongoose.model<IGroup>("Group", GroupSchema);
export default Group;
