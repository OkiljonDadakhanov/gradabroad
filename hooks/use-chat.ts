"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage, ChatThreadStatus, WsIncomingMessage } from "@/types/chat";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_BASE, ENDPOINTS } from "@/lib/constants";

const WS_BASE = API_BASE.replace(/^http/, "ws");

interface UseChatOptions {
  applicationId: number;
  enabled?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  threadStatus: ChatThreadStatus | null;
  typingUsers: Set<number>;
  participantOnline: boolean;
  participantLastSeen: string | null;
  sendMessage: (text: string, file?: File) => Promise<void>;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: () => Promise<void>;
  initiateChat: () => Promise<boolean>;
  refreshMessages: () => Promise<void>;
}

export function useChat({ applicationId, enabled = true }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [threadStatus, setThreadStatus] = useState<ChatThreadStatus | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [participantOnline, setParticipantOnline] = useState(false);
  const [participantLastSeen, setParticipantLastSeen] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!enabled) return;

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
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [applicationId, enabled]);

  // Fetch thread status
  const fetchThreadStatus = useCallback(async () => {
    if (!enabled) return;

    try {
      const res = await fetchWithAuth(ENDPOINTS.CHAT_STATUS(applicationId));
      if (res.ok) {
        const data = await res.json();
        setThreadStatus(data);
      }
    } catch (err) {
      console.error("Error fetching thread status:", err);
    }
  }, [applicationId, enabled]);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token available for WebSocket connection");
      return;
    }

    const wsUrl = `${WS_BASE}/ws/chat/${applicationId}/?token=${token}`;
    console.log("Connecting to WebSocket with token:", token.substring(0, 20) + "...");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected for application", applicationId);
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data: WsIncomingMessage = JSON.parse(event.data);

        switch (data.type) {
          case "new_message":
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === data.message.id)) {
                return prev;
              }
              return [...prev, data.message];
            });
            break;

          case "typing":
            if (data.is_typing) {
              setTypingUsers((prev) => new Set(prev).add(data.user_id));

              // Clear existing timeout for this user
              const existingTimeout = typingTimeoutRef.current.get(data.user_id);
              if (existingTimeout) {
                clearTimeout(existingTimeout);
              }

              // Set new timeout to remove typing indicator after 3 seconds
              const timeout = setTimeout(() => {
                setTypingUsers((prev) => {
                  const next = new Set(prev);
                  next.delete(data.user_id);
                  return next;
                });
              }, 3000);
              typingTimeoutRef.current.set(data.user_id, timeout);
            } else {
              setTypingUsers((prev) => {
                const next = new Set(prev);
                next.delete(data.user_id);
                return next;
              });
            }
            break;

          case "messages_read":
            // Update messages to show as read
            if (data.message_ids && data.message_ids.length > 0) {
              setMessages((prev) =>
                prev.map((msg) =>
                  data.message_ids.includes(msg.id)
                    ? { ...msg, is_read: true }
                    : msg
                )
              );
            }
            break;

          case "error":
            console.error("WebSocket error:", data.message);
            setError(data.message);
            break;

          case "presence_update":
            setParticipantOnline(data.is_online);
            setParticipantLastSeen(data.last_seen);
            break;
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      setConnected(false);
      wsRef.current = null;

      // Attempt to reconnect after 3 seconds (unless intentionally closed)
      if (enabled && event.code !== 1000) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connectWebSocket();
        }, 3000);
      }
    };

    ws.onerror = () => {
      // WebSocket errors are typically followed by onclose, so we don't set error here
      // to avoid showing transient connection issues to users
      console.log("WebSocket connection issue - will retry");
    };

    wsRef.current = ws;
  }, [applicationId, enabled]);

  // Send message via WebSocket or REST API (for files)
  const sendMessage = useCallback(async (text: string, file?: File) => {
    if (!text.trim() && !file) return;

    // Files must be uploaded via REST API
    if (file) {
      const formData = new FormData();
      if (text.trim()) {
        formData.append("text", text.trim());
      }
      formData.append("file", file);

      const res = await fetchWithAuth(ENDPOINTS.CHAT_MESSAGES(applicationId), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.non_field_errors?.[0] || "Failed to send message");
      }

      // If WebSocket is connected, don't add locally - WebSocket will broadcast it
      // This prevents duplicate messages from race conditions
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        const newMessage = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
      return;
    }

    // Text-only messages: prefer WebSocket if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "send_message",
          text: text.trim(),
        })
      );
      return;
    }

    // Fallback to REST API for text-only
    const res = await fetchWithAuth(ENDPOINTS.CHAT_MESSAGES(applicationId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.non_field_errors?.[0] || "Failed to send message");
    }

    const newMessage = await res.json();
    setMessages((prev) => [...prev, newMessage]);
  }, [applicationId]);

  // Send typing indicator via WebSocket
  const sendTyping = useCallback((isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "typing",
          is_typing: isTyping,
        })
      );
    }
  }, []);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "mark_read" }));
      return;
    }

    // Fallback to REST API
    await fetchWithAuth(ENDPOINTS.CHAT_MARK_READ(applicationId), {
      method: "POST",
    });
  }, [applicationId]);

  // Initiate chat (university only)
  const initiateChat = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(ENDPOINTS.CHAT_INITIATE(applicationId), {
        method: "POST",
      });

      if (res.ok) {
        await fetchThreadStatus();
        return true;
      }

      const errorData = await res.json().catch(() => ({}));
      setError(errorData.detail || "Failed to initiate chat");
      return false;
    } catch (err) {
      console.error("Error initiating chat:", err);
      setError("Failed to initiate chat");
      return false;
    }
  }, [applicationId, fetchThreadStatus]);

  // Refresh messages manually
  const refreshMessages = useCallback(async () => {
    setLoading(true);
    await fetchMessages();
  }, [fetchMessages]);

  // Initialize on mount
  useEffect(() => {
    if (!enabled) return;

    fetchMessages();
    fetchThreadStatus();
    connectWebSocket();

    return () => {
      // Cleanup
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      typingTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeoutRef.current.clear();

      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [enabled, fetchMessages, fetchThreadStatus, connectWebSocket]);

  return {
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
  };
}
