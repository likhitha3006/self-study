import { useRef, useEffect } from "react";
import { Message } from "@/lib/chat-types";
import ChatBubble from "./ChatBubble";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-4">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex gap-3 animate-fade-in-up">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft [animation-delay:0.3s]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft [animation-delay:0.6s]" />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
