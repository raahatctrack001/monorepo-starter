import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, MessageCircle, Music } from "lucide-react";
import { IMessage } from "@/types/conversations/message.types";

interface MessageProps {
  message: IMessage;
}

// Text Message Component
export const TextMessage: React.FC<MessageProps> = ({ message }) => (
  <Card className="max-w-md w-full shadow-sm border border-gray-200">
    <CardContent>
      <p className="text-base whitespace-pre-wrap">{message.textContent}</p>
    </CardContent>
  </Card>
);

// Image Message Component
export const ImageMessage: React.FC<MessageProps> = ({ message }) => (
  <Card className="max-w-xs w-full shadow-sm overflow-hidden">
    <Image
      src={message.mediaUrl!}
      alt="Image Message"
      width={300}
      height={300}
      className="object-cover w-full h-auto"
    />
  </Card>
);

// Video Message Component
export const VideoMessage: React.FC<MessageProps> = ({ message }) => (
  <Card className="max-w-md w-full shadow-sm">
    <video controls className="w-full rounded">
      <source src={message.mediaUrl!} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </Card>
);

// Audio Message Component
export const AudioMessage: React.FC<MessageProps> = ({ message }) => (
  <Card className="max-w-md w-full shadow-sm p-4 flex items-center gap-3">
    <Music className="text-green-600" />
    <audio controls className="w-full">
      <source src={message.mediaUrl!} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </Card>
);

// Document Message Component
export const DocumentMessage: React.FC<MessageProps> = ({ message }) => (
  <Card className="max-w-md w-full flex items-center justify-between p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <FileText className="" />
      <div>
        <p className="font-medium ">{message.fileDetail?.originalname}</p>
        <p className="text-sm ">{(Number(message.fileDetail?.size) / 1024).toFixed(2)} KB</p>
      </div>
    </div>
    <Button variant="outline" size="icon">
      <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer">
        <Download className="h-4 w-4" />
      </a>
    </Button>
  </Card>
);

// Placeholder for future extensions (Poll, Sticker, CallLog, etc)
// export const PollMessage = () => {};
// export const StickerMessage = () => {};
// export const CallLogMessage = () => {};