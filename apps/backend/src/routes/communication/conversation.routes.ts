import express from "express";
import * as conversationController from "../../controllers/communication/conversation.controllers";
const protect = ()=>{}


const router = express.Router();

// Routes using .route() chain syntax

// 1️⃣ Conversations collection routes
router
  .route("/")
  .post(protect, conversationController.createConversation)
  .get(protect, conversationController.getAllConversations);

// 2️⃣ Single conversation by ID
router
  .route("/:id")
  .get(protect, conversationController.getConversationById)
  .patch(protect, conversationController.updateConversation)
  .delete(protect, conversationController.deleteConversation);

// 3️⃣ Participants management
router
  .route("/:id/participants")
  .post(protect, conversationController.addParticipant);

router
  .route("/:id/participants/:userId")
  .delete(protect, conversationController.removeParticipant);

// 4️⃣ Group info update
router
  .route("/:id/group-info")
  .patch(protect, conversationController.setGroupInfo);

// 5️⃣ Last message update
router
  .route("/:id/last-message")
  .patch(protect, conversationController.updateLastMessage);

// 6️⃣ Pin message
router
  .route("/:id/pin-message")
  .post(protect, conversationController.pinMessage);

// 7️⃣ Mute conversation
router
  .route("/:id/mute")
  .post(protect, conversationController.muteConversation);

// 8️⃣ Archive / Unarchive conversation
router
  .route("/:id/archive")
  .post(protect, conversationController.archiveConversation);

router
  .route("/:id/unarchive")
  .post(protect, conversationController.unarchiveConversation);

// 9️⃣ Custom theme
router
  .route("/:id/custom-theme")
  .post(protect, conversationController.setCustomTheme);

// 🔟 Custom nickname
router
  .route("/:id/custom-nickname")
  .post(protect, conversationController.setCustomNickname);

// 1️⃣1️⃣ Block / Unblock user in conversation
router
  .route("/:id/block/:userId")
  .post(protect, conversationController.blockUserInConversation);

router
  .route("/:id/unblock/:userId")
  .post(protect, conversationController.unblockUserInConversation);

// 1️⃣2️⃣ Report conversation
router
  .route("/:id/report")
  .post(protect, conversationController.reportConversation);

// 1️⃣3️⃣ Typing status
router
  .route("/:id/typing-status")
  .post(protect, conversationController.updateTypingStatus);

// 1️⃣4️⃣ Unread message count
router
  .route("/:id/unread-count")
  .get(protect, conversationController.getUnreadCount);

// 1️⃣5️⃣ Mark as read
router
  .route("/:id/mark-as-read")
  .post(protect, conversationController.markConversationAsRead);

// 1️⃣6️⃣ Schedule message
router
  .route("/:id/schedule-message")
  .post(protect, conversationController.scheduleMessageInConversation);

// 1️⃣7️⃣ Activity logs
router
  .route("/:id/activity-logs")
  .get(protect, conversationController.getActivityLogs);

// 1️⃣8️⃣ Increment message count
router
  .route("/:id/increment-messages-count")
  .post(protect, conversationController.incrementMessagesCount);

// 1️⃣9️⃣ Increment attachment count
router
  .route("/:id/increment-attachments-count")
  .post(protect, conversationController.incrementAttachmentsCount);

// 2️⃣0️⃣ Update custom order
router
  .route("/:id/custom-order")
  .post(protect, conversationController.updateCustomOrder);

export default router;
