import express from "express";
import * as messageController from "../../controllers/communication/message.controllers";
import { isUserLoggedIn } from "../../middlewares/auth.middleware";

const protect = ()=>{}

const router = express.Router();

// 1️⃣ Create Message, Get Messages by Conversation
router
  .route("/create-message/:conversationId/:creatorId")
  .post(isUserLoggedIn, messageController.createMessage);

router
  .route("/conversation/:conversationId")
  .get(protect, messageController.getMessagesByConversation);

// 2️⃣ Single Message by ID — Get, Edit, Delete
router
  .route("/:id")
  .get(protect, messageController.getMessageById)
  .patch(protect, messageController.editMessage)
  .delete(protect, messageController.deleteMessage);

// 3️⃣ Pin/Unpin Message
router
  .route("/:id/pin")
  .post(protect, messageController.pinMessage);

router
  .route("/:id/unpin")
  .post(protect, messageController.unpinMessage);

// 4️⃣ Reactions
router
  .route("/:id/react")
  .post(protect, messageController.reactToMessage);

router
  .route("/:id/remove-reaction")
  .post(protect, messageController.removeReaction);

// 5️⃣ Delivery / Seen Status
router
  .route("/:id/delivered")
  .post(protect, messageController.markMessageAsDelivered)
  .get(protect, messageController.getDeliveredStatus);

router
  .route("/:id/seen")
  .post(protect, messageController.markMessageAsSeen)
  .get(protect, messageController.getSeenStatus);

// 6️⃣ Forward Message
router
  .route("/:id/forward")
  .post(protect, messageController.forwardMessage);

// 7️⃣ Reply to Message
router
  .route("/:id/reply")
  .post(protect, messageController.replyToMessage);

// 8️⃣ Schedule Message
router
  .route("/:id/schedule")
  .post(protect, messageController.scheduleMessage)
  .delete(protect, messageController.cancelScheduledMessage);

router
  .route("/scheduled/:conversationId")
  .get(protect, messageController.getScheduledMessages);

// 9️⃣ Delete for User / Everyone
router
  .route("/:id/delete-for-user/:userId")
  .post(protect, messageController.deleteMessageForUser);

router
  .route("/:id/delete-for-everyone")
  .post(protect, messageController.deleteMessageForEveryone);

// 🔟 Attachments
router
  .route("/:id/attachment")
  .post(protect, messageController.addMessageAttachment);

router
  .route("/:id/attachments")
  .get(protect, messageController.getMessageAttachments);

// 1️⃣1️⃣ Set Priority Level
router
  .route("/:id/priority")
  .post(protect, messageController.setPriorityLevel);

// 1️⃣2️⃣ System Event Messages
router
  .route("/system-event")
  .post(protect, messageController.addSystemEventMessage);

router
  .route("/system-events/:conversationId")
  .get(protect, messageController.getSystemEventMessages);

// 1️⃣3️⃣ Get Conversation Messages with Filters
router
  .route("/conversation/:conversationId/filtered")
  .get(protect, messageController.getConversationMessagesWithFilters);

export default router;
