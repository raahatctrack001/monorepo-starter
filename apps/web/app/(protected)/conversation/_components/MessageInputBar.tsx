"use client";

import { useState } from "react";
import AttachmentMenu from "./inputbar/AttachmentMenu";
import EmojiPicker from "./inputbar/EmojiPicker";
import TextInput from "./inputbar/TextInput";
import SendButton from "./inputbar/SendButton";
import FilePreviewDialog from "./inputbar/FilePreviewDialogue";
import LocalLoader from "@/components/common/LocalLoader";


export default function MessageInputBar({conversationId}: {conversationId: string}) {
  console.log("input bar conversationId", conversationId);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string|null> (null); //error on sending message;

  const handleSend = () => {
    if (message.trim()) {
      console.log("Send message:", message);
      setMessage("");
    }
    if (selectedFile) {
      console.log("Send file:", selectedFile.name);
      setSelectedFile(null);
      setPreviewOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewOpen(true);
    }
  };

  return (
    <>
      <div className="w-full border-t px-4 py-3 flex items-center gap-2 bg-background">
        <AttachmentMenu 
          conversationId={conversationId} 
          onSendMessage={(loading) => setSendingMessage(loading)} 
          onError={(err)=>setError(err)}
        />
        <EmojiPicker onSelect={handleEmojiSelect} />

        <input
          type="file"
          accept="image/*,video/*,.pdf,.doc,.mp4"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <button type="button" title="Upload file" className="text-muted-foreground text-sm">📎</button>
        </label>

        <TextInput
          message={message}
          setMessage={setMessage}
          onKeyPress={handleKeyPress}
        />

        {
          sendingMessage ? 
             <div className="relative">     
                <LocalLoader heading="sending" />         
             </div>: 
            <SendButton onClick={handleSend} disable={message?.trim()?.length === 0} /> 
        }
      </div>

      <FilePreviewDialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile}
        onSend={handleSend}
      />
    </>
  );
}
