"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/hooks/use-chat";
import { MessageSquare, AlertCircle, MessageCirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

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
  const {
    messages,
    loading,
    error,
    connected,
    threadStatus,
    typingUsers,
    participantOnline,
    participantLastSeen,
    sendMessage,
    sendTyping,
    markAsRead,
    initiateChat,
    refreshMessages,
  } = useChat({ applicationId });

  // Format last seen time
  const formatLastSeen = (lastSeen: string | null): string => {
    if (!lastSeen) return "a while ago";
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Format date separator
  const formatDateSeparator = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  // Check if we should show date separator before this message
  const shouldShowDateSeparator = (currentIndex: number): boolean => {
    if (currentIndex === 0) return true;
    const currentDate = new Date(messages[currentIndex].created_at);
    const prevDate = new Date(messages[currentIndex - 1].created_at);
    return !isSameDay(currentDate, prevDate);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [stickyDate, setStickyDate] = useState<string | null>(null);
  const [showStickyDate, setShowStickyDate] = useState(false);

  // Handle scroll to show/hide sticky date
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || messages.length === 0) return;

    const container = messagesContainerRef.current;
    const containerTop = container.getBoundingClientRect().top;

    // Find the first visible message
    let visibleDate: string | null = null;
    for (const message of messages) {
      const el = messageRefs.current.get(message.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top >= containerTop - 50) {
          visibleDate = formatDateSeparator(message.created_at);
          break;
        }
      }
    }

    if (visibleDate) {
      setStickyDate(visibleDate);
      setShowStickyDate(true);
    }

    // Hide sticky date after scrolling stops
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setShowStickyDate(false);
    }, 1000);
  }, [messages]);

  // Cleanup scroll timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when component mounts or receives new messages
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages.length, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isOwnMessage = (message: { sender_account_type: string }) => {
    return message.sender_account_type === userType;
  };

  const handleStartChat = async () => {
    const success = await initiateChat();
    if (success) {
      await refreshMessages();
    }
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

  if (error && !messages.length) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <AlertCircle className="h-12 w-12 text-red-300 mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refreshMessages}>Try Again</Button>
      </div>
    );
  }

  // Show "Start Chat" option for university if no thread exists
  const showStartChat = userType === "university" && threadStatus && !threadStatus.exists;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Status header */}
      <div className="px-4 py-2 border-b flex items-center justify-center">
        {typingUsers.size > 0 ? (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </span>
            <span>typing</span>
          </span>
        ) : participantOnline ? (
          <span className="text-sm text-green-600 font-medium">Online</span>
        ) : (
          <span className="text-sm text-gray-500">
            Last seen {formatLastSeen(participantLastSeen)}
          </span>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      >
        {/* Sticky date header */}
        {stickyDate && messages.length > 0 && (
          <div
            className={`sticky top-0 z-10 flex justify-center pointer-events-none transition-opacity duration-300 ${
              showStickyDate ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/90 dark:bg-gray-800/90 rounded-full backdrop-blur-sm shadow-sm">
              {stickyDate}
            </span>
          </div>
        )}

        {showStartChat ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCirclePlus className="h-12 w-12 text-purple-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-1">Start a conversation</h3>
            <p className="text-sm text-gray-500 mb-4">
              Click below to initiate a chat with this applicant
            </p>
            <Button onClick={handleStartChat}>
              <MessageCirclePlus className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-1">No messages yet</h3>
            <p className="text-sm text-gray-500">
              {userType === "student"
                ? "The university will contact you here when they have updates"
                : "Send a message to communicate with the applicant"}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={(el) => {
                  if (el) messageRefs.current.set(message.id, el);
                }}
              >
                {shouldShowDateSeparator(index) && (
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {formatDateSeparator(message.created_at)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"}`}>
                  <MessageBubble
                    message={message}
                    isOwn={isOwnMessage(message)}
                  />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <ChatInput
          onSend={sendMessage}
          onTyping={sendTyping}
          disabled={showStartChat || !!(threadStatus && !threadStatus.can_send)}
          placeholder={
            showStartChat
              ? "Start a chat first..."
              : userType === "student"
              ? "Message the university..."
              : "Message the applicant..."
          }
        />
      </div>
    </div>
  );
}
