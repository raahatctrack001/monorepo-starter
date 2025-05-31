import crypto, { createHash } from 'crypto';

export const generateNumericOTP = (length = 6) => {
  const otp = crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
  return otp;
};

export const generateAlphanumericOTP = (length = 6) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

export const hashOTP = (otp: string) => {
  return createHash('sha256').update(otp).digest('hex');
};

