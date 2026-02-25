import { useState, useCallback, useRef } from "react";
import { Message } from "@/lib/chat-types";
import { streamChat } from "@/lib/stream-chat";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const assistantContentRef = useRef("");

  const handleSend = useCallback(
    async (content: string, images?: string[]) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
        images,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      assistantContentRef.current = "";

      // Build chat history with multimodal content for images
      const chatHistory = [
        ...messages.map((m) => {
          if (m.images && m.images.length > 0) {
            return {
              role: m.role,
              content: [
                ...m.images.map((img) => ({ type: "image_url" as const, image_url: { url: img } })),
                { type: "text" as const, text: m.content || "Analyze this image" },
              ],
            };
          }
          return { role: m.role, content: m.content };
        }),
        images && images.length > 0
          ? {
              role: "user" as const,
              content: [
                ...images.map((img) => ({ type: "image_url" as const, image_url: { url: img } })),
                { type: "text" as const, text: content || "Analyze this image and solve it step by step" },
              ],
            }
          : { role: "user" as const, content },
      ];

      try {
        await streamChat({
          messages: chatHistory,
          onDelta: (chunk) => {
            assistantContentRef.current += chunk;
            const currentContent = assistantContentRef.current;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: currentContent } : m
                );
              }
              return [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: currentContent,
                  timestamp: new Date(),
                },
              ];
            });
          },
          onDone: () => setIsLoading(false),
          onError: (error) => {
            setIsLoading(false);
            toast({ title: "Error", description: error, variant: "destructive" });
          },
        });
      } catch (e) {
        setIsLoading(false);
        toast({
          title: "Connection Error",
          description: "Could not reach the AI. Please try again.",
          variant: "destructive",
        });
      }
    },
    [messages, toast]
  );

  const handleReset = () => setMessages([]);
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">StudyMate AI</h1>
            <p className="text-xs text-muted-foreground">Exam prep assistant</p>
          </div>
        </div>
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            New Chat
          </Button>
        )}
      </header>

      {hasMessages ? (
        <MessageList messages={messages} isLoading={isLoading} />
      ) : (
        <WelcomeScreen onPrompt={handleSend} />
      )}

      <ChatInput onSend={(msg, imgs) => handleSend(msg, imgs)} disabled={isLoading} />
    </div>
  );
};

export default Index;
