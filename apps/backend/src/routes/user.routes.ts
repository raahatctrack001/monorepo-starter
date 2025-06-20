import express from 'express';
import {
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
  getStoryHighlights,
  getAllUserProfile,
  searchUsers,
  uploadPicture
} from '../controllers/user.controller';
import { isUserLoggedIn } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';

const isAuthenticated = ()=>{

}
const isAdmin = ()=>{
    
}

const router = express.Router();

/* Profile Picture */
router.route(
  '/profile-picture').post(
  isUserLoggedIn,
  upload.array("pictures"),
  uploadPicture
);
router.post('/upload-picture', isUserLoggedIn, uploadPicture);
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
router.get('/profile/:userId', isUserLoggedIn, getUserProfile);
router.get('/profiles/:userId', isUserLoggedIn, getAllUserProfile);
router.get('/check-username/:username', checkUsernameAvailability);
router.get('/search-user', isUserLoggedIn, searchUsers)
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
