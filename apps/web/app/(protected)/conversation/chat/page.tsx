"use client";
import ChatWindow from "app/(protected)/conversation/chat/_components/ChatWindow";
import ConversationList from "app/(protected)/conversation/chat/_components/ConversationList";
import { useEffect, useState } from "react";
import MessageInputBar from "./_components/MessageInputBar";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { IConversation } from "@/types/conversations/conversation.types";
import ChatHeader from "./_components/ChatHeader.tsx";
import { safeSend } from "@/lib/context/safeSend";
import { useWebSocket } from "@/lib/context/WebSocketContext";
import { deactivateConversation } from "@/lib/store/slices/conversation.slice";


const ChatPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<IConversation|null>(null);
  const { activeConversation: ac } = useAppSelector(state=>state.conversation);
  const [conversationId, setConversationId] = useState<string|null>(null);
  const { currentUser } = useAppSelector(state=>state.user);
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(deactivateConversation());
  }, [dispatch])
  
  useEffect(()=>{
      setActiveConversation(ac);
      setConversationId(ac?._id as string);
      // console.log("update online status")
    }, [conversationId, ac])  

    const ws = useWebSocket();
    
    useEffect(() => {
      safeSend(ws, { type: "online", userId: currentUser?._id });
      return () => {
        safeSend(ws, { type: "offline", userId: currentUser?._id });
      }
    }, [ws, currentUser]);

  return (
    <div className="flex h-screen">
      <div className="hidden lg:inline">
        <ConversationList />
      </div>
      {activeConversation && <div className="flex flex-col w-full">
        <div className="flex flex-col flex-1 h-full">
          <ChatHeader />
          <ChatWindow />
          <MessageInputBar conversationId={activeConversation?._id as string} />
        </div>
      </div>}
    </div>
  );
};

export default ChatPage;
