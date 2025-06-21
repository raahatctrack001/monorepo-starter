import mongoose, { Types, Document, Schema } from "mongoose";

export type PollVisibility = "public" | "private" | "restricted";
export type PollType = "standard" | "quiz" | "feedback";
export type PollIn = "conversation" | "poll" | "general";

export interface IVoteHistory {
  user: Types.ObjectId;
  votedFor: string[]; // Array of option strings or option IDs
}

export interface IPoll extends Document {
    _id: Types.ObjectId;
    createdBy: Types.ObjectId;
    question: string;
    options: string[];
    answers?: Record<string, string>; //question: answer // could type further if structured
    pollIn?: PollIn,
    conversationId?: Types.ObjectId,
    postId?: Types.ObjectId,
    votesHistory?: IVoteHistory[];
    createdAt?: Date;
    visibility?: PollVisibility;
    isAnonymous?: boolean;
    allowMultipleVotes?: boolean;
    maxVotesPerUser?: number;
    totalVotes?: number;
    resultVisible?: boolean;
    hasCommentSection?: boolean;
    comments?: Types.ObjectId[];
    isPublic?: boolean;
    pollType?: PollType;
    isSharingAllowed?: boolean;
    resultType?: string;
    duration?: number;
    reward?: string;
    meta?: any;
    isActive?: boolean;
    updatedAt?: Date;
    expiresAt?: Date;
}

const voteHistorySchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  votedFor: [{ type: String }]
});

const pollSchema = new Schema<IPoll>({
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: Schema.Types.ObjectId },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answers: { type: Map, of: String, default: {} },
    pollIn: {type: String, enum: ["post", "conversation", "general"]},
    conversationId: {type: Schema.Types.ObjectId, ref: "Conversation"},
    postId: {type: Schema.Types.ObjectId, ref: "Post"},
    createdAt: { type: Date, default: Date.now },
    visibility: { type: String, enum: ["public", "private", "restricted"], default: "public" },
    isAnonymous: { type: Boolean, default: false },
    allowMultipleVotes: { type: Boolean, default: false },
    maxVotesPerUser: { type: Number, default: 1 },
    totalVotes: { type: Number, default: 0 },
    resultVisible: { type: Boolean, default: true },
    hasCommentSection: { type: Boolean, default: false },
    comments: [{ type:  Schema.Types.ObjectId, ref: "PollComment" }],
    pollType: { type: String, enum: ["standard", "quiz", "feedback"], default: "standard" },
    isPublic: { type: Boolean, default: true },
    votesHistory: [voteHistorySchema],
    isSharingAllowed: { type: Boolean, default: true },
    resultType: { type: String, default: "percentage" },
    duration: { type: Number, default: 0 }, // in minutes/hours depending on business logic
    reward: { type: String },
    meta: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

const Poll = mongoose.model<IPoll>("Poll", pollSchema);
export default Poll;