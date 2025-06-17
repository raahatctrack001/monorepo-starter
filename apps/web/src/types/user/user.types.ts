import { Types } from "mongoose";

export interface IDevice {
    _id?: string,
    type: "Mobile" | "Desktop" | "Tablet",
    os: string,
    browser: string,
    resolution: string,
    language: string,
    timezone: string,
    useragent: string,
    token: string,
    // platform: string,
  }
export interface IWebsite{
  url: string;
  name?: string; 
  desc?: string; 
}
export interface IUser {
  _id: string,
  //basic details
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatar?: string[];
  coverPhoto?: string[];
  bio?: string[];
  audioBio?: string[];
  videoIntro?: string[];
  gender?: 'male' | 'female' | 'other';
  birthday?: Date;
  themePreference: 'light' | 'dark' | 'system';
  website?: IWebsite[];

  //device details
  location?: {country: string, state: string, city: string}[];
  status: 'active' | 'banned' | 'deleted';
  role: 'User' | 'Moderator' | 'Admin';
  language?: string;
  device: IDevice[],
  lastLogin: Date;
  loginCount: number;
  loginDetail: { loginTimestamp: Date; deviceToken: string }[];
  lastLogout: Date;
  logoutDetail: { logoutTimestamp: Date; deviceToken: string }[];

  //interaction details
  badges?: string[];
  followers?: Types.ObjectId[];
  followings?: Types.ObjectId[];
  mutedUsers?: Types.ObjectId[];
  mutedGroups?: Types.ObjectId[];
  closeFriends?: Types.ObjectId[];
  groups?: Types.ObjectId[];
  blockedUser?: Types.ObjectId[];
  savedPost?: Types.ObjectId[];
  storyHighlights?: Types.ObjectId[];
  notifications?: Types.ObjectId[];
  liveStreamHosted?: Types.ObjectId[];
  eventsParticipated?: Types.ObjectId[];
  vrRoomsJoined?: Types.ObjectId[];
  reportedContentCount?: number;
  reportedCount?: { type: string; contentId: Types.ObjectId }[];
  paymentHistory?: Types.ObjectId[];
  contentModeratorStrikeCount?: number;
  preferredCatory?: string[];
  searchHistory?: Types.ObjectId[];
  recentHistory?: Types.ObjectId[];
  feedbackGiven?: Types.ObjectId[];
  postsCount?: number;
  postsCreated?: Types.ObjectId[];
  commentsCount?: number;
  comments?: Types.ObjectId[];
  likesGiven?: number;
  likesReceived?: number;
  preferences?: { categories: string }[];
  vrAvatarConfig?: Record<string, unknown>;

  //verification details;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  premiumStatus?: 'none' | 'gold' | 'platinum';
  premiumExpiresAt?: Date;
  gamingStats?: Record<string, unknown>;
  deletedAt?: Date;
  otpStore?: Types.ObjectId[],
  otp?: string,
  refreshToken?: string,
  resetPasswordToken?: string,
  resetPasswordTokenExpiry?: Date,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSliceStateSchema {
  currentUser: IUser|null,
}