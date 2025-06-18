"use client";
import { useState } from "react";

const MessageInput: React.FC = () => {
  const [text, setText] = useState<string>("");

  const sendMessage = () => {
    if (!text.trim()) return;
    console.log("Send message:", text);
    setText("");
  };

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 outline-none"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
