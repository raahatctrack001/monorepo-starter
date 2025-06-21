"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { useGetAllConversations } from "@/hooks/conversation/userGetAllConversation";
import { IConversation } from "@/types/conversations/conversation.types";
import LocalLoader from "../../../../src/components/common/LocalLoader";
import { activateConverstaion, storeConverstaions } from "@/lib/store/slices/conversation.slice";
import SearchContact from "./SearchContact";
import ShowConversationList from "./ShowConversationList";
import { handleClickOnSearchedUser } from "@/lib/services/user.services";


interface ChatListProps {
  onSelectUser: (user: IConversation) => void;
}

const ConversationList: React.FC = () => {
  return (
    <div className="w-72 border-r h-screen max-h-3/4 p-4 overflow-auto mt-15">
      <h2 className="text-xl font-bold mb-4 fixed z-1 top-5">Chats</h2>
      <div>
        <SearchContact onSelectUser={(user)=>handleClickOnSearchedUser(user)} />
      </div>
      <ShowConversationList />
    </div>
  );
};

export default ConversationList;
