import { X, FileText, Video, Image as ImageIcon } from "lucide-react";
import { IMessage } from "@/types/conversations/message.types";
import Image from "next/image";
import { useEffect } from "react";

interface MessagePreviewModalProps {
  message: IMessage | null;
  onClose: () => void;
}

export const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({ message, onClose }: MessagePreviewModalProps) => {
  if (!message) return null;

  // Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-opacity-80 flex items-center justify-center p-4">
      <div className="relative  rounded-lg shadow-lg max-w-5xl w-full h-auto grid place-items-center overflow-hidden bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full transition bg-white text-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-4 flex flex-col gap-4 items-center">
          {/* Type-specific previews */}
          {message.messageType === "image" && message.mediaUrl && (
            <div className="relative w-full h-auto">
              <Image
                src={message.mediaUrl}
                alt="Image Preview"
                width={800}
                height={600}
                className="rounded-lg"
              />
            </div>
          )}

          {message.messageType === "video" && message.mediaUrl && (
            <div className="w-full">
              <video controls className="w-full rounded-lg">
                <source src={message.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {message.messageType === "document" && message.mediaUrl && (
            <div className="w-full flex flex-col items-center">
              <FileText className="text-blue-500 mb-2" size={40} />
              <a
                href={message.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-medium"
              >
                View Document
              </a>
            </div>
          )}

          {/* fallback */}
          {!["image", "video", "document"].includes(message.messageType) && (
            <div className="text-gray-500 text-center">
              No preview available for this message type.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
