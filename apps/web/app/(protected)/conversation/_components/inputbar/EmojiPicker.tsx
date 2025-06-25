"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Smile size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
          theme="light"
        />
      </PopoverContent>
    </Popover>
  );
}
