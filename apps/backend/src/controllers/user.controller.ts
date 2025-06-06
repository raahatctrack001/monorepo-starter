import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";


// Upload Profile Picture
export const uploadProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ message: "Profile picture uploaded successfully." });
});

// Update Profile Picture
export const updateProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Profile picture updated successfully." });
});

// Remove Profile Picture
export const removeProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Profile picture removed." });
});

// Get Profile Picture
export const getProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ imageUrl: "https://cdn.socialfusion.app/path/to/profile.jpg" });
});

// Upload Cover Photo
export const uploadCoverPhoto = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ message: "Cover photo uploaded successfully." });
});

// Update Cover Photo
export const updateCoverPhoto = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Cover photo updated successfully." });
});

// Remove Cover Photo
export const removeCoverPhoto = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Cover photo removed." });
});

// Get Cover Photo
export const getCoverPhoto = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ imageUrl: "https://cdn.socialfusion.app/path/to/cover.jpg" });
});

// Update User Profile Info
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Profile updated successfully." });
});

// Get User Profile Info
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ user: { fullName: "Demo User", username: "demo_user" } });
});

// Check Username Availability
export const checkUsernameAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const isAvailable = username !== "taken_name"; // Example logic
  res.status(200).json({ available: isAvailable });
});

// Followers Count
export const getFollowersCount = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ followersCount: 210 });
});

// Following Count
export const getFollowingCount = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ followingsCount: 120 });
});

// Followers List
export const getFollowersList = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ followers: ["user1", "user2"] });
});

// Following List
export const getFollowingList = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ followings: ["user3", "user4"] });
});

// Update User Status
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  res.status(200).json({ message: `User status updated to ${status}.` });
});

// Get User Status
export const getUserStatus = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ status: "online" });
});

// Update Privacy Settings
export const updatePrivacySettings = asyncHandler(async (req: Request, res: Response) => {
  const { privacySettings } = req.body;
  res.status(200).json({ message: `Privacy settings updated to ${privacySettings}.` });
});

// Get Privacy Settings
export const getPrivacySettings = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ privacySettings: "public" });
});

// Request Verification Badge
export const requestVerificationBadge = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ message: "Verification badge requested." });
});

// Approve Verification Badge
export const approveVerificationBadge = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Verification badge approved." });
});

// Revoke Verification Badge
export const revokeVerificationBadge = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Verification badge revoked." });
});

// Get Verification Status
export const getVerificationStatus = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ verificationStatus: "verified" });
});

// Update User Bio
export const updateUserBio = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Bio updated." });
});

// Update User Links
export const updateUserLinks = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Links updated." });
});

// Add Story Highlight
export const addStoryHighlight = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ message: "Story highlight added." });
});

// Remove Story Highlight
export const removeStoryHighlight = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "Story highlight removed." });
});

// Get Story Highlights
export const getStoryHighlights = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ highlights: ["highlight1", "highlight2"] });
});
