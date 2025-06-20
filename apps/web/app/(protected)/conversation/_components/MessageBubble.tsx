import { Message } from "@/lib/mockData";
import { IMessage } from "@/types/conversations/message.types";

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`p-3 rounded-xl max-w-xs ${
          isOwn ? "" : "bg-g"
        }`}
      >
        {message?.textContent}
        <div className="text-xs text-right opacity-70 mt-1">
          {"sent at: "}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
