import express from "express";
import * as messageController from "../../controllers/communication/message.controllers";
import { isUserLoggedIn } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

const router = express.Router();

// 1️⃣ Create Message, Get Messages by Conversation
router
  .route("/create-message/:conversationId/:creatorId")
  .post(isUserLoggedIn, upload.any(), messageController.createMessage);

router
  .route("/conversation/:conversationId/:userId")
  .get(isUserLoggedIn, messageController.getMessagesByConversation);

// 2️⃣ Single Message by ID — Get, Edit, Delete
router
  .route("/:id")
  .get(isUserLoggedIn, messageController.getMessageById)
  .patch(isUserLoggedIn, messageController.editMessage)
  .delete(isUserLoggedIn, messageController.deleteMessage);

// 3️⃣ Pin/Unpin Message
router
  .route("/:id/pin")
  .post(isUserLoggedIn, messageController.pinMessage);

router
  .route("/:id/unpin")
  .post(isUserLoggedIn, messageController.unpinMessage);

// 4️⃣ Reactions
router
  .route("/:id/react")
  .post(isUserLoggedIn, messageController.reactToMessage);

router
  .route("/:id/remove-reaction")
  .post(isUserLoggedIn, messageController.removeReaction);

// 5️⃣ Delivery / Seen Status
router
  .route("/:id/delivered")
  .post(isUserLoggedIn, messageController.markMessageAsDelivered)
  .get(isUserLoggedIn, messageController.getDeliveredStatus);

router
  .route("/:id/seen")
  .post(isUserLoggedIn, messageController.markMessageAsSeen)
  .get(isUserLoggedIn, messageController.getSeenStatus);

// 6️⃣ Forward Message
router
  .route("/:id/forward")
  .post(isUserLoggedIn, messageController.forwardMessage);

// 7️⃣ Reply to Message
router
  .route("/:id/reply")
  .post(isUserLoggedIn, messageController.replyToMessage);

// 8️⃣ Schedule Message
router
  .route("/:id/schedule")
  .post(isUserLoggedIn, messageController.scheduleMessage)
  .delete(isUserLoggedIn, messageController.cancelScheduledMessage);

router
  .route("/scheduled/:conversationId")
  .get(isUserLoggedIn, messageController.getScheduledMessages);

// 9️⃣ Delete for User / Everyone
router
  .route("/:id/delete-for-user/:userId")
  .post(isUserLoggedIn, messageController.deleteMessageForUser);

router
  .route("/:id/delete-for-everyone")
  .post(isUserLoggedIn, messageController.deleteMessageForEveryone);

// 🔟 Attachments
router
  .route("/:id/attachment")
  .post(isUserLoggedIn, messageController.addMessageAttachment);

router
  .route("/:id/attachments")
  .get(isUserLoggedIn, messageController.getMessageAttachments);

// 1️⃣1️⃣ Set Priority Level
router
  .route("/:id/priority")
  .post(isUserLoggedIn, messageController.setPriorityLevel);

// 1️⃣2️⃣ System Event Messages
router
  .route("/system-event")
  .post(isUserLoggedIn, messageController.addSystemEventMessage);

router
  .route("/system-events/:conversationId")
  .get(isUserLoggedIn, messageController.getSystemEventMessages);

// 1️⃣3️⃣ Get Conversation Messages with Filters
router
  .route("/conversation/:conversationId/filtered")
  .get(isUserLoggedIn, messageController.getConversationMessagesWithFilters);

export default router;
