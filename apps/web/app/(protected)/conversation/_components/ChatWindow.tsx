import { IUser } from "@/types/user/user.types";
import MessageBubble from "./MessageBubble";
import { Message, messages } from "@/lib/mockData";
import { useAppSelector } from "@/lib/store/hooks";
import ChatHeader from "./ChatHeader.tsx";

interface ChatWindowProps {
  selectedUser: IUser | null;
  currentUserId: string;
}

const ChatWindow: React.FC = () => {
  const { activeConversation } = useAppSelector(state=>state.conversation);
  const { currentUser } = useAppSelector(state=>state.user);
  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen">
      <ChatHeader activeConversation={activeConversation} />
      {/* <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg: Message) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
          />
        ))}
      </div> */}
    </div>
  );
};

export default ChatWindow;
