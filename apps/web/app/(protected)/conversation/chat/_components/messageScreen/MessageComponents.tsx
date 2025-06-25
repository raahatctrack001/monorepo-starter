import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, MessageCircle, Music, PlayCircle } from "lucide-react";
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
export const AudioMessage: React.FC<MessageProps> = ({ message }) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <Card className="max-w-md w-full shadow-sm p-4 flex items-center gap-3 bg-gray-100 border-none">
      <Music className="text-green-600 flex-shrink-0" />

      {/* {showControls ? ( */}
        <audio
          controls
          // autoPlay
          // className="w-full appearance-none [&::-webkit-media-controls-panel]:bg-transparent [&::-webkit-media-controls-enclosure]:rounded-lg"
        >
          <source src={message.mediaUrl!} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      {/* ) : ( */}
        <button
          onClick={() => setShowControls(true)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <PlayCircle size={28} />
          <span className="text-sm font-medium">Play Audio</span>
        </button>
      {/* )} */}
    </Card>
  );
};

// Document Message Component
export const DocumentMessage: React.FC<MessageProps> = ({ message }) => (
  <Card className="max-w-md w-full flex items-center justify-between p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <FileText className="" />
      <div>
        <p className="font-medium ">{message.fileDetail?.originalname}</p>
        <p className="text-sm">
          {(Number(message.fileDetail?.size) / (1024 * 1024)) > 1 ? 
            `${(Number(message.fileDetail?.size) / (1024 * 1024)).toFixed(2)} MB` : 
            `${(Number(message.fileDetail?.size) / 1024).toFixed(2)} KB`
          }
      </p>
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