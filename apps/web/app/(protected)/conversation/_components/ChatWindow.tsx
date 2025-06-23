"use client"
import { IUser } from "@/types/user/user.types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { IMessage } from "@/types/conversations/message.types";
import { DependencyList, useEffect, useRef, useState, useCallback } from "react";
import { useGetMessageByConversation } from "@/hooks/conversation/message/useGetMessageByConversation";
import { IConversation } from "@/types/conversations/conversation.types";
import RedAlert from "@/components/common/RedAlert";
import GlobalLoader from "@/components/common/GlobalLoader";
import {
  TextMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  DocumentMessage,
} from "./messageScreen/MessageComponents";
import { format, isSameDay } from "date-fns";
import { ImageViewer } from "@/components/common/ImageViewer";
import { MessagePreviewModal } from "./messageScreen/MessagePreviewModal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { addConversationMessages, addMessageToConversation } from "@/lib/store/slices/message.slice";
import { useWebSocket } from "@/lib/context/WebSocketContext";
import { safeSend } from "@/lib/context/safeSend";
import { updateConversation } from "@/lib/store/slices/conversation.slice";

const ChatWindow: React.FC = () => {
  const ws = useWebSocket();
  const { currentUser } = useAppSelector((state) => state.user);
  const { activeConversation } = useAppSelector(state => state.conversation);
  const [msgs, setMsgs] = useState<IMessage[]|[]>([]);
  // Get messages directly from Redux using the activeConversation ID
  const messagesFromRedux = useAppSelector(state => {
    const conversationId = activeConversation?._id;
    return conversationId ? state.message.conversations[conversationId] || [] : [];
  });

  
  useEffect(()=>{
    setMsgs(messagesFromRedux);
  }, [messagesFromRedux])
  const dispatch = useAppDispatch();
  
  const [previewChat, setPreviewChat] = useState<IMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ws || !activeConversation?._id) return;

    safeSend(ws, { type: 'join', conversationId: activeConversation._id as string});
    
    safeSend(ws, { type: "online", userId: currentUser?._id });
    return () => {
      safeSend(ws, { type: "offline", userId: currentUser?._id });
    }
    
  }, [ws, currentUser, dispatch, activeConversation?._id]);


  const { getAllMessageByConversation, loading, error } = useGetMessageByConversation();
  
  const scrollToBottomOnSendMessage = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(()=>{scrollToBottomOnSendMessage()}, [msgs])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const getMessages = useCallback(async () => {
    if (!activeConversation || !currentUser?._id) return;
    
    const result = await getAllMessageByConversation(activeConversation._id, currentUser._id);
    if (result?.success) {
      console.log("data fetched", result);
      dispatch(addConversationMessages({
        conversationId: activeConversation?._id,
        messages: result?.data
      }));
    }
  }, [activeConversation?._id]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation?._id) {
      console.log("getting message")
      getMessages();
    }
  }, [activeConversation?._id]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start conversation.
      </div>
    );
  }

  // Check for no messages - use messagesFromRedux directly
  if (messagesFromRedux.length === 0 && !loading) {
    return (
      <div className="w-full h-full flex justify-center items-center mx-auto">
        <div className="max-w-md">
          <RedAlert 
            heading="No Messages" 
            description="Please send a message to start conversation" 
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center mx-auto">
        <div className="max-w-md">
          <RedAlert
            heading="Error Loading Messages"
            description={error || "Failed to load messages. Please try again."}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center mx-auto">
        <div className="max-w-md">
          <GlobalLoader
            heading="Loading Messages"
            description="Please wait while we load your messages."
          />
        </div>
      </div>
    );
  }

  const renderMessage = (message: IMessage) => {
    const isSender = message?.senderId?.toString() === currentUser?._id;

    const status = isSender
      ? message.seenBy && message.seenBy.length > 0
        ? "Seen"
        : message.deliveredTo && message.deliveredTo.length > 0
        ? "Delivered"
        : "Sent"
      : "";

    return (
      <div className={`flex ${isSender ? "justify-end" : "justify-start"}`} key={message._id}>
        <div 
          onClick={() => message.messageType === "image" && setPreviewChat(message)}
          className={`max-w-[75%] ${isSender ? "bg-blue-100" : "bg-gray-100"} rounded-lg p-2 relative cursor-pointer`}
        >
          {(() => {
            switch (message.messageType) {
              case "text":
                return <TextMessage message={message} />;
              case "image":
                return <ImageMessage message={message} />;
              case "video":
                return <VideoMessage message={message} />;
              case "audio":
                return <AudioMessage message={message} />;
              case "document":
                return <DocumentMessage message={message} />;
              default:
                return (
                  <div className="text-gray-500 text-sm">
                    Unsupported message type: {message.messageType}
                  </div>
                );
            }
          })()}

          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <span>{format(new Date(message.sentAt || new Date()), "hh:mm a")}</span>
            {isSender && <span>• {status}</span>}
          </div>
        </div>
      </div>
    );
  };

  let lastMessageDate: string | null = null;

  return (
    <div className="flex flex-col flex-1 h-screen max-h-3/4">
      {/* Modal outside the main content */}
      {previewChat && (
        <MessagePreviewModal 
          message={previewChat} 
          onClose={() => setPreviewChat(null)} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messagesFromRedux.map((message) => {
          const messageDate = format(new Date(message.sentAt || new Date()), "yyyy-MM-dd");
          const showDateSeparator = messageDate !== lastMessageDate;
          lastMessageDate = messageDate;

          return (
            <div key={message._id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="text-gray-500 text-xs px-3 py-1 bg-gray-200 rounded-full">
                    {format(new Date(message.sentAt || new Date()), "do MMM yyyy")}
                  </div>
                </div>
              )}
              {renderMessage(message)}
            </div>
          );
        })}
        <div ref={bottomRef} />
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button - outside the message container */}
      <Button
        onClick={scrollToBottom}
        className="fixed bottom-44 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        <ArrowDown size={20} />
      </Button>
    </div>
  );
};

export default ChatWindow;