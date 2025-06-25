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
import { useRef, useState, useEffect } from "react";
import { VoiceNoteRecorder } from "./VoiceNoteRecorder";
import { useCreateMessage } from "@/hooks/conversation/message/useCreateMessage";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addMessageToConversation } from "@/lib/store/slices/message.slice";
import ErrorPopup from "@/components/common/ErrorPopup";
import { IMessage } from "@/types/conversations/message.types";
import { IConversation } from "@/types/conversations/conversation.types";
import { updateConversation } from "@/lib/store/slices/conversation.slice";
import { useWebSocket } from "@/lib/context/WebSocketContext";
import { safeSend } from "@/lib/context/safeSend";

interface AttachmentMenuProps {
  conversationId: string
  onSendMessage: (loading: boolean) => void
  onError?: (err: string|null) => void
}

export default function AttachmentMenu({conversationId, onSendMessage }: AttachmentMenuProps) {
  const mediaInputRef = useRef<HTMLInputElement>(null!);
  const voiceNoteInputRef = useRef<HTMLInputElement>(null!);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string|null>(null);
  const [recTrigger, setRecTrigger] = useState<boolean> (false); //triggered on received or sent
  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector(state=>state.user);

  const { sendMessage, loading, error: hookError } = useCreateMessage();

  // Handle loading and error states from hook
  useEffect(() => {
    onSendMessage(loading);
  }, [loading, onSendMessage]);

  useEffect(() => {
    setLocalError(hookError);
  }, [hookError]);

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

  const sendVoiceMessage = async (audioFile: File) => {
    setLocalError(null)
    try {
      // Clear any previous local errors
      setLocalError(null);

      // Validate required data
      if (!audioFile || !conversationId || !currentUser?._id) {
        const errorMsg = "Missing required data for sending voice message";
        setLocalError(errorMsg);
        return;
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
      console.log(result)
      // Check if result is null (error occurred in hook)
      if (!result) {
        // Error is already handled by the hook and will be passed via useEffect
        return;
      }

      // Success case - update store
      console.log("Voice message sent successfully", result);
      if(result?.success){
        setRecTrigger(!recTrigger)
        // dispatch(updateConversation(result.data?.conversation))
        // dispatch(addMessageToConversation({
        //   conversationId: result.data?.conversation?._id,
        //   messages: result.data?.messages
        // }))
        console.log("audio message sent", result.data?.message)
      
      }
      
    } catch (err) {
      console.error("Error sending voice message:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send voice message";
      setLocalError(errorMessage);
    }
  };

  
 
  const sendMediaMessage = async (files: FileList | null) => {
    try {
      // Clear any previous local errors
      setLocalError(null);

      if (!files || files.length === 0) return;

      // Validate required data first
      if (!conversationId || !currentUser?._id) {
        const errorMsg = "Missing required data for sending media message";
        setLocalError(errorMsg);
        return;
      }

      const fileArray = Array.from(files);
      console.log("initiating file array upload");

      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("media", file);
      });

      const result = await sendMessage(formData, conversationId, currentUser._id);
      
      // Check if result is null (error occurred in hook)
      if (!result) {
        // Error is already handled by the hook and will be passed via useEffect
        return;
      }

      // Success case - update store
      console.log("Photo or video message sent successfully", result);
      if(result?.success){
        setRecTrigger(!recTrigger)

        // dispatch(updateConversation(result.data?.conversation))
        // dispatch(addMessageToConversation({
        //   conversationId: result.data?.conversation?._id,
        //   messages: result.data?.messages
        // }))
        // console.log("message sent", result.data?.message)
      
      }

    } catch (err) {
      console.error("Error sending media message:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send media message";
      setLocalError(errorMessage);
    }
  };

    //  useEffect(() => {
    //   if (!ws || !conversationId) return;
  
    //   // safeSend(ws, { type: 'join', conversationId});
    //   // safeSend(ws, { type: "message", coversationId: activeConversation?._id as string, messsage: {message: "ja g le apni zindagi"}})
    //   ws.onmessage = (e) => {
    //     console.log("receving message", e);
    //     const data = JSON.parse(e.data);
    //     console.log(data)
    //     const { conversation, message } = data.message;
    //     if(conversation && message){
    //       dispatch(updateConversation(conversation))
    //       dispatch(addMessageToConversation({
    //         conversationId: conversation?._id as string,
    //         messages: [message]
    //       }))
    //     }
    //   };
    // }, [ws, conversationId, dispatch, recTrigger]);
 
  return (
    <>
      {/* Local Error Popup */}
      {localError && (
        <ErrorPopup 
          heading="Failed to send message!"
          message={localError} 
          onClose={() => setLocalError(null)} 
        />
      )}

      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceNoteRecorder
          open={showVoiceRecorder}
          onClose={() => setShowVoiceRecorder(false)}
          onSend={(audioFile: File) => sendVoiceMessage(audioFile)}
        />
      )}

      {/* Popover Trigger */}
      <Popover>
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
        onChange={(e) => sendMediaMessage(e.target.files)}
      />

      <input
        type="file"
        ref={voiceNoteInputRef}
        className="hidden"
        accept="audio/*"
        onChange={(e) => console.log(e.target.files)}
      />
    </>
  );
}