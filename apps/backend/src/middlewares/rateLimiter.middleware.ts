import rateLimit from 'express-rate-limit';

// Login limiter
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 50, // 5 requests per window
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Register limiter
export const registerLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 3, // 3 requests per window
  message: 'Too many registrations from this IP. Please try again later.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// OTP request limiter
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 3, // 3 requests per window
  message: 'Too many OTP requests. Please wait before requesting again.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Verify OTP request limiter
export const veirfyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 3, // 3 requests per window
  message: 'Too many verification requests. Please wait before requesting again.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
