"use client";
import ChatWindow from "app/(protected)/conversation/_components/ChatWindow";
import ConversationList from "app/(protected)/conversation/_components/ConversationList";
import MessageInput from "app/(protected)/conversation/_components/MessageInput";
import { User } from "@/lib/mockData";
import { useState } from "react";
import MessageInputBar from "./_components/MessageInputBar";
import { useAppSelector } from "@/lib/store/hooks";


const ChatPage: React.FC = () => {
  const { activeConversation } = useAppSelector(state=>state.conversation)
  return (
    <div className="flex h-screen">
      <div className="hidden lg:inline">
        <ConversationList />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col flex-1">
          <ChatWindow />
          {activeConversation && <MessageInputBar />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
