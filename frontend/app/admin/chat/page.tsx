"use client";

import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
/*
import { ScrollArea } from "@/components/ui/scroll-area";
*/
import { cn } from "@/lib/utils";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || "Maaf, terjadi kesalahan dalam memproses pesan Anda.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ Terjadi kesalahan saat menghubungi AI Assistant. Pastikan backend sedang berjalan.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden p-6">
        <div className="h-full flex flex-col max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="h-8 w-8" />
                Admin Assistant
              </h1>
              <p className="text-muted-foreground">
                Bantu admin dalam monitoring dan analisa anomaly transaksi tiket
              </p>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              🟢 Online
            </Badge>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chat dengan Admin Assistant
              </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Belum ada pesan. Mulai percakapan dengan AI assistant!
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>💡 Contoh pertanyaan: Berapa banyak transakasi anomali hari ini?</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 max-w-4xl",
                        message.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-3"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg px-4 py-2 max-w-[80%]",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI sedang berpikir...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollAreaRef} />
              </div>
            </div>

            {/* Input Area */}
            <CardContent className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pertanyaan Anda tentang anomaly monitoring..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
