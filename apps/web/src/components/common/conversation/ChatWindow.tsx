import MessageBubble from "./MessageBubble";
import { Message, messages, User } from "@/lib/mockData";

interface ChatWindowProps {
  selectedUser: User | null;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, currentUserId }) => {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen">
      <div className="border-b p-4 font-semibold text-lg">{selectedUser.name}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg: Message) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
