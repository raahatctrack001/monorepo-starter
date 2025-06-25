"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SendButtonProps {
    onClick: () => void;
    disable: boolean
}

export default function SendButton({ onClick, disable }: SendButtonProps) {
  return (
    <Button
      variant="default"
      size="icon"
      className="rounded-full"
      onClick={onClick}
      disabled={disable}
    >
      <Send size={18} />
    </Button>
  );
}
