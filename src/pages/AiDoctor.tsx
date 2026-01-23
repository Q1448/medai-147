import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Loader2, Stethoscope, AlertCircle, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-doctor`;

const suggestedQuestions = [
  "What are the symptoms of the flu?",
  "How can I improve my sleep quality?",
  "What should I do for a headache?",
  "When should I see a doctor for a cough?",
];

export default function AiDoctor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your advanced AI medical assistant powered by the latest AI technology. I can provide comprehensive information about:\n\n• **Symptoms & Conditions** - Detailed explanations of medical symptoms\n• **Treatment Options** - General treatment information and home remedies\n• **Medication Info** - How medicines work and their effects\n• **Specialist Guidance** - Which doctor to consult for specific issues\n• **Preventive Care** - Tips for maintaining good health\n\n**Important:** I provide educational information only. For medical emergencies, call 103 immediately. Always consult a healthcare professional for diagnosis and treatment.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        throw new Error("Failed to get response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
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

  return (
    <Layout showFooterDisclaimer>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold mb-6">
            <Brain className="h-4 w-4 text-medical-blue" />
            <span className="text-gradient">Powered by Advanced AI</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI <span className="text-gradient">Doctor</span> Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Get comprehensive health information from our powerful AI medical assistant.
          </p>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-5 border-b border-border bg-gradient-to-r from-primary/5 to-medical-blue/5">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-lg">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-medical-green border-2 border-background pulse-dot" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  AI Doctor
                  <Sparkles className="h-4 w-4 text-primary" />
                </h3>
                <p className="text-sm text-muted-foreground">Online • Ready to help 24/7</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[450px] p-5" ref={scrollRef}>
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-medical-blue/20 text-primary">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed",
                        message.role === "user"
                          ? "bg-gradient-to-br from-primary to-medical-sky text-white rounded-br-md shadow-lg"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-muted text-foreground">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-medical-blue/20 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-5 py-4">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-5 pb-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-5 mb-4 flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Input */}
            <div className="p-5 border-t border-border bg-muted/30">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Ask about symptoms, conditions, treatments, or any health-related questions..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="min-h-[60px] max-h-[120px] resize-none rounded-2xl text-base"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-[60px] w-[60px] shrink-0 gradient-primary text-primary-foreground border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Send className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
