import { Message } from "@/lib/mockData";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`p-3 rounded-xl max-w-xs ${
          isOwn ? "" : "bg-g"
        }`}
      >
        {message.content}
        <div className="text-xs text-right opacity-70 mt-1">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
