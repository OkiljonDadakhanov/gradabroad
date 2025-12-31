"use client";

import { useState, useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ENDPOINTS } from "@/lib/constants";
import { ChatMessage } from "@/types/chat";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatContainerProps {
  applicationId: number;
  userType: "student" | "university";
  className?: string;
}

export function ChatContainer({
  applicationId,
  userType,
  className = "",
}: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMessages();

    // Poll for new messages every 5 seconds
    pollingRef.current = setInterval(fetchMessages, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [applicationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchMessages() {
    try {
      const res = await fetchWithAuth(ENDPOINTS.CHAT_MESSAGES(applicationId));
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : data.results || []);
        setError(null);
      } else if (res.status === 404) {
        setMessages([]);
        setError(null);
      } else {
        setError("Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      if (!messages.length) {
        setError("Failed to load messages");
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(content: string) {
    try {
      const res = await fetchWithAuth(ENDPOINTS.CHAT_MESSAGES(applicationId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  }

  const isOwnMessage = (message: ChatMessage) => {
    return message.sender_type === userType;
  };

  if (loading) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-16 w-48 rounded-2xl" />
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <AlertCircle className="h-12 w-12 text-red-300 mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => fetchMessages()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-1">No messages yet</h3>
            <p className="text-sm text-gray-500">
              {userType === "student"
                ? "Send a message to start the conversation with the university"
                : "Send a message to communicate with the applicant"}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwnMessage(message)}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <ChatInput
          onSend={sendMessage}
          placeholder={
            userType === "student"
              ? "Message the university..."
              : "Message the applicant..."
          }
        />
      </div>
    </div>
  );
}
