import { isUserLoggedIn } from './../middlewares/auth.middleware';
import { upload } from './../middlewares/multer.middleware';
import express from "express";
import { 
    authorizeNewDevice, 
    checkUsernameAvailability, 
    deactivateAccount, 
    deleteAccountPermanently, 
    deleteUser, 
    disableTwoFactorAuth, 
    enableTwoFactorAuth,  
    generateAPIKey, 
    generateBackupCodes, 
    getAccountSecuritySettings, 
    getActiveSessions, 
    getAuthorizedDevices, 
    linkSocialAccount, 
    listAPIKeys, 
    loginUser, 
    loginWithBiometricOrPasskey, 
    loginWithEmailAndPassword, 
    loginWithPhoneAndOTP, 
    loginWithSocialProvider, 
    logoutUser, 
    reactivateAccount, 
    recordUserConsent, 
    refreshAccessToken, 
    registerUser, 
    requestBiometricLoginSetup, 
    resendEmailOTP, 
    resetPassword, 
    revokeAPIKey, 
    revokeDeviceAccess, 
    sendConsentUpdateNotification, 
    sendPasswordResetEmail, 
    sendPhonePasswordResetOTP, 
    terminateAllSessions, 
    terminateSession, 
    unlinkSocialAccount, 
    updateAccountSecuritySettings, 
    updatePassword, 
    verifyCurrentPassword, 
    verifyEmailOTP, 
    verifyIdentityDocument, 
    verifyPasswordResetToken, 
    verifyPhonePasswordResetOTP,  
    verifyTwoFactorAuthCode, 
    isAuthorised,
} from "../controllers/auth.controller";
import { loginLimiter,registerLimiter } from '../middlewares/rateLimiter.middleware';


const router = express.Router();
const verifyToken = ()=>{

}
const isAdmin = ()=>{

}

router.route("/register").post(upload.none(), registerLimiter, registerUser);
router.route("/login").post(upload.none(), loginLimiter,  loginUser);
router.route("/logout").post(upload.none(), isUserLoggedIn, logoutUser);
router.route("/is-authenticated").post(isUserLoggedIn, isAuthorised);

router.route("/update-password/:userId").patch(upload.none(), isUserLoggedIn,  updatePassword);
router.route("/send-reset-password-token").post(upload.none(), sendPasswordResetEmail); //send reset password token
router.route("/verify-reset-password-token/:userId/:token").post(verifyPasswordResetToken);
router.route("/reset-password/:token").patch(upload.none(), resetPassword);
router.route("/delete-user").delete(isUserLoggedIn, deleteUser);

// Registration
router.post("/register", registerUser);
router.post("/verify-email-otp", verifyEmailOTP);
router.post("/resend-email-otp", resendEmailOTP);
router.post("/check-username", checkUsernameAvailability);

// Login
router.post("/login", loginWithEmailAndPassword);
router.post("/login-otp", loginWithPhoneAndOTP);
router.post("/login-social", loginWithSocialProvider);
router.post("/login-biometric", loginWithBiometricOrPasskey);

// Session management
router.post("/refresh-token", refreshAccessToken);
// router.post("/logout", verifyToken, logoutUser);
router.get("/sessions", verifyToken, getActiveSessions);
router.delete("/sessions/:id", verifyToken, terminateSession);
router.delete("/sessions", verifyToken, terminateAllSessions);

// Password & Recovery
router.post("/forgot-password-email", sendPasswordResetEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password-phone", sendPhonePasswordResetOTP);
router.post("/verify-password-otp", verifyPhonePasswordResetOTP);

// Two-Factor Auth
router.post("/enable-2fa", verifyToken, enableTwoFactorAuth);
router.post("/disable-2fa", verifyToken, disableTwoFactorAuth);
router.post("/verify-2fa", verifyTwoFactorAuthCode);
router.get("/backup-codes", verifyToken, generateBackupCodes);

// Device Management
router.post("/authorize-device", authorizeNewDevice);
router.get("/devices", verifyToken, getAuthorizedDevices);
router.delete("/devices/:id", verifyToken, revokeDeviceAccess);

// API Key Management
router.post("/api-keys", verifyToken, generateAPIKey);
router.get("/api-keys", verifyToken, listAPIKeys);
router.delete("/api-keys/:id", verifyToken, revokeAPIKey);

// Account Settings & Security
router.put("/password", verifyToken, updatePassword);
router.post("/verify-password", verifyToken, verifyCurrentPassword);
router.get("/security-settings", verifyToken, getAccountSecuritySettings);
router.put("/security-settings", verifyToken, updateAccountSecuritySettings);

// Account Deactivation & Deletion
router.post("/deactivate-account", verifyToken, deactivateAccount);
router.post("/reactivate-account", verifyToken, reactivateAccount);
router.delete("/delete-account", verifyToken, deleteAccountPermanently);

// Consent and Policies
router.post("/consent-notification", isAdmin, sendConsentUpdateNotification);
router.post("/consent-record", verifyToken, recordUserConsent);

// Identity & Social Linkage
router.post("/link-social", verifyToken, linkSocialAccount);
router.post("/unlink-social", verifyToken, unlinkSocialAccount);
router.post("/verify-id-doc", verifyToken, verifyIdentityDocument);
router.post("/setup-biometric", verifyToken, requestBiometricLoginSetup);


export default router