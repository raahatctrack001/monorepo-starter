"use client";

import Image from "next/image";
import { IConversation } from "@/types/conversations/conversation.types";
import { useAppSelector } from "@/lib/store/hooks";
import RedAlert from "@/components/common/RedAlert";

interface ConversationListProps {
  conversations: IConversation[];
  error?: string | null;
  onSelectConversation: (conversation: IConversation) => void;
}

export default function ShowConversationList({
  conversations,
  error,
  onSelectConversation,
}: ConversationListProps) {
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <div className="w-72 border-r h-screen p-4">
      {/* <h2 className="text-xl font-bold mb-4">Chats</h2> */}

      {conversations?.length > 0 ? (
        conversations.map((conversation) => (
          <div
            key={conversation._id}
            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted transition"
            onClick={() => onSelectConversation(conversation)}
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

            <div>
              <h4 className="font-medium text-sm">
                {conversation.isGroup
                  ? conversation.conversationName
                  : conversation.customNickname?.[currentUser?._id as string] ||
                    "social media"}
              </h4>
            </div>
          </div>
        ))
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
