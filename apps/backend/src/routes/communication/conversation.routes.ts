import express from "express";
import { 
  addParticipant,
  archiveConversation,
  blockUserInConversation,
  createConversation, 
  deleteConversation, 
  getActivityLogs, 
  getAllConversations, 
  getConversationById,
  getUnreadCount,
  incrementAttachmentsCount,
  incrementMessagesCount,
  markConversationAsRead,
  muteConversation,
  pinMessage,
  removeParticipant,
  reportConversation,
  scheduleMessageInConversation,
  setCustomNickname,
  setCustomTheme,
  setGroupInfo,
  unarchiveConversation,
  unblockUserInConversation,
  updateConversation,
  updateCustomOrder,
  updateLastMessage,
  updateTypingStatus
} from "../../controllers/communication/conversation.controllers";
import { isUserLoggedIn } from "../../middlewares/auth.middleware";
const protect = ()=>{}


const router = express.Router();

// Routes using .route() chain syntax

// 1️⃣ Conversations collection routes
router.route("/create-conversation/:creatorId").post(isUserLoggedIn, createConversation);
router.route("/get-all-conversation/:userId").get(getAllConversations);

// 2️⃣ Single conversation by ID
router
  .route("/:id")
  .get(protect, getConversationById)
  .patch(protect, updateConversation)
  .delete(protect, deleteConversation);

// 3️⃣ Participants management
router
  .route("/:id/participants")
  .post(protect, addParticipant);

router
  .route("/:id/participants/:userId")
  .delete(protect, removeParticipant);

// 4️⃣ Group info update
router
  .route("/:id/group-info")
  .patch(protect, setGroupInfo);

// 5️⃣ Last message update
router
  .route("/:id/last-message")
  .patch(protect, updateLastMessage);

// 6️⃣ Pin message
router
  .route("/:id/pin-message")
  .post(protect, pinMessage);

// 7️⃣ Mute conversation
router
  .route("/:id/mute")
  .post(protect, muteConversation);

// 8️⃣ Archive / Unarchive conversation
router
  .route("/:id/archive")
  .post(protect, archiveConversation);

router
  .route("/:id/unarchive")
  .post(protect, unarchiveConversation);

// 9️⃣ Custom theme
router
  .route("/:id/custom-theme")
  .post(protect, setCustomTheme);

// 🔟 Custom nickname
router
  .route("/:id/custom-nickname")
  .post(protect, setCustomNickname);

// 1️⃣1️⃣ Block / Unblock user in conversation
router
  .route("/:id/block/:userId")
  .post(protect, blockUserInConversation);

router
  .route("/:id/unblock/:userId")
  .post(protect, unblockUserInConversation);

// 1️⃣2️⃣ Report conversation
router
  .route("/:id/report")
  .post(protect, reportConversation);

// 1️⃣3️⃣ Typing status
router
  .route("/:id/typing-status")
  .post(protect, updateTypingStatus);

// 1️⃣4️⃣ Unread message count
router
  .route("/:id/unread-count")
  .get(protect, getUnreadCount);

// 1️⃣5️⃣ Mark as read
router
  .route("/:id/mark-as-read")
  .post(protect, markConversationAsRead);

// 1️⃣6️⃣ Schedule message
router
  .route("/:id/schedule-message")
  .post(protect, scheduleMessageInConversation);

// 1️⃣7️⃣ Activity logs
router
  .route("/:id/activity-logs")
  .get(protect, getActivityLogs);

// 1️⃣8️⃣ Increment message count
router
  .route("/:id/increment-messages-count")
  .post(protect, incrementMessagesCount);

// 1️⃣9️⃣ Increment attachment count
router
  .route("/:id/increment-attachments-count")
  .post(protect, incrementAttachmentsCount);

// 2️⃣0️⃣ Update custom order
router
  .route("/:id/custom-order")
  .post(protect, updateCustomOrder);

export default router;
