import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/chat-types";
import { BookOpen, User } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-card border border-border rounded-tl-md shadow-sm"
        }`}
      >
        {isUser ? (
          <div>
            {message.images && message.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {message.images.map((img, i) => (
                  <img key={i} src={img} alt={`Uploaded ${i + 1}`} className="max-w-[200px] max-h-[200px] rounded-lg object-cover" />
                ))}
              </div>
            )}
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        ) : (
          <div className="prose-study text-sm">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
