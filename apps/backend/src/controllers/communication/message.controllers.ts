import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import ApiError from "../../utils/apiError";
import { Conversation } from "@repo/database";
import ApiResponse from "../../utils/apiResponse";



// 1️⃣ Create Message
export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId, creatorId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(creatorId) || !mongoose.Types.ObjectId.isValid(conversationId)){
    throw new ApiError(403, "ConversationId or CreatorId is not a valid id");
  }

  if(req.user?._id !== creatorId){
    throw new ApiError(403, "Unauthorized attempt!, You can login then initiate conversation.")
  }

  const conversation = await Conversation.findById(conversationId);
  console.log(conversation);
  if(!conversation){
    throw new ApiError(404, "Conversation with this user doen't exist, please initiate one and try again!")
  }

  //mendatory details
  /***
   * conversationId
   * senderId
   * receivers: //extract from conversation
   * groupId: //if isGroup == true
   * messageType: //string, poll, media, location, contact, call logs, events
   * ********* one message at a time and message is atomic i.e. only one attachment be it image or video if 
   * ********* multiple attachments are there then break them into single multiple messsages *******
   */

  res.status(200).json(new ApiResponse(200, "Conversation fetched", conversation));
});

// 2️⃣ Get Message by ID
export const getMessageById = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get message by ID" });
});

// 3️⃣ Get Messages by Conversation
export const getMessagesByConversation = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get messages by conversation" });
});

// 4️⃣ Delete Message
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Delete message" });
});

// 5️⃣ Edit Message
export const editMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Edit message" });
});

// 6️⃣ Pin Message
export const pinMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Pin message" });
});

// 7️⃣ Unpin Message
export const unpinMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Unpin message" });
});

// 8️⃣ React to Message
export const reactToMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "React to message" });
});

// 9️⃣ Remove Reaction
export const removeReaction = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Remove reaction" });
});

// 🔟 Mark as Delivered
export const markMessageAsDelivered = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Mark message as delivered" });
});

// 1️⃣1️⃣ Mark as Seen
export const markMessageAsSeen = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Mark message as seen" });
});

// 1️⃣2️⃣ Get Delivered Status
export const getDeliveredStatus = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get delivered status" });
});

// 1️⃣3️⃣ Get Seen Status
export const getSeenStatus = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get seen status" });
});

// 1️⃣4️⃣ Forward Message
export const forwardMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Forward message" });
});

// 1️⃣5️⃣ Reply to Message
export const replyToMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Reply to message" });
});

// 1️⃣6️⃣ Schedule Message
export const scheduleMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Schedule message" });
});

// 1️⃣7️⃣ Get Scheduled Messages
export const getScheduledMessages = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get scheduled messages" });
});

// 1️⃣8️⃣ Cancel Scheduled Message
export const cancelScheduledMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Cancel scheduled message" });
});

// 1️⃣9️⃣ Delete Message for User
export const deleteMessageForUser = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Delete message for user" });
});

// 2️⃣0️⃣ Delete Message for Everyone
export const deleteMessageForEveryone = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Delete message for everyone" });
});

// 2️⃣1️⃣ Add Attachment
export const addMessageAttachment = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Add message attachment" });
});

// 2️⃣2️⃣ Get Attachments
export const getMessageAttachments = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get message attachments" });
});

// 2️⃣3️⃣ Set Priority Level
export const setPriorityLevel = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Set priority level" });
});

// 2️⃣4️⃣ Add System Event Message
export const addSystemEventMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Add system event message" });
});

// 2️⃣5️⃣ Get System Event Messages
export const getSystemEventMessages = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get system event messages" });
});

// 2️⃣6️⃣ Get Conversation Messages with Filters
export const getConversationMessagesWithFilters = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get conversation messages with filters" });
});
