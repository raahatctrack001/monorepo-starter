"use client";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { useGetAllConversations } from "@/hooks/conversation/userGetAllConversation";
import { IConversation } from "@/types/conversations/conversation.types";
import RedAlert from "../../../../src/components/common/RedAlert";
import LocalLoader from "../../../../src/components/common/LocalLoader";
import { storeConverstaions } from "@/lib/store/slices/conversation.slice";
import SearchContact from "./SearchContact";
import { IUser } from "@/types/user/user.types";
import { SelectContent } from "@radix-ui/react-select";
import ShowConversationList from "./ShowConversationList";
import { handleSelectedConversation } from "@/lib/services/converstion.service";
import { handleClickOnSearchedUser } from "@/lib/services/user.services";


interface ChatListProps {
  onSelectUser: (user: IConversation) => void;
}

const ConversationList: React.FC = () => {
  const { currentUser } = useAppSelector(state=>state.user);
  const [conversations, setConversations] = useState<IConversation[]>([])
  const [contact, setContact] = useState<IUser[]>([])
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
      <div>
        <SearchContact onSelectUser={(user)=>handleClickOnSearchedUser(user)} />
      </div>
      {loading && <LocalLoader description="Loading conversations"/>}
      <ShowConversationList conversations={conversations} error={error} onSelectConversation={(conv)=>handleSelectedConversation(conv)} />
    </div>
  );
};

export default ConversationList;
