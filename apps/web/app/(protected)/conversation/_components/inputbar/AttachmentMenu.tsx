"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Paperclip, Image, Mic, MapPin, BarChart3, Contact, PhoneCall, Calendar } from "lucide-react";

export default function AttachmentMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Paperclip size={18} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2 flex flex-col gap-1">
        {[
          { label: "Media", icon: Image },
          { label: "Voice Note", icon: Mic },
          { label: "Location", icon: MapPin },
          { label: "Poll", icon: BarChart3 },
          { label: "Contact", icon: Contact },
          { label: "Call Log", icon: PhoneCall },
          { label: "Event", icon: Calendar },
        ].map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="flex items-center gap-2 w-full justify-start text-sm"
          >
            <item.icon size={18} />
            {item.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
