import { IUser } from "@/types/user/user.types";
import { useAppSelector } from "@/lib/store/hooks";
import { IMessage } from "@/types/conversations/message.types";
import { useEffect, useState } from "react";
import { useGetMessageByConversation } from "@/hooks/conversation/message/useGetMessageByConversation";
import { IConversation } from "@/types/conversations/conversation.types";
import RedAlert from "@/components/common/RedAlert";
import GlobalLoader from "@/components/common/GlobalLoader";
import {
  TextMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  DocumentMessage,
} from "./messageScreen/MessageComponents";
import { format, isSameDay } from "date-fns";

interface Props {
  activeConversation: IConversation | null;
}

const ChatWindow: React.FC<Props> = ({ activeConversation }: Props) => {
  const { currentUser } = useAppSelector((state) => state.user);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { getAllMessageByConversation, loading, error } = useGetMessageByConversation();

  useEffect(() => {
    (async () => {
      if (!activeConversation || !currentUser?._id) return;
      const result = await getAllMessageByConversation(activeConversation._id, currentUser._id);
      if (result?.success) {
        setMessages(result.data);
      } else {
        setMessages([]);
      }
    })();
  }, [activeConversation, currentUser]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start conversation.
      </div>
    );
  }

  if (error || loading) {
    return (
      <div className="w-full h-full flex justify-center items-center mx-auto">
        <div className="max-w-md">
          {error && (
            <RedAlert
              heading="No Message Found!"
              description={error + " Please start a conversation to display messages."}
            />
          )}
          {loading && (
            <GlobalLoader
              heading="Loading Conversation"
              description={"Please wait while we load your messages."}
            />
          )}
        </div>
      </div>
    );
  }

  const renderMessage = (message: IMessage) => {
    const isSender = message.senderId.toString() === currentUser?._id;

    const status = isSender
      ? message.seenBy && message.seenBy.length > 0
        ? "Seen"
        : message.deliveredTo && message.deliveredTo.length > 0
        ? "Delivered"
        : "Sent"
      : "";

    return (
      <div className={`flex ${isSender ? "justify-end" : "justify-start"}`} key={message._id}>
        <div className={`max-w-[75%] ${isSender ? "bg-blue-100" : "bg-gray-100"} rounded-lg p-2 relative`}>
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

  let lastMessageDate: string | null = null;

  return (
    <div className="flex flex-col flex-1 h-screen max-h-3/4">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => {
          const messageDate = format(new Date(message.sentAt || new Date()), "yyyy-MM-dd");
          const showDateSeparator = messageDate !== lastMessageDate;
          lastMessageDate = messageDate;

          return (
            <div key={message._id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="text-gray-500 text-xs px-3 py-1 bg-gray-200 rounded-full">
                    {format(new Date(message.sentAt || new Date()), "do MMM yyyy")}
                  </div>
                </div>
              )}
              {renderMessage(message)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatWindow;