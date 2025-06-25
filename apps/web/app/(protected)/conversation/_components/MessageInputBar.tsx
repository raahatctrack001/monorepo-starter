"use client";

import { useEffect, useRef, useState } from "react";
import AttachmentMenu from "./inputbar/AttachmentMenu";
import EmojiPicker from "./inputbar/EmojiPicker";
import TextInput from "./inputbar/TextInput";
import SendButton from "./inputbar/SendButton";
import FilePreviewDialog from "./inputbar/FilePreviewDialogue";
import LocalLoader from "@/components/common/LocalLoader";
import { useCreateMessage } from "@/hooks/conversation/message/useCreateMessage";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addMessageToConversation } from "@/lib/store/slices/message.slice";
import { updateConversation } from "@/lib/store/slices/conversation.slice";
import { safeSend } from "@/lib/context/safeSend";
import { useWebSocket } from "@/lib/context/WebSocketContext";


export default function MessageInputBar({conversationId}: {conversationId: string}) {
  console.log("input bar conversationId", conversationId);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string|null> (null); //error on sending message;
  const { currentUser } = useAppSelector(state=>state.user);
  const { activeConversation } = useAppSelector(state=>state.conversation);
  const dispatch = useAppDispatch();
  
  const { sendMessage, loading, error:hookError } = useCreateMessage();  
  const ws = useWebSocket();

 const typingTimeout = useRef<NodeJS.Timeout | null>(null);
const isTyping = useRef(false);

  const handleTyping = () => {
    if (!ws || !currentUser || !activeConversation) return;

    if (!isTyping.current) {
      safeSend(ws, {
        type: "typing",
        conversationId: activeConversation._id,
        userId: currentUser._id,
      });
      isTyping.current = true;
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      safeSend(ws, {
        type: "stopTyping",
        conversationId: activeConversation._id,
        userId: currentUser._id,
      });
      isTyping.current = false;
    }, 1000);
  };

  const handleSend = async () => {
    setError(null);
    if (!message.trim()) {
      setError("Type something to send.")
      return;
    }

    const formData = new FormData();
    formData.append("textContent", message);
    formData.append("messageType", "text");
    const result = await sendMessage(formData, conversationId, currentUser?._id as string);
    if(result?.success){
      console.log(result)
      // dispatch(updateConversation(result.data?.conversation))
      // dispatch(addMessageToConversation({
      //   conversationId: result.data?.conversation?._id,
      //   messages: result.data?.messages
      // }))
      console.log("text message sent", result.data?.messages)
      setMessage("");
    }
    console.log("message sent resposne", result);   

  };

  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <>
      <div className="w-full border-t px-4 py-3 flex items-center gap-2 bg-background">
        <AttachmentMenu 
          conversationId={conversationId} 
          onSendMessage={(loading) => setSendingMessage(loading)} 
          onError={(err)=>setError(err)}
        />
        <EmojiPicker onSelect={handleEmojiSelect} />


        
        <TextInput
          message={message}
          setMessage={setMessage}
          onKeyPress={handleKeyPress}
          sendTypingStatus={handleTyping}
        />

        {
          sendingMessage ? 
             <div className="relative">     
                <LocalLoader heading="sending" />         
             </div>: 
            <SendButton onClick={handleSend} disable={message?.trim()?.length === 0} /> 
        }
      </div>
    </>
  );
}
