// createConversation
// getAllConversations (for a user)
// getConversationById
// updateConversation
// deleteConversation
// addParticipant
// removeParticipant
// setGroupInfo (name, description, image, etc.)
// updateLastMessage
// pinMessage
// muteConversation
// // archiveConversation
// unarchiveConversation
// setCustomTheme
// setCustomNickname
// blockUserInConversation
// unblockUserInConversation
// reportConversation
// updateTypingStatus
// getUnreadCount
// markConversationAsRead
// scheduleMessageInConversation
// getActivityLogs
// incrementMessagesCount
// incrementAttachmentsCount
// updateCustomOrder

import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

// 1️⃣ Create a new conversation
export const createConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({ message: "Conversation created successfully" });
});

// 2️⃣ Get all conversations for a user
export const getAllConversations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Fetched all conversations for user" });
});

// 3️⃣ Get a single conversation by ID
export const getConversationById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: `Fetched conversation ${req.params.id}` });
});

// 4️⃣ Update conversation
export const updateConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: `Updated conversation ${req.params.id}` });
});

// 5️⃣ Delete conversation
export const deleteConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: `Deleted conversation ${req.params.id}` });
});

// 6️⃣ Add participant to conversation
export const addParticipant = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Participant added" });
});

// 7️⃣ Remove participant from conversation
export const removeParticipant = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Participant removed" });
});

// 8️⃣ Set group info
export const setGroupInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Group info updated" });
});

// 9️⃣ Update last message of conversation
export const updateLastMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Last message updated" });
});

// 🔟 Pin message in conversation
export const pinMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Message pinned" });
});

// 1️⃣1️⃣ Mute conversation
export const muteConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Conversation muted" });
});

// 1️⃣2️⃣ Archive conversation
export const archiveConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Conversation archived" });
});

// 1️⃣3️⃣ Unarchive conversation
export const unarchiveConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Conversation unarchived" });
});

// 1️⃣4️⃣ Set custom theme for conversation
export const setCustomTheme = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Custom theme set" });
});

// 1️⃣5️⃣ Set custom nickname
export const setCustomNickname = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Custom nickname set" });
});

// 1️⃣6️⃣ Block user in conversation
export const blockUserInConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "User blocked in conversation" });
});

// 1️⃣7️⃣ Unblock user in conversation
export const unblockUserInConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "User unblocked in conversation" });
});

// 1️⃣8️⃣ Report conversation
export const reportConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Conversation reported" });
});

// 1️⃣9️⃣ Update typing status
export const updateTypingStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Typing status updated" });
});

// 2️⃣0️⃣ Get unread message count for conversation
export const getUnreadCount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Unread count fetched" });
});

// 2️⃣1️⃣ Mark conversation as read
export const markConversationAsRead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Conversation marked as read" });
});

// 2️⃣2️⃣ Schedule message in conversation
export const scheduleMessageInConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Message scheduled" });
});

// 2️⃣3️⃣ Get activity logs of conversation
export const getActivityLogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Activity logs fetched" });
});

// 2️⃣4️⃣ Increment messages count
export const incrementMessagesCount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Messages count incremented" });
});

// 2️⃣5️⃣ Increment attachments count
export const incrementAttachmentsCount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Attachments count incremented" });
});

// 2️⃣6️⃣ Update custom order for conversations
export const updateCustomOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Custom order updated" });
});
