import express from "express";
import * as groupController from "../../controllers/communication/group.controllers";

const protect = ()=>{}

const router = express.Router();

// Group CRUD
router.route("/").post(protect, groupController.createGroup).get(protect, groupController.getAllGroups);
router.route("/:id").get(protect, groupController.getGroupById).patch(protect, groupController.updateGroup).delete(protect, groupController.deleteGroup);

// Member Management
router.route("/:id/add-member").post(protect, groupController.addGroupMember);
router.route("/:id/remove-member").post(protect, groupController.removeGroupMember);

// Admin / Moderator Management
router.route("/:id/add-admin").post(protect, groupController.addGroupAdmin); //upload a poll for selecting if no one is admin
router.route("/:id/remove-admin").post(protect, groupController.removeGroupAdmin);
router.route("/:id/add-moderator").post(protect, groupController.addModerator);
router.route("/:id/remove-moderator").post(protect, groupController.removeModerator);

// Privacy, Media, Notifications, Mentions
router.route("/:id/set-privacy").post(protect, groupController.setGroupPrivacy);
router.route("/:id/upload-logo").post(protect, groupController.uploadGroupLogo);
router.route("/:id/upload-cover").post(protect, groupController.uploadGroupCover);
router.route("/:id/update-notifications").post(protect, groupController.updateNotificationSettings);
router.route("/:id/update-mentions").post(protect, groupController.updateMentionSettings);

// Members, Admins, Moderators
router.route("/:id/members").get(protect, groupController.getGroupMembers);
router.route("/:id/admins").get(protect, groupController.getGroupAdmins);
router.route("/:id/moderators").get(protect, groupController.getGroupModerators);

// Invites / Requests
router.route("/:id/invites").get(protect, groupController.getPendingInvites);
router.route("/:id/invite").post(protect, groupController.sendGroupInvite);
router.route("/:id/cancel-invite").post(protect, groupController.cancelGroupInvite);
router.route("/:id/approve-request").post(protect, groupController.approveJoinRequest);
router.route("/:id/reject-request").post(protect, groupController.rejectJoinRequest);

// Posts, Polls
router.route("/:id/posts").get(protect, groupController.getGroupPosts);
router.route("/:id/polls").get(protect, groupController.getGroupPolls);

// Reports / Archive / Logs
router.route("/:id/report").post(protect, groupController.reportGroup);
router.route("/reported").get(protect, groupController.getReportedGroups);
router.route("/:id/archive").post(protect, groupController.archiveGroup);
router.route("/:id/unarchive").post(protect, groupController.unarchiveGroup);
router.route("/archived").get(protect, groupController.getArchivedGroups);
router.route("/:id/activity-logs").get(protect, groupController.getGroupActivityLogs);

// Posts management
router.route("/:id/pin-post").post(protect, groupController.pinPostInGroup);
router.route("/:id/unpin-post").post(protect, groupController.unpinPostInGroup);

// Achievements
router.route("/:id/add-achievement").post(protect, groupController.addAchievement);
router.route("/:id/remove-achievement").post(protect, groupController.removeAchievement);

// Scheduled posts
router.route("/:id/schedule-post").post(protect, groupController.schedulePost);
router.route("/:id/cancel-scheduled-post").post(protect, groupController.cancelScheduledPost);
router.route("/:id/scheduled-posts").get(protect, groupController.getScheduledPosts);

export default router;
