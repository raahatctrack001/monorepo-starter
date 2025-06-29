import { format } from "date-fns";
import { AudioMessage, DocumentMessage, ImageMessage, TextMessage, VideoMessage } from "./messageScreen/MessageComponents";
import { IMessage } from "@/types/conversations/message.types";
import { useAppSelector } from "@/lib/store/hooks";
import { markMessageAsSeen } from "@/lib/services/message.service";
import { useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBox ({message, setPreviewChat}: {message: IMessage, setPreviewChat: (message: IMessage)=>void}){
    const { currentUser } = useAppSelector(state=>state.user);
    const isSender = message?.senderId?.toString() === currentUser?._id;

   
    const status = isSender ? (
    message.seenBy && message.seenBy.length > 0 ? (
        <span className="flex items-center gap-1 text-blue-500">
        <CheckCheck className="w-4 h-4" />
        Seen
        </span>
    ) : message.deliveredTo && message.deliveredTo.length > 0 ? (
        <span className="flex items-center gap-1 text-gray-600">
        <CheckCheck className="w-4 h-4" />
        Delivered
        </span>
    ) : (
        <span className="flex items-center gap-1 text-gray-400">
        <Check className="w-4 h-4" />
        Sent
        </span>
    )
    ) : null;

    useEffect(() => {
        if (!isSender) {
            if (!message.seenBy?.some(id => id.toString() === currentUser?._id.toString())) {
                (async () => {
                    try {
                        const result = await markMessageAsSeen(
                        message.conversationId.toString(),
                        message._id,
                        currentUser?._id as string
                        );
                        console.log("read api response", result);
                    } catch (error) {
                        console.error(error);
                    }
                })();
            }
        }
    }, [message, currentUser, isSender]);

    return (
      <div className={`flex ${isSender ? "justify-end" : "justify-start"}`} key={message._id}>
        <div 
          onClick={() => message.messageType === "image" && setPreviewChat(message)}
          className={`max-w-[75%] ${isSender ? "bg-blue-100" : "bg-gray-100"} rounded-lg p-2 relative cursor-pointer`}
        >
          {(() => {
            switch (message.messageType) {
              case "text":
                return <TextMessage message={message} />;
              case "image":
                return <ImageMessage message={message} />;
              case "video":
                return <VideoMessage message={message} />;
              case "audio":
                return <AudioMessage message={message} />;
              case "document":
                return <DocumentMessage message={message} />;
              default:
                return (
                  <div className="text-gray-500 text-sm">
                    Unsupported message type: {message.messageType}
                  </div>
                );
            }
          })()}

          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <span>{format(new Date(message.sentAt || new Date()), "hh:mm a")}</span>
            {isSender && <span>• {status}</span>}
          </div>
        </div>
      </div>
    );
  };