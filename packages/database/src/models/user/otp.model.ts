import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  userId?: mongoose.Types.ObjectId;    // optional — if attached to a user
  identifier: string;                  // email / phone number / etc.
  otpHash: string;                     // hashed OTP
  purpose: 'email_verification' | 'password_reset' | 'phone_verification' | 'other';
  expiresAt?: Date;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    identifier: {
      type: String,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['email_verification', 'password_reset', 'phone_verification', 'other'],
      required: true,
    },
    expiresAt: {
      type: Date,
      // required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model<IOtp>('Otp', OtpSchema);
export default Otp;
