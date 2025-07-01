import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import ApiError, { apiErrorFunction } from "../../utils/apiError";
import crypto, { generateKeyPairSync } from 'crypto'
import { Conversation, IConversation, Message, User } from "@repo/database";
import ApiResponse from "../../utils/apiResponse";
import mongoose from "mongoose";

async function generatePublicKey() {
  const { publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return publicKey;
}

async function migrateUsers() {
  const usersWithoutKey = await User.find({ publicKey: { $exists: false } });
 
  for (const user of usersWithoutKey) {
    const publicKey = await generatePublicKey();
    user.publicKey = publicKey;
    await user.save();
    console.log(`✔️ Updated user: ${user.username}`);
  }

  console.log(`✅ Migration complete. ${usersWithoutKey.length} users updated.`);
}

// 1️⃣ Create a new conversation
export const createConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  /***To Do's
   * 1. extract senderId from params
   * 2. validate and see if sender is loggedIn and authorized to create conversatoin
   * 3. extract participants from body
   * 4. if participants.length > 1 => its group
   * 5. check if conversation with this signature alreay present? if conversationType: secret then create new else return old
   * 7. extract {groupName}
  *  8. mendatory details:
        * createdBy 
        * participants, 
        * groupName; if group 
        * conversationType, 
        * messageCount, 
        * attachmentCount, 
        * allowedMessageTypes, 
        * isEncrypted, e
        * ncryptionKey 
   */
  try {
    const { creatorId } = req.params;
    if (req.user?._id !== creatorId || !creatorId) {
      throw new ApiError(401, "Unauthorized Attempt!");
    }

    const { participants } = req.body;

    if (!participants?.length) {
      throw new ApiError(404, "Please select at least 1 user to create a conversation.");
    }

    const isGroup = participants.length > 1;

    let { conversationName } = req.body;

    const partner = !isGroup ? await User.findById(participants[0]) : null;
    if (!isGroup) {
      conversationName = partner?.fullName || "social-user";
    }

    participants.push(creatorId);

    const invalidIds = participants.filter(
      (participantId: string) => !mongoose.Types.ObjectId.isValid(participantId)
    );

    if (invalidIds.length > 0) {
      throw new ApiError(403, `Invalid participant IDs: ${invalidIds.join(', ')}`);
    }

    //custom nickname
    // Check for existing conversation
    if (!isGroup) {
      const existingConversation = await Conversation.findOne({
        isGroup: false,
        conversationType: "personal",
        participants: { $all: [creatorId, participants[0]], $size: 2 }
      }).populate("participants");

      if (existingConversation) {
        return res.status(200).json(new ApiResponse(200, "Conversation already exists", existingConversation));
      }

      
        
    } else {
      const existingConversation = await Conversation.findOne({
        isGroup: true,
        conversationName,
        createdBy: creatorId
      }).populate("participants");

      if (existingConversation) {
        return res.status(200).json(new ApiResponse(200, "Group with this name already exists", existingConversation));
      }
    }

    const customNickname = {
      [creatorId]: isGroup ? conversationName: partner?.fullName || "social-user",
      [participants[0]]: isGroup ? conversationName: req.user?.fullName || "social-user"
    };

    const conversation: IConversation = await Conversation.create({
      createdBy: creatorId,
      conversationName,
      participants,
      isGroup,
      conversationType: isGroup ? "group" : "personal",
      messagesCount: 0,
      attachmentsCount: 0,
      customNickname,
      // lastMessage:`${req.user?.fullName} ${isGroup ? "Added you to this group ": "Initiated the conversation with you"}`,
      conversationImage: isGroup
        ? process.env.FALLBACK_GROUP_IMAGE_URL || "/fallback-cover.jpg"
        : partner?.avatar?.at(-1) || process.env.FALLBACK_IMAGE_URL || "/fallback-cover.jpg"
    });

    if (!conversation) {
      throw new ApiError(404, "Failed to initiate conversation");
    }

    const lastMessage = await Message.create({
      conversationId: conversation?._id,
      senderId: creatorId,
      receiversId: conversation.participants,
      messageType: "text",
      textContent: `${req.user?.fullName} initiated the conversation!`,
    })

    if(!lastMessage){
      throw new ApiError(400, "Failed to create last message");
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(conversation?._id, {
      $set: {
        lastMessage,
        // lastMessageAt: new Date.now(),
      }
    }, {new: true})

    if(!updatedConversation){
      throw new ApiError(500, "Failed to updated conversation with last message")
    }

    return res.status(201).json(new ApiResponse(201, "Conversation Initiated!", updatedConversation));
  } catch (error) {
    next(error);
  }
});


// 2️⃣ Get all conversations for a user
export const getAllConversations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid userId")
    }

    if(req.user?._id !== userId){
      throw new ApiError(401, "Unauthorized Attempt!")
    }

    const conversations =  await Conversation.find({
      $or: [
        { creatorId: userId },
        { participants: userId },
      ],
    })
    .populate("lastMessage")
    .sort({updatedAt: -1});

    // console.log(conversations)
    if(conversations?.length === 0){
      throw new ApiError(404, "No conversation found! please initiate conversation.")
    }

    res.status(200).json(new ApiResponse(200, "fetched all converations", {conversations, length: conversations.length}));
  } catch (error) {
    next(error);
  }
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

export const deleteAllConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const deletedConversations = await Conversation.deleteMany({});
  
  res.status(200).json(new ApiResponse(200, `Deleted conversations`, deletedConversations));
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
