"use client";
import ChatWindow from "app/(protected)/conversation/_components/ChatWindow";
import ConversationList from "app/(protected)/conversation/_components/ConversationList";
import MessageInput from "app/(protected)/conversation/_components/MessageInput";
import { User } from "@/lib/mockData";
import { useEffect, useState } from "react";
import MessageInputBar from "./_components/MessageInputBar";
import { useAppSelector } from "@/lib/store/hooks";
import { IConversation } from "@/types/conversations/conversation.types";
import ChatHeader from "./_components/ChatHeader.tsx";


const ChatPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<IConversation|null>(null);
  const { activeConversation: ac } = useAppSelector(state=>state.conversation);

  useEffect(()=>{
    setActiveConversation(ac);
  }, [ac])
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
