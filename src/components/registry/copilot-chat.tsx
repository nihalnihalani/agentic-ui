"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Send,
  Trash2,
  Search,
  FileText,
  Loader2,
  MessageSquare,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isHighlighted?: boolean;
}

interface CopilotChatProps {
  initialMessages?: ChatMessage[];
  className?: string;
}

const defaultMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "You",
    content:
      "Hey Alex, how's everything looking for the project launch next week?",
    timestamp: "10:02 AM",
  },
  {
    id: "msg-2",
    sender: "Alex",
    content:
      "Pretty good! The design assets are finalized and the dev team merged the last feature branch yesterday.",
    timestamp: "10:04 AM",
  },
  {
    id: "msg-3",
    sender: "You",
    content:
      "Nice. Did QA finish the regression tests yet?",
    timestamp: "10:05 AM",
  },
  {
    id: "msg-4",
    sender: "Alex",
    content:
      "Almost \u2014 they found two minor bugs in the checkout flow. Fixes are in review right now, should be merged by EOD.",
    timestamp: "10:07 AM",
  },
  {
    id: "msg-5",
    sender: "You",
    content:
      "Great. Let's sync tomorrow morning to go over the launch checklist one more time.",
    timestamp: "10:09 AM",
  },
  {
    id: "msg-6",
    sender: "Alex",
    content:
      "Sounds good! I'll prepare the final deployment runbook and share it before the meeting.",
    timestamp: "10:11 AM",
  },
];

export function CopilotChat({ initialMessages, className }: CopilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages ?? defaultMessages
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = useCallback(
    (sender: string, content: string) => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const timestamp = `${displayHours}:${minutes} ${ampm}`;

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender,
        content,
        timestamp,
      };
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    []
  );

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    addMessage("You", text);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Expose message history to AI
  useCopilotReadable({
    description:
      "The current chat message history including sender names, message content, and timestamps",
    value: {
      totalMessages: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp,
        isHighlighted: m.isHighlighted ?? false,
      })),
    },
  });

  // Action: Send a message on behalf of a participant
  useCopilotAction({
    name: "sendMessage",
    description:
      "Send a new chat message. Use sender 'You' for the user or another name like 'Alex' for other participants.",
    parameters: [
      {
        name: "sender",
        type: "string",
        description: "The name of the message sender (e.g. 'You' or 'Alex')",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "The message text to send",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Sending message...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <MessageSquare className="h-4 w-4" />
          <span>
            Message sent as <strong>{args.sender}</strong>
          </span>
        </div>
      );
    },
    handler: ({ sender, content }) => {
      setIsTyping(true);
      setTimeout(() => {
        addMessage(sender, content);
        setIsTyping(false);
      }, 600);
      return `Message sent from ${sender}: "${content}"`;
    },
  });

  // Action: Clear all messages
  useCopilotAction({
    name: "clearHistory",
    description: "Clear all chat messages and reset the conversation history",
    parameters: [],
    render: ({ status }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
            <span>Clearing history...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <Trash2 className="h-4 w-4" />
          <span>Chat history cleared</span>
        </div>
      );
    },
    handler: () => {
      setMessages([]);
      return "Chat history has been cleared";
    },
  });

  // Action: Search messages and highlight matches
  useCopilotAction({
    name: "searchMessages",
    description:
      "Search through chat messages for a keyword or phrase. Matching messages will be highlighted with a glow effect.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The search term to look for in message content",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>
              Searching for &quot;{args.query}&quot;...
            </span>
          </div>
        );
      }
      const matchCount = messages.filter((m) => m.isHighlighted).length;
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <Search className="h-4 w-4" />
          <span>
            Found <strong>{matchCount}</strong> message(s) matching &quot;
            {args.query}&quot;
          </span>
        </div>
      );
    },
    handler: ({ query }) => {
      const lowerQuery = query.toLowerCase();
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isHighlighted: msg.content.toLowerCase().includes(lowerQuery),
        }))
      );
      const matchCount = messages.filter((m) =>
        m.content.toLowerCase().includes(lowerQuery)
      ).length;
      return `Found ${matchCount} message(s) matching "${query}"`;
    },
  });

  // Action: Summarize the conversation
  useCopilotAction({
    name: "summarizeConversation",
    description:
      "Generate a brief summary of the current conversation and add it as a system message in the chat",
    parameters: [
      {
        name: "summary",
        type: "string",
        description: "A concise summary of the conversation so far",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Summarizing conversation...</span>
          </div>
        );
      }
      return (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4" />
            <strong>Conversation Summary</strong>
          </div>
          <p className="text-xs text-emerald-400/80">{args.summary}</p>
        </div>
      );
    },
    handler: ({ summary }) => {
      addMessage("System", summary);
      return `Summary added to chat: "${summary}"`;
    },
  });

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-foreground">Chat</h3>
          <span className="text-xs text-muted-foreground">
            {messages.length} messages
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[500px]">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map((msg) => {
          const isYou = msg.sender === "You";
          const isSystem = msg.sender === "System";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg border border-border/30 bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground italic",
                    msg.isHighlighted &&
                      "border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  )}
                >
                  <p>{msg.content}</p>
                  <span className="mt-1 block text-[10px] text-muted-foreground/50">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={cn("flex", isYou ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2.5 transition-all duration-300",
                  isYou
                    ? "bg-violet-600 text-white rounded-br-md"
                    : "bg-muted/60 text-foreground rounded-bl-md border border-border/30",
                  msg.isHighlighted &&
                    "shadow-[0_0_16px_rgba(245,158,11,0.4)] ring-2 ring-amber-500/50"
                )}
              >
                {!isYou && (
                  <span className="mb-0.5 block text-[11px] font-semibold text-muted-foreground">
                    {msg.sender}
                  </span>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span
                  className={cn(
                    "mt-1 block text-right text-[10px]",
                    isYou
                      ? "text-white/60"
                      : "text-muted-foreground/50"
                  )}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted/60 border border-border/30 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            size="icon"
            className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
