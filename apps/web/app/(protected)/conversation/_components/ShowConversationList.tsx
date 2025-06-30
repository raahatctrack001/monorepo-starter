"use client";

import Image from "next/image";
import { IConversation } from "@/types/conversations/conversation.types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import RedAlert from "@/components/common/RedAlert";
import { IMessage } from "@/types/conversations/message.types";
import { format, isToday } from "date-fns";
import { activateConverstaion, storeConverstaions } from "@/lib/store/slices/conversation.slice";
import { useEffect, useState } from "react";
import { useGetAllConversations } from "@/hooks/conversation/userGetAllConversation";
import LocalLoader from "@/components/common/LocalLoader";
import { useWebSocket } from "@/lib/context/WebSocketContext";
import { safeSend } from "@/lib/context/safeSend";
import { useRouter } from "next/navigation";
import { useUnseenMessages } from "@/hooks/conversation/message/useUnseenMessage";
;
// interface ConversationListProps {
//   conversations: IConversation[];
//   error?: string | null;
//   // onSelectConversation: (conversation: IConversation) => void;
// }

export default function ShowConversationList() {
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.user);
  const { conversations: convs } = useAppSelector(state => state.conversation);
  const dispatch = useAppDispatch();
  const [conversations, setConversations] = useState<IConversation[] | []>([])
  

  
  const { getAllConversations, loading, error } = useGetAllConversations(); 
  

  useEffect(()=>{
    setConversations(convs);
    console.log("settign up conversations", convs)
  }, [convs])

  useEffect(()=>{
    (async ()=>{
      const result = await getAllConversations(currentUser?._id as string);
      console.log(result)
      if(result?.success){
        setConversations(result.data.conversations)
        dispatch(storeConverstaions(result.data.conversations))
      }
    })()
  }, []) 

  const handleConversationClick = (conversation: IConversation) => {
    dispatch(activateConverstaion(conversation))
    // router.push(`/conversation?active=${conversation?._id}`)
  }
  return (
    <div className="w-72 border-r h-screen p-4">
      {/* <h2 className="text-xl font-bold mb-4">Chats</h2> */}
       {loading && <LocalLoader description="Loading conversations"/>}
      {conversations?.length > 0 ? (
        conversations.map((conversation: IConversation) => {
          // @ts-ignore
          const lastMessage: IMessage|null = conversation.lastMessage || null;
          // console.log("last message is this", lastMessage)
          

        return (
          <div
            key={conversation._id}
            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted transition"
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="relative">
              <Image
                src={
                  conversation.conversationImage ||
                  process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ||
                  "/fallback-cover.jpg"
                }
                alt={conversation.conversationName || "conversation"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {conversation.isGroup
                  ? conversation.conversationName
                  : conversation.customNickname?.[currentUser?._id as string] || "deleted-user"}
              </h4>

              <p className="text-xs text-gray-500 truncate">
                {lastMessage?.textContent
                  ? lastMessage.textContent
                  : lastMessage?.messageType === "image"
                  ? "📷 Photo"
                  : lastMessage?.messageType === "video"
                  ? "🎥 Video"
                  : lastMessage?.messageType === "audio"
                  ? "🎙️ Voice note"
                  : lastMessage?.messageType === "document"
                  ? "📄 Document"
                  : lastMessage
                  ? "New message"
                  : "No messages yet"}
              </p>
            </div>

            {/* Message time */}
            <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {lastMessage?.sentAt
                ? isToday(new Date(lastMessage.sentAt))
                  ? format(new Date(lastMessage.sentAt), "hh:mm a")
                  : format(new Date(lastMessage.sentAt), "dd MMM")
                : ""}
            </div>

            {/* unread count */}
            {/* <div>
                {
                  conversation && 
                  conversation?.unreadCount && 
                  conversation?.unreadCount[currentUser?._id as string] || 0
                }
            </div> */}
          </div>
        );
        })
      ) : (
        <div className="flex flex-col h-screen justify-start items-center">
          <RedAlert
            heading="Conversation Error"
            description={error || "Please initiate the conversation"}
          />
        </div>
      )}
    </div>
  );
}
