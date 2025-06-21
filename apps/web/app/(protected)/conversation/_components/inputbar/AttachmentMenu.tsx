"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Image,
  Mic,
  MapPin,
  BarChart3,
  Contact,
  PhoneCall,
  Calendar,
} from "lucide-react";
import { useRef, useState } from "react";
import { VoiceNoteRecorder } from "./VoiceNoteRecorder";
import { useCreateMessage } from "@/hooks/conversation/message/useCreateMessage";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addMessageToConversation } from "@/lib/store/slices/message.slice";

export default function AttachmentMenu({conversationId}: {conversationId: string}) {
  const mediaInputRef = useRef<HTMLInputElement>(null!);
  const voiceNoteInputRef = useRef<HTMLInputElement>(null!);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector(state=>state.user);

  const handleOtherAttachment = (label: string) => {
    console.log("Trigger action for:", label);
    // implement modals, pickers etc for location, poll, contact etc.
  };

  const attachmentOptions = [
    {
      label: "Media",
      icon: Image,
      onClick: () => mediaInputRef.current.click(),
    },
    {
      label: "Voice Note",
      icon: Mic,
      onClick: () => setShowVoiceRecorder(true),
    },
    {
      label: "Location",
      icon: MapPin,
      onClick: () => handleOtherAttachment("Location"),
    },
    {
      label: "Poll",
      icon: BarChart3,
      onClick: () => handleOtherAttachment("Poll"),
    },
    {
      label: "Contact",
      icon: Contact,
      onClick: () => handleOtherAttachment("Contact"),
    },
    {
      label: "Call Log",
      icon: PhoneCall,
      onClick: () => handleOtherAttachment("Call Log"),
    },
    {
      label: "Event",
      icon: Calendar,
      onClick: () => handleOtherAttachment("Event"),
    },
  ];

  const { sendMessage, loading, error } = useCreateMessage();
// Alternative version with loading state handling
  const sendVoiceMessage = async (audioFile: File) => {
    try {
      // Validate required data
      if (!audioFile || !conversationId || !currentUser?._id) {
        throw new Error("Missing required data for sending voice message");
      }

      console.log("Sending voice message:", {
        fileName: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type
      });

      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("messageType", "voice");
      
      const result = await sendMessage(formData, conversationId, currentUser._id);
      
      if (result?.success) {
        console.log("Voice message sent successfully", result);
        const { data } = result;
        if (data && Array.isArray(data) && data.length > 0) {
          dispatch(addMessageToConversation({
            conversationId, // or wherever your conversation id is
            messages: data,
          }));
        }
      }
 else {
        throw new Error(result?.message || "Failed to send voice message");
      }
      
    } catch (err) {
      console.error("Error sending voice message:", err);
      // You might want to show a toast notification here
      throw err;
    }
  };
  return (
    <>
      {/* Popover Trigger */}
      <Popover>
        {
          showVoiceRecorder && 
            <VoiceNoteRecorder
              open={showVoiceRecorder}
              onClose={() => setShowVoiceRecorder(false)}
              onSend={(audioFile: File) => sendVoiceMessage(audioFile)}
            />
        }
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip size={18} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-48 p-2 flex flex-col gap-1">
          {attachmentOptions.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start text-sm"
              onClick={item.onClick}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Hidden Inputs for Media and Voice Note */}
      <input
        type="file"
        ref={mediaInputRef}
        className="hidden"
        accept="image/*,video/*,application/pdf"
        multiple
        onChange={(e) => {
          console.log("Selected media files:", e.target.files);
        }}
      />

      <input
        type="file"
        ref={voiceNoteInputRef}
        className="hidden"
        accept="audio/*"
        onChange={(e) => {
          console.log("Selected voice note:", e.target.files);
        }}
      />
    </>
  );
}
