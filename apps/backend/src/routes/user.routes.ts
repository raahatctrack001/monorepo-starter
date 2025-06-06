import express from 'express';
import {
  uploadProfilePicture,
  updateProfilePicture,
  removeProfilePicture,
  getProfilePicture,
  uploadCoverPhoto,
  updateCoverPhoto,
  removeCoverPhoto,
  getCoverPhoto,
  updateUserProfile,
  getUserProfile,
  checkUsernameAvailability,
  getFollowersCount,
  getFollowingCount,
  getFollowersList,
  getFollowingList,
  updateUserStatus,
  getUserStatus,
  updatePrivacySettings,
  getPrivacySettings,
  requestVerificationBadge,
  approveVerificationBadge,
  revokeVerificationBadge,
  getVerificationStatus,
  updateUserBio,
  updateUserLinks,
  addStoryHighlight,
  removeStoryHighlight,
  getStoryHighlights
} from '../controllers/user.controller';

const isAuthenticated = ()=>{

}
const isAdmin = ()=>{
    
}

const router = express.Router();

/* Profile Picture */
router.post('/profile-picture', isAuthenticated, uploadProfilePicture);
router.put('/profile-picture', isAuthenticated, updateProfilePicture);
router.delete('/profile-picture', isAuthenticated, removeProfilePicture);
router.get('/:userId/profile-picture', getProfilePicture);

/* Cover Photo */
router.post('/cover-photo', isAuthenticated, uploadCoverPhoto);
router.put('/cover-photo', isAuthenticated, updateCoverPhoto);
router.delete('/cover-photo', isAuthenticated, removeCoverPhoto);
router.get('/:userId/cover-photo', getCoverPhoto);

/* Profile Information */
router.put('/profile', isAuthenticated, updateUserProfile);
router.get('/:userId/profile', getUserProfile);
router.get('/check-username/:username', checkUsernameAvailability);

/* Followers / Following */
router.get('/:userId/followers/count', getFollowersCount);
router.get('/:userId/followings/count', getFollowingCount);
router.get('/:userId/followers', getFollowersList);
router.get('/:userId/followings', getFollowingList);

/* User Status (Online/Busy/Away) */
router.put('/status', isAuthenticated, updateUserStatus);
router.get('/:userId/status', getUserStatus);

/* Privacy Settings */
router.put('/privacy-settings', isAuthenticated, updatePrivacySettings);
router.get('/:userId/privacy-settings', getPrivacySettings);

/* Verification Badge */
router.post('/verification/request', isAuthenticated, requestVerificationBadge);
router.put('/:userId/verification/approve', isAuthenticated, isAdmin, approveVerificationBadge);
router.put('/:userId/verification/revoke', isAuthenticated, isAdmin, revokeVerificationBadge);
router.get('/:userId/verification-status', getVerificationStatus);

/* Dynamic Profile Updates */
router.put('/bio', isAuthenticated, updateUserBio);
router.put('/links', isAuthenticated, updateUserLinks);

/* Story Highlights */
router.post('/story-highlights', isAuthenticated, addStoryHighlight);
router.delete('/story-highlights/:highlightId', isAuthenticated, removeStoryHighlight);
router.get('/:userId/story-highlights', getStoryHighlights);

export default router;
