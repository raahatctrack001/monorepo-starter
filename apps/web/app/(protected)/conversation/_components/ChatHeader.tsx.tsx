"use client";

import { Video, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IConversation } from "@/types/conversations/conversation.types";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  activeConversation: IConversation;
  // onSearchMessage: (query: string) => void;
}

export default function ChatHeader({
  activeConversation,
  // onSearchMessage,
}: ChatHeaderProps) {
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <div className="border-b px-4 py-3 flex items-center justify-between gap-3 bg-background">
      {/* Conversation Name */}
      <div className="font-semibold text-lg truncate">
        {activeConversation.isGroup
          ? activeConversation.conversationName
          : activeConversation.customNickname?.[currentUser?._id as string] ||
            "social media"}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full"
          title="Voice Call"
        >
          <Phone size={18} />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="rounded-full"
          title="Video Call"
        >
          <Video size={20} />
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Search messages…"
            onChange={(e) => onSearchMessage(e.target.value)}
            className={cn("pl-8 h-9 w-48 rounded-md")}
          />
        </div>
      </div>
    </div>
  );
}
