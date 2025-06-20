import { IUser } from "@/types/user/user.types";
import { useAppSelector } from "@/lib/store/hooks";
import { IMessage } from "@/types/conversations/message.types";
import { useEffect, useState } from "react";
import { useGetMessageByConversation } from "@/hooks/conversation/message/useGetMessageByConversation";
import { IConversation } from "@/types/conversations/conversation.types";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  selectedUser: IUser | null;
  currentUserId: string;
}

interface Props {
  activeConversation: IConversation | null;
}

const ChatWindow: React.FC<Props> = ({activeConversation}: Props) => {
  console.log("changed chat window")

  const { currentUser } = useAppSelector(state=>state.user);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { getAllMessageByConversation, loading, error } = useGetMessageByConversation();
  useEffect(()=> {
    (async ()=>{
      const result = await getAllMessageByConversation(activeConversation?._id as string, currentUser?._id as string)
      console.log(result);

      if(result?.success){
        setMessages(result.data);
      }
    })()
  },[activeConversation])

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen max-h-3/4">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg: IMessage) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
