"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { useGetAllConversations } from "@/hooks/conversation/userGetAllConversation";
import { IConversation } from "@/types/conversations/conversation.types";
import RedAlert from "../RedAlert";
import LocalLoader from "../LocalLoader";
import { storeConverstaions } from "@/lib/store/slices/conversation.slice";


interface ChatListProps {
  onSelectUser: (user: IConversation) => void;
}

const ConversationList: React.FC<ChatListProps> = ({ onSelectUser }: ChatListProps) => {
  const { currentUser } = useAppSelector(state=>state.user);
  const [conversations, setConversations] = useState<IConversation[]>([])

  const { getAllConversations, loading, error } = useGetAllConversations(); 
  const dispatch = useAppDispatch();

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
  return (
    <div className="w-72 border-r h-screen max-h-3/4 p-4 overflow-auto mt-15">
      <h2 className="text-xl font-bold mb-4 fixed z-1 top-5">Chats</h2>
      {loading && <LocalLoader description="Loading conversations"/>}
      {conversations?.length > 0 ? conversations?.map((conversation) => (
        <div
          key={conversation._id}
          className="flex items-center gap-3 p-2 rounded cursor-pointer"
          onClick={() => onSelectUser(conversation)}
        >
          <div className="relative">
            <Image
              src={conversation?.conversationImage || process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL || "/fallback-cover.jpg" }
              alt={conversation.conversationName || "conversation"}
              width={40}
              height={40}
              className="rounded-full"
            />
            {/* {user.isOnline && (
              <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
            )} */}
          </div>
          <div>
            <h4 className="font-medium">{conversation.conversationName}</h4>
          </div>
        </div>
      )) : <div className="flex flex-col h-screen justify-start items-center">
          <RedAlert heading="Conversation Error" description={error || "Please initiate the conversation"}/>
        </div>}
    </div>
  );
};

export default ConversationList;
