"use client";
import ChatWindow from "@/components/common/conversation/ChatWindow";
import ConversationList from "@/components/common/conversation/ConversationList";
import MessageInput from "@/components/common/conversation/MessageInput";
import { User } from "@/lib/mockData";
import { useState } from "react";


const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const currentUserId = "u1";

  return (
    <div className="flex h-screen">
      <ConversationList onSelectUser={setSelectedUser} />
      <div className="flex flex-col flex-1">
        <ChatWindow selectedUser={selectedUser} currentUserId={currentUserId} />
        {selectedUser && <MessageInput />}
      </div>
    </div>
  );
};

export default ChatPage;
