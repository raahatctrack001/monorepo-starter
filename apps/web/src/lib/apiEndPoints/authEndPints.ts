const authConstant = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth`;
const withPrefix = (path: string) => `${authConstant}${path}`;

export const authApi = {
  // Registration
  registerUser: () => withPrefix('/register'),
  verifyEmailOTP: () => withPrefix('/verify-email-otp'),
  resendEmailOTP: () => withPrefix('/resend-email-otp'),
  checkUsernameAvailability: () => withPrefix('/check-username'),
  isUserAuthenticated: () => withPrefix('/is-authenticated'),

  // Login
  loginUser: () => withPrefix('/login'),
  loginWithOTP: () => withPrefix('/login-otp'),
  loginWithSocial: () => withPrefix('/login-social'),
  loginWithBiometric: () => withPrefix('/login-biometric'),
  
  // Logout & Sessions
  logoutUser: () => withPrefix('/logout'),
  refreshToken: () => withPrefix('/refresh-token'),
  getActiveSessions: () => withPrefix('/sessions'),
  terminateSession: (sessionId: string) => withPrefix(`/sessions/${sessionId}`),
  terminateAllSessions: () => withPrefix('/sessions'),

  // Password & Recovery
  forgotPasswordEmail: () => withPrefix('/forgot-password-email'),
  forgotPasswordPhone: () => withPrefix('/forgot-password-phone'),
  resetPassword: () => withPrefix('/reset-password'),
  verifyPasswordOtp: () => withPrefix('/verify-password-otp'),
  sendResetPasswordToken: () => withPrefix('/send-reset-password-token'),
  verifyResetPasswordToken: (userId: string, token: string) => withPrefix(`/verify-reset-password-token/${userId}/${token}`),
  resetPasswordWithToken: (token: string) => withPrefix(`/reset-password/${token}`),
  updatePassword: () => withPrefix('/password'),
  verifyCurrentPassword: () => withPrefix('/verify-password'),

  // Two-Factor Auth
  enable2FA: () => withPrefix('/enable-2fa'),
  disable2FA: () => withPrefix('/disable-2fa'),
  verify2FACode: () => withPrefix('/verify-2fa'),
  generateBackupCodes: () => withPrefix('/backup-codes'),

  // Device Management
  authorizeNewDevice: () => withPrefix('/authorize-device'),
  getAuthorizedDevices: () => withPrefix('/devices'),
  revokeDeviceAccess: (deviceId: string) => withPrefix(`/devices/${deviceId}`),

  // API Key Management
  generateAPIKey: () => withPrefix('/api-keys'),
  listAPIKeys: () => withPrefix('/api-keys'),
  revokeAPIKey: (apiKeyId: string) => withPrefix(`/api-keys/${apiKeyId}`),

  // Account Settings & Security
  getAccountSecuritySettings: () => withPrefix('/security-settings'),
  updateAccountSecuritySettings: () => withPrefix('/security-settings'),

  // Account Deactivation & Deletion
  deactivateAccount: () => withPrefix('/deactivate-account'),
  reactivateAccount: () => withPrefix('/reactivate-account'),
  deleteAccountPermanently: () => withPrefix('/delete-account'),
  deleteUser: () => withPrefix('/delete-user'),

  // Consent and Policy
  sendConsentUpdateNotification: () => withPrefix('/consent-notification'),
  recordUserConsent: () => withPrefix('/consent-record'),

  // Identity & Social Linkage
  linkSocialAccount: () => withPrefix('/link-social'),
  unlinkSocialAccount: () => withPrefix('/unlink-social'),
  verifyIdentityDocument: () => withPrefix('/verify-id-doc'),
  requestBiometricLoginSetup: () => withPrefix('/setup-biometric'),
};
