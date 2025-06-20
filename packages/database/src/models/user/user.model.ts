import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDevice {
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
export interface IStatusUpdateDetails {
  status: 'active' | 'banned' | 'deleted' | 'deactivated';
  reason: string,
  timestamp: Date,
  device: IDevice,
}
export interface IUser extends Document {
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
  website?: { name: string; desc: string; url: string }[];

  //device details
  location?: {country: string, state: string, city: string}[];
  status: 'active' | 'banned' | 'deleted' | 'deactivated';
  statusUpdateDetails?: IStatusUpdateDetails[]
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
  publicKey: string
  createdAt: Date;
  updatedAt: Date;
}


const deviceSchema = new mongoose.Schema({
  type: String,
  os: String,
  useragent: String,
  language: String,
  timezone: String,
  resolution: String,
  browser: String,
  token: String,
}, { _id: false }); // if you don't want an _id for each device entry

const statusUpdateSchema = new mongoose.Schema({
  status: { type: String, enum: ['active', 'banned', 'deactivated', 'deleted'] },
  reason: String,
  timestamp: Date,
  device: { type: Schema.Types.ObjectId, ref: "deviceSchema"}
}, { _id: false })

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    email: { type: String, unique: true, required: true },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: String,
    phoneVerified: { type: Boolean, default: false },
    avatar: [String],
    coverPhoto: [String],
    bio: [String],
    audioBio: [String],
    videoIntro: [String],
    location: [
      {
        country: String,
        state: String,
        city: String,
      }
    ],
    website: [
      {
        name: String,
        desc: String,
        url: String,
      },
    ],
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthday: Date,
    status: { type: String, enum: ['active', 'banned', 'deactivated', 'deleted'], default: 'active' },
    statusUpdateDetails: [statusUpdateSchema],
    role: { type: String, enum: ['User', 'Moderator', 'Admin'], default: 'User' },
    themePreference: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: String,
    device: [deviceSchema],
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    loginDetail: [
      {
        loginTimestamp: Date,
        deviceToken: String,
      },
    ],
    lastLogout: {type: Date, default: Date.now},
    logoutDetail: [
      {
        logoutTimestamp: Date,
        deviceToken: String,
      },
    ],


    badges: [String],
    followers: [{ type: Schema.Types.ObjectId, ref: 'Follow' }],
    followings: [{ type: Schema.Types.ObjectId, ref: 'Follow' }],
    mutedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mutedGroups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    closeFriends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    blockedUser: [{ type: Schema.Types.ObjectId, ref: 'BlockedUser' }],
    savedPost: [{ type: Schema.Types.ObjectId, ref: 'SavedPost' }],
    storyHighlights: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    liveStreamHosted: [{ type: Schema.Types.ObjectId, ref: 'Livestream' }],
    eventsParticipated: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    vrRoomsJoined: [{ type: Schema.Types.ObjectId, ref: 'VRRoom' }],
    // deviceTokens: [String],/
    reportedContentCount: { type: Number, default: 0 },
    reportedCount: [
      {
        type: { type: String, enum: ['post', 'reel', 'comment'] },
        contentId: Schema.Types.ObjectId,
      },
    ],
    paymentHistory: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    contentModeratorStrikeCount: { type: Number, default: 0 },
    preferredCatory: [String],
    searchHistory: [{ type: Schema.Types.ObjectId, ref: 'SearchHistory' }],
    recentHistory: [{ type: Schema.Types.ObjectId, ref: 'RecentHistory' }],
    feedbackGiven: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
    
    twoFactorEnabled: { type: Boolean, default: false },
    premiumStatus: { type: String, enum: ['none', 'gold', 'platinum'], default: 'none' },
    premiumExpiresAt: Date,
    postsCount: { type: Number, default: 0 },
    postsCreated: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    commentsCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likesGiven: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
    preferences: [
      {
        categories: String,
      },
    ],
    vrAvatarConfig: { type: Schema.Types.Mixed },
    gamingStats: { type: Schema.Types.Mixed },
    deletedAt: Date,
    otpStore: [{ type: Schema.Types.ObjectId, ref: 'Otp' }],
    refreshToken: { type: String, default: "", select: false  },
    resetPasswordToken: { type: String, default: "", select: false },
    resetPasswordTokenExpiry: { type: Date, select: false },
    publicKey: {type: String, required: true},
    otp: {  type: String, select: false  }
  },
  { timestamps: true }
);

  
const User = mongoose.model<IUser>('User', UserSchema);
export default User;