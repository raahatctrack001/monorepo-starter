"use client";

import { Input } from "@/components/ui/input";

interface TextInputProps {
  message: string;
  setMessage: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function TextInput({ message, setMessage, onKeyPress }: TextInputProps) {
  return (
    <Input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={onKeyPress}
      placeholder="Type a message..."
      className="flex-1 rounded-full px-4 h-10"
    />
  );
}
