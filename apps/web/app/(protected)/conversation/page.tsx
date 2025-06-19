"use client";
import ChatWindow from "app/(protected)/conversation/_components/ChatWindow";
import ConversationList from "app/(protected)/conversation/_components/ConversationList";
import MessageInput from "app/(protected)/conversation/_components/MessageInput";
import { User } from "@/lib/mockData";
import { useState } from "react";


const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentUserId = "u1";

  return (
    <div className="flex h-screen">
      <ConversationList />
      <div className="flex flex-col flex-1">
        <ChatWindow selectedUser={selectedUser} currentUserId={currentUserId} />
        {selectedUser && <MessageInput />}
      </div>
    </div>
  );
};

export default ChatPage;
