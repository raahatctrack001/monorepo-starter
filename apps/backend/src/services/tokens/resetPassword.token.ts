import crypto from 'crypto';
import { User } from '@repo/database'; // or your user model import

export const generatePasswordResetToken = async (userId: string) => {
  // Generate a random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token before saving it in DB (never store raw token)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set token expiry (e.g., 15 minutes)
  const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  // Update user document
  await User.findByIdAndUpdate(userId, {
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiry: tokenExpiry,
  });

  // Return raw token (to send in URL)
  return resetToken;
};
