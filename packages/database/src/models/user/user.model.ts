import mongoose, { Schema, Document, Types } from 'mongoose';
import  bcrypt  from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from "crypto";
//schema = mongoose.schema
//Types = mongoose.schema.Types.ObjectId

export interface IUser extends Document {
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
  location?: string;
  website?: { name: string; desc: string; url: string }[];
  gender?: 'male' | 'female' | 'other';
  birthday?: Date;
  status: 'active' | 'banned' | 'deleted';
  roles: 'User' | 'Moderator' | 'Admin';
  themePreference: 'light' | 'dark' | 'system';
  language?: string;
  lastLogin: Date;
  loginCount: number;
  loginDetail: { loginTimestamp: Date; device: string }[];
  lastLogout: Date;
  logoutDetail: { logoutTimestamp: Date; device: string }[];
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
  deviceTokens?: string[];
  reportedContentCount?: number;
  reportedCount?: { type: string; contentId: Types.ObjectId }[];
  paymentHistory?: Types.ObjectId[];
  contentModeratorStrikeCount?: number;
  preferredCatory?: string[];
  searchHistory?: Types.ObjectId[];
  recentHistory?: Types.ObjectId[];
  feedbackGiven?: Types.ObjectId[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  premiumStatus?: 'none' | 'gold' | 'platinum';
  premiumExpiresAt?: Date;
  postsCount?: number;
  postsCreated?: Types.ObjectId[];
  commentsCount?: number;
  comments?: Types.ObjectId[];
  likesGiven?: number;
  likesReceived?: number;
  preferences?: { categories: string }[];
  vrAvatarConfig?: Record<string, unknown>;
  gamingStats?: Record<string, unknown>;
  deletedAt?: Date;
  otpStore?: Types.ObjectId[],
  refreshToken?: String,
  otp?: String,
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    phoneNumber: String,
    avatar: [String],
    coverPhoto: [String],
    bio: [String],
    audioBio: [String],
    videoIntro: [String],
    location: String,
    website: [
      {
        name: String,
        desc: String,
        url: String,
      },
    ],
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthday: Date,
    status: { type: String, enum: ['active', 'banned', 'deleted'], default: 'active' },
    roles: { type: String, enum: ['User', 'Moderator', 'Admin'], default: 'User' },
    themePreference: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: String,
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    loginDetail: [
      {
        loginTimestamp: Date,
        device: String,
      },
    ],
    lastLogout: {type: Date, default: Date.now},
    logoutDetail: [
      {
        logoutTimestamp: Date,
        device: String,
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
    deviceTokens: [String],
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
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
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
    otp: {  type: String, select: false  }
  },
  { timestamps: true }
);

UserSchema.methods.isPasswordCorrect = function(password: string){
    return bcrypt.compare(password, this.password)
}

// UserSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//             fullName: this.fullName,
//         },
//         process.env.ACCESS_TOKEN_SECRET!,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//         }
//     )
// }
// UserSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             username: this.username,
//             fullName: this.fullName,
            
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//         }
//     )
// }

// Generate password reset token

UserSchema.methods.generateResetPasswordToken = function () {
    // Gernerate token
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    // Hash and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Set token expire time
    this.resetPasswordTokenExpiry = Date.now() + 30 * 60 * 1000;  
    return resetToken;
  };
  
const User = mongoose.model<IUser>('User', UserSchema);
export default User;