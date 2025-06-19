const userConstant = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user`;
const withPrefix = (path: string) => `${userConstant}${path}`;

export const userApi = {
  // 📸 Profile Picture
  uploadProfilePicture: () => withPrefix('/profile-picture'),
  updateProfilePicture: () => withPrefix('/profile-picture'),
  removeProfilePicture: () => withPrefix('/profile-picture'),
  getProfilePicture: (userId: string) => withPrefix(`/${userId}/profile-picture`),

  // 📸 Cover Photo
  uploadCoverPhoto: () => withPrefix('/cover-photo'),
  updateCoverPhoto: () => withPrefix('/cover-photo'),
  removeCoverPhoto: () => withPrefix('/cover-photo'),
  getCoverPhoto: (userId: string) => withPrefix(`/${userId}/cover-photo`),

  // 👤 Profile Information
  updateUserProfile: () => withPrefix('/profile'),
  getUserProfile: (userId: string) => withPrefix(`/profile/${userId}`),
  getAllUserProfile: (userId: string) => withPrefix(`/profiles/${userId}`),
  checkUsernameAvailability: (username: string) => withPrefix(`/check-username/${username}`),

  // 👥 Followers / Following
  getFollowersCount: (userId: string) => withPrefix(`/${userId}/followers/count`),
  getFollowingCount: (userId: string) => withPrefix(`/${userId}/followings/count`),
  getFollowersList: (userId: string) => withPrefix(`/${userId}/followers`),
  getFollowingList: (userId: string) => withPrefix(`/${userId}/followings`),

  // 🟢 User Status
  updateUserStatus: () => withPrefix('/status'),
  getUserStatus: (userId: string) => withPrefix(`/${userId}/status`),

  // 🔒 Privacy Settings
  updatePrivacySettings: () => withPrefix('/privacy-settings'),
  getPrivacySettings: (userId: string) => withPrefix(`/${userId}/privacy-settings`),

  // ✔️ Verification Badge
  requestVerificationBadge: () => withPrefix('/verification/request'),
  approveVerificationBadge: (userId: string) => withPrefix(`/${userId}/verification/approve`),
  revokeVerificationBadge: (userId: string) => withPrefix(`/${userId}/verification/revoke`),
  getVerificationStatus: (userId: string) => withPrefix(`/${userId}/verification-status`),

  // ✏️ Dynamic Profile Updates
  updateUserBio: () => withPrefix('/bio'),
  updateUserLinks: () => withPrefix('/links'),

  // ⭐ Story Highlights
  addStoryHighlight: () => withPrefix('/story-highlights'),
  removeStoryHighlight: (highlightId: string) => withPrefix(`/story-highlights/${highlightId}`),
  getStoryHighlights: (userId: string) => withPrefix(`/${userId}/story-highlights`),
};
