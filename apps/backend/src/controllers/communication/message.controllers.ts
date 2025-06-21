import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import mongoose from "mongoose";
import ApiError from "../../utils/apiError";
import { Conversation, IMessage, Message} from "@repo/database";
import ApiResponse from "../../utils/apiResponse";
import { getFilesPayload } from "./messageSupporter/filePayload";
import { IFile } from "@repo/database/dist/models/communication/message.model";
import { createMessages } from "./messageSupporter/createMessage";


// 1️⃣ Create Message
export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.params)
  console.log(req.body)
  console.log(req.files)
  console.log(req.file)
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
        receiverIds: filteredReceivers?.map(userId=>new mongoose.Types.ObjectId(userId)),
        sentAt: Date.now(),
      }
      return payload;
  });
  
  if(tailoredMessages && Array.isArray(tailoredMessages) && tailoredMessages?.length === 0){
    throw new ApiError(404, "No message to send");
  }
  const messages = await createMessages(tailoredMessages);
   const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, {
     $set: {
      lastMessage: messages?.at(-1)?._id || messages?.[messages.length - 1]?._id, // Store ID, not full object
      lastMessageAt: new Date(), // Add timestamp
    }
  }, { new: true}).populate("lastMessage");
  
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
  // .sort({createdAt: -1})
  // .limit(20);

  // if(messages.length === 0){
  //   throw new ApiError(404, "Please send message to start chatting.");
  // }
  
  return res.status(201).json(new ApiResponse(201, "Messages Fetched", messages));
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
