"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { format } from "date-fns";
import { User, Building } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formattedTime = format(new Date(message.created_at), "h:mm a");
  const formattedDate = format(new Date(message.created_at), "MMM d");

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isOwn ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isOwn ? "bg-purple-100" : "bg-gray-100"
        )}
      >
        {message.sender_type === "university" ? (
          <Building size={16} className={isOwn ? "text-purple-700" : "text-gray-600"} />
        ) : (
          <User size={16} className={isOwn ? "text-purple-700" : "text-gray-600"} />
        )}
      </div>
      <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl",
            isOwn
              ? "bg-purple-600 text-white rounded-tr-none"
              : "bg-gray-100 text-gray-900 rounded-tl-none"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-400 mt-1">
          {formattedDate} at {formattedTime}
        </span>
      </div>
    </div>
  );
}
