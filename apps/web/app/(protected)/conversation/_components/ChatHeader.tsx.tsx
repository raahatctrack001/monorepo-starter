"use client";

import { Video, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IConversation } from "@/types/conversations/conversation.types";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function ChatHeader() {
  const { currentUser } = useAppSelector((state) => state.user);
  const { activeConversation } = useAppSelector((state) => state.conversation);
  const { users: onlineUsers } = useAppSelector((state) => state.status);
  const typingStatus = useAppSelector((state) => state.status.typingStatus);

  const  router = useRouter()

  console.log(typingStatus);
  const [onlineStatus, setOnlineStatus] = useState<{ isOnline: boolean; lastSeen: Date | null }>();
  const [isTyping, setIsTyping] = useState(false);

  // Memoize the other participant ID to avoid recalculation
  const otherParticipantId = useMemo(() => {
    if (!activeConversation || activeConversation.isGroup || !currentUser) return null;
    
    return activeConversation.participants.find(
      (id) => id.toString() !== currentUser._id
    )?.toString() || null;
  }, [activeConversation, currentUser]);

  // Memoize group participants info
  const groupParticipantsInfo = useMemo(() => {
    if (!activeConversation?.isGroup) return null;
    
    const participantCount = activeConversation.participants.length;
    return `${participantCount} participant${participantCount !== 1 ? 's' : ''}`;
  }, [activeConversation]);

  useEffect(() => {
    if (!otherParticipantId || !activeConversation) {
      setOnlineStatus(undefined);
      setIsTyping(false);
      return;
    }

    const status = onlineUsers[otherParticipantId];
    setOnlineStatus(status);

    // Check typing status
    const isTypingNow = typingStatus[activeConversation._id]?.[otherParticipantId] || false;
    setIsTyping(isTypingNow);
  }, [otherParticipantId, onlineUsers, activeConversation, typingStatus]);

  if (!activeConversation || !currentUser) return null;

  const getDisplayName = () => {
    if (activeConversation.isGroup) {
      return activeConversation.conversationName || "Group Chat";
    }
    return activeConversation.customNickname?.[currentUser._id] || "Social Media";
  };

  const getStatusText = () => {
    if (activeConversation.isGroup) {
      return groupParticipantsInfo || "Group chat";
    }

    if (isTyping) return "Typing…";
    if (onlineStatus?.isOnline) return "Online";
    if (onlineStatus?.lastSeen) {
      return `Last seen: ${new Date(onlineStatus.lastSeen).toLocaleString()}`;
    }
    return "Offline";
  };

  const getProfileLink = () => {
    if (activeConversation.isGroup) {
      return `/profile/group/${activeConversation._id}`;
    }
    return `/profile/${otherParticipantId || 'unknown'}`;
  };

  return (
    <div className="border-b px-4 py-3 w-full flex items-center justify-between gap-3 bg-background">
      <Link href={getProfileLink()} className="flex items-center gap-2">
        <Image
          src={
            activeConversation.conversationImage ??
            process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ??
            "/fallback-cover.jpg"
          }
          alt={`${getDisplayName()} profile picture`}
          width={40}
          height={40}
          className="h-10 w-10 object-cover rounded-full"
        />

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-lg truncate">
            {getDisplayName()}
          </div>

          <p className="text-sm text-muted-foreground truncate">
            <span className="truncate max-w-2xs sm:max-w-sm md:max-w-md lg:max-w-xl">
              {getStatusText()}
            </span>
          </p>
        </div>
      </Link>

      <div className="flex items-center md:gap-2">
        <Button 
          variant="ghost" 
          size="lg" 
          className="rounded-full" 
          title="Voice Call"
          aria-label="Start voice call"
          onClick={()=>router.push(`conversation?call=${otherParticipantId}`)}
        >
          <Phone size={18} />
        </Button>

        <Button 
          variant="ghost" 
          size="lg" 
          className="rounded-full" 
          title="Video Call"
          aria-label="Start video call"
          onClick={()=>router.push(`conversation?call=${otherParticipantId}`)}
        >
          <Video size={20} />
        </Button>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search messages…"
            className={cn("pl-8 h-9 w-48 rounded-md hidden sm:inline")}
            aria-label="Search messages"
          />
        </div>
      </div>
    </div>
  );
}