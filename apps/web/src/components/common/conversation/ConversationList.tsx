"use client";
import Image from "next/image";


interface ChatListProps {
  onSelectUser: (user: User) => void;
}

const ConversationList: React.FC<ChatListProps> = ({ onSelectUser }) => {
  return (
    <div className="w-72 border-r h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => onSelectUser(user)}
        >
          <div className="relative">
            <Image
              src={user.profilePic}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            {user.isOnline && (
              <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h4 className="font-medium">{user.name}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

import { User, users } from "@/lib/mockData";
export default ConversationList;
