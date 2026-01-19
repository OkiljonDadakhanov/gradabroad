"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { format } from "date-fns";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formattedTime = format(new Date(message.created_at), "HH:mm");

  const isImage = message.file_type?.startsWith("image/");
  const hasFile = message.signed_file_url && message.file_name;

  const handleDownload = () => {
    if (message.signed_file_url) {
      window.open(message.signed_file_url, "_blank");
    }
  };

  return (
    <div className="max-w-[75%]">
      {/* Message bubble */}
      <div
        className={cn(
          "inline-block px-3 py-2 rounded-xl shadow-sm",
          isOwn
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
        )}
      >
        {/* Text content with inline time */}
        {message.text && (
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            <span>{message.text}</span>
            <span
              className={cn(
                "inline-block ml-2 text-[10px] whitespace-nowrap align-bottom",
                isOwn ? "text-blue-200" : "text-gray-400 dark:text-gray-500"
              )}
            >
              {formattedTime}
              {isOwn && (
                <svg
                  className="inline-block ml-1"
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {message.is_read ? (
                    <>
                      <path d="M1 5.5L4 8.5L11 1.5" />
                      <path d="M5 5.5L8 8.5L15 1.5" />
                    </>
                  ) : (
                    <path d="M1 5.5L4 8.5L11 1.5" />
                  )}
                </svg>
              )}
            </span>
          </p>
        )}

        {/* File attachment */}
        {hasFile && (
          <div className={cn("", message.text ? "mt-2" : "")}>
            {isImage ? (
              <div className="space-y-1">
                <img
                  src={message.signed_file_url!}
                  alt={message.file_name!}
                  className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90"
                  onClick={handleDownload}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-2 max-w-[220px] h-auto py-2 px-3",
                  isOwn
                    ? "bg-blue-400/30 hover:bg-blue-400/50 text-white"
                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                )}
                onClick={handleDownload}
              >
                <FileText size={16} className="flex-shrink-0" />
                <span className="truncate flex-1 text-left text-xs">{message.file_name}</span>
                <Download size={14} className="flex-shrink-0" />
              </Button>
            )}
            {/* Time for file-only messages */}
            {!message.text && (
              <div
                className={cn(
                  "flex items-center justify-end gap-1 mt-1 text-[10px]",
                  isOwn ? "text-blue-200" : "text-gray-400 dark:text-gray-500"
                )}
              >
                <span>{formattedTime}</span>
                {isOwn && (
                  <svg
                    className="ml-1"
                    width="16"
                    height="11"
                    viewBox="0 0 16 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {message.is_read ? (
                      <>
                        <path d="M1 5.5L4 8.5L11 1.5" />
                        <path d="M5 5.5L8 8.5L15 1.5" />
                      </>
                    ) : (
                      <path d="M1 5.5L4 8.5L11 1.5" />
                    )}
                  </svg>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
