import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import ApiError from "../../utils/apiError";
import { Conversation, IConversation, IMessage, Message} from "@repo/database";
import ApiResponse from "../../utils/apiResponse";
import { getFilesPayload } from "./messageSupporter/filePayload";
import { IFile } from "@repo/database/dist/models/communication/message.model";
import { createMessages } from "./messageSupporter/createMessage";
import { ConversationWebSocketServer } from "../../websockets/servers/conversation.websocket";

const formatFileSize = (bytes: number): string => {
  const MB = bytes / (1024 * 1024);
  if (MB >= 1000) {
    return `${(MB / 1024).toFixed(1)}GB`;
  }
  return `${MB.toFixed(1)}MB`;
};


// 1️⃣ Create Message
export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  // console.log(req.params)
  // console.log(req.body)
  // console.log(req.files)
  // console.log(req.file)
  const { conversationId, creatorId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(creatorId) || !mongoose.Types.ObjectId.isValid(conversationId)){
    throw new ApiError(403, "ConversationId or CreatorId is not a valid id");
  }

  if(req.user?._id !== creatorId){
    throw new ApiError(403, "Unauthorized attempt!, You can login then initiate conversation.")
  }

  const conversation = await Conversation.findById(conversationId);
  
  if(!conversation){
    throw new ApiError(404, "Conversation with this user doen't exist, please initiate one and try again!")
  }

  const { messageType, textContent } = req.body;
  const receivers = conversation?.participants || [];
  
  const filteredReceivers = receivers.filter(
    (participantId) => participantId.toString() !== creatorId.toString()
  );

  let messagePayload: any = [];  
  if(req.files && Array.isArray(req.files) && req.files.length > 0){
    if (req.files.length > 5) {
      throw new ApiError(403, "You cannot attach more than 5 attachments.");
    }

    const files: IFile[] = req.files;
    if (!files || !Array.isArray(files)) {
      throw new ApiError(400, "No files provided");
    }

    const MAX_FILE_SIZE = 52428800; // 50MB in bytes
    const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

    const largeFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    // Input validation
    if (largeFiles.length > 0) {
      const errorData = largeFiles
        .map(file => `${file.originalname} (${formatFileSize(file.size)})`)
        .join(", ");
      
      const fileCount = largeFiles.length;
      const pluralFiles = fileCount > 1 ? "files" : "file";
      const pluralExceed = fileCount > 1 ? "exceed" : "exceeds";
      
      throw new ApiError(403, 
        `${fileCount} ${pluralFiles} ${pluralExceed} the ${MAX_FILE_SIZE_MB}MB limit: ${errorData}`
      );
    }

    const filePayloads = await getFilesPayload(files);

    // Now push all filePayloads into messagePayload array
    messagePayload.push(...filePayloads);
  }
  else if(messageType === "poll"){
    res.json({message: "poll message has been sent"})
  }
  else if(messageType === "contact"){
    res.json({message: "contact message has been sent"})
  }
  else if(messageType === "location"){
    res.json({message: "location message has been sent"})
  }
  else if(messageType === "sticker"){
    res.json({message: "sticker message has been sent"})

  }
  else if(messageType === "reply"){
    res.json({message: "reply message has been sent"})
  }
  else if(messageType === "forward"){
    res.json({message: "forward message has been sent"})
  }
  else if(messageType === "callog"){
    res.json({message: "calllog message has been sent"})
  }
  else if(messageType === "event"){
    res.json({message: "event message has been sent"})
  }
  else if(messageType === "system"){
    res.json({message: "system message has been sent"})
  }
  
  if(textContent && textContent?.length > 0){ 
    messagePayload.push({
      messageType: "text",
      textContent,
    });
  }

  const tailoredMessages: IMessage[] = messagePayload.map((message: any) => {
    const payload = {
        ...message, 
        conversationId: conversation?._id,
        senderId: creatorId,
        // deliveredTo: [creatorId],
        receiverIds: filteredReceivers?.map(userId=>new mongoose.Types.ObjectId(userId)),
        sentAt: Date.now(),
      }
      return payload;
  });
  
  if(tailoredMessages && Array.isArray(tailoredMessages) && tailoredMessages?.length === 0){
    throw new ApiError(404, "No message to send");
  }
  
  const messages = await Message.insertMany(tailoredMessages, {ordered: false});
  const unreadCount: Record<string, number> = {};

  filteredReceivers.forEach(userId => {
    const id = userId.toString();
    unreadCount[id] = (unreadCount[id] || 0) + messages?.length || 0;
  });

  const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessage: messages?.at(-1)?._id || messages?.[messages.length - 1]?._id, // Store ID, not full object
        lastMessageAt: new Date(), // Add timestamp
        unreadCount,
      }
  }, { new: true}).populate("lastMessage");
  
  messages.forEach((message)=>{
    console.log("broadcasting message")
    ConversationWebSocketServer.instance.broadcastMessageToRoom(conversationId, {message, conversation: updatedConversation});
  })
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Messages created successfully", 
        {
          conversation: updatedConversation,
          messages
        })
      );
});

// 2️⃣ Get Message by ID
export const getMessageById = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Get message by ID" });
});

// 3️⃣ Get Messages by Conversation
export const getMessagesByConversation = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId, userId } = req.params;
  if(!conversationId || !userId){
    throw new ApiError(404, "Conversation or user Id is missing.")
  }

  if([conversationId, userId].some(id=>!mongoose.Types.ObjectId.isValid(id))){
    throw new ApiError(403, "ConversationId or UserId is not valid")
  }

  if( req.user?._id !== userId ){
    throw new ApiError(404,  "Unauthorized Attempt. Please login again.")
  }

  const messages = await Message.find({
    conversationId: new mongoose.Types.ObjectId(conversationId)
  })
 
  // ConversationWebSocketServer.instance.broadcastConversationMessageToRoom(conversationId, messages);
  
  if(messages.length === 0){
    throw new ApiError(404, "No message found!")
  }
  return res.status(201).json(new ApiResponse(201, "Messages Fetched", messages));
});

export const markMessageAsDelivered = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
  console.log("marking message as delivered", {params: req.params, body: req.body, query: req.query});
  try {
    const { conversationId, messageId, userId } = req.params;
    const ids = [conversationId, messageId, userId];
    // console.log(ids)
    // console.log({middleware: req.user, userId})
    // Check for missing IDs
    if (ids.some(id => !id)) {
      throw new ApiError(403, "Conversation ID, Message ID, or User ID is missing");
    }

    if(req.user?._id !== userId){
      throw new ApiError(401, "Unauthorized attempt! You can edit only your own message");
    }

    // Check for invalid ObjectIds
    const invalid = ids.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalid) {
      throw new ApiError(403, `${invalid} is not a valid ID`);
    }
    
    const message: IMessage|null = await Message.findOne({ 
      _id: messageId, 
      // senderId: userId, 
      conversationId 
    });

    if (!message) {
      throw new ApiError(404, "Message with this id doesn't exist");
    }

    //check if object exist inside delivered to or not
    if(!message?.deliveredTo?.includes(new mongoose.Types.ObjectId(userId))){
      message.deliveredTo?.push(new mongoose.Types.ObjectId(userId));
      await message.save();
    }

    // Example broadcast payload
    const deliveryNotification = JSON.stringify({
      type: "delivered",
      conversationId,
      message,
      deliveredTo: userId,
      timestamp: new Date().toISOString()
    });

    ConversationWebSocketServer.instance.broadcastDeliveredToRoom(conversationId, deliveryNotification);

    
    return res.status(200).json(
      new ApiResponse(200, "Message delivered", message)
    ) 
  
  } catch (error) {
    next(error);
  }
})

export const markMessageAsSeen = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
  console.log("marking message as delivered", {params: req.params, body: req.body, query: req.query});
  try {
    const { conversationId, messageId, userId } = req.params;
    const ids = [conversationId, messageId, userId];
    console.log(ids)
    // Check for missing IDs
    if (ids.some(id => !id)) {
      throw new ApiError(403, "Conversation ID, Message ID, or User ID is missing");
    }

    if(req.user?._id !== userId){
      throw new ApiError(401, "Unauthorized attempt! You can edit only your own message");
    }

    // Check for invalid ObjectIds
    const invalid = ids.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalid) {
      throw new ApiError(403, `${invalid} is not a valid ID`);
    }
    
    const message: IMessage|null = await Message.findOne({ 
      _id: messageId, 
      // senderId: userId, 
      conversationId 
    });

    if (!message) {
      throw new ApiError(404, "Message with this id doesn't exist");
    }

    //check if object exist inside delivered to or not
    if(!message?.seenBy?.includes(new mongoose.Types.ObjectId(userId))){
      message.seenBy?.push(new mongoose.Types.ObjectId(userId));
      await message.save();
    }
    
    const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, {
      $inc: {
        [`unreadCount.${userId}`]: -1
      }
    }, { new: true });

    const readNotification = JSON.stringify({
      type: "read",
      conversationId,
      message,
      deliveredTo: userId,
      timestamp: new Date().toISOString()
    });

    ConversationWebSocketServer.instance.broadcastReadToRoom(conversationId, readNotification);

    res.status(200).json(
      new ApiResponse(200, "Message seen", { conversation: updatedConversation, message})
    ) 
  
  } catch (error) {
    next(error);
  }
})
// 4️⃣ Delete Message
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  res.json({ message: "Delete message" });
});


export const getUnseenOrUndeliveredMessages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    console.log({ params: req.params, body: req.body, query: req.query });

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, 'User ID is missing or invalid');
    }

    // Check authorization - convert both to strings for comparison
    if (req.user?._id?.toString() !== userId) {
      throw new ApiError(401, 'Unauthorized attempt');
    }

    // Get conversation IDs where user is a participant
    const conversationIds = await Conversation.find({
      participants: userId
    })
    .select("_id")
    .lean();

    // Handle empty conversations (user has no conversations)
    if (conversationIds.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, 'No conversations found for user', [])
      );
    }

    // Extract just the IDs for the query
    const conversationObjectIds = conversationIds.map(conv => conv._id);

    // Find messages that are either not delivered to this user OR not seen by this user
    // Also exclude messages sent by this user (assuming they don't need to see their own undelivered/unread status)
    const messages = await Message.find({
      conversationId: { $in: conversationObjectIds },
      sender: { $ne: userId }, // Exclude messages sent by this user
      $or: [
        { deliveredTo: { $nin: [userId] } }, // Not in deliveredTo array
        { seenBy: { $nin: [userId] } } // Not in seenBy array
      ]
    })
    .populate("conversationId") // Only populate needed fields
    // .populate("sender", "name avatar") // Also populate sender info
    .sort({ createdAt: -1 }) // Most recent first
    .lean();

    // No need to check if messages is falsy - it will be an empty array if no results
    console.log(`Found ${messages.length} unseen or undelivered messages for user ${userId}`);

    // Note: Broadcasting messages in a fetch endpoint is unusual
    // Consider if this logic should be elsewhere (like when messages are created/updated)
    
    // ConversationWebSocketServer
    // .instance
    // .broadcastUnseenMessageToRoom( 
    //   messages[0]?.conversationId?._id.toString(), 
    //   messages[0]
    // )
    // messages.forEach((message) => {
    //   ConversationWebSocketServer
    //     .instance
    //     .broadcastUnseenMessageToRoom(
    //       message?.conversationId._id.toString(),
    //       {
    //         conversation: message.conversationId,
    //         message
    //       }
    //     );
    // });

    return res.status(200).json(
      new ApiResponse(200, 'Unseen or undelivered messages fetched successfully', messages)
    );

  } catch (error) {
    console.error('Error fetching unseen/undelivered messages:', error);
    next(error);
  }
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
// export const markMessageAsDelivered = asyncHandler(async (req: Request, res: Response) => {
//   res.json({ message: "Mark message as delivered" });
// });

// // 1️⃣1️⃣ Mark as Seen
// export const markMessageAsSeen = asyncHandler(async (req: Request, res: Response) => {
//   res.json({ message: "Mark message as seen" });
// });

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
