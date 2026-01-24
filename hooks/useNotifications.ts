"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWithAuth, API_BASE } from "@/lib/fetchWithAuth";

const WS_BASE = API_BASE.replace(/^http/, "ws");

interface NotificationTranslation {
  id?: number;
  lang: string;
  title: string;
  message: string;
}

export interface Notification {
  id: number;
  type: "system" | "application" | "message" | string;
  is_read: boolean;
  created_at: string;
  translations: NotificationTranslation[];
}

interface UseNotificationsOptions {
  enabled?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  connected: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

// Exponential backoff configuration
const MIN_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function useNotifications({
  enabled = true,
}: UseNotificationsOptions = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef(MIN_RECONNECT_DELAY);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications via REST API
  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;

    try {
      const res = await fetchWithAuth("/api/notifications/");
      if (res.ok) {
        const data = await res.json();
        const notifs: Notification[] = Array.isArray(data)
          ? data
          : data.results || [];

        const newUnreadCount = notifs.filter((n) => !n.is_read).length;
        setNotifications(notifs);
        setUnreadCount(newUnreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = getAccessToken();
    if (!token) {
      console.warn("No access token available for WebSocket connection");
      return;
    }

    const wsUrl = `${WS_BASE}/ws/notifications/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Notifications WebSocket connected");
      setConnected(true);
      // Reset reconnect delay on successful connection
      reconnectDelayRef.current = MIN_RECONNECT_DELAY;
      // Stop polling when WebSocket connects
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "new_notification":
            setNotifications((prev) => {
              // Avoid duplicates
              if (prev.some((n) => n.id === data.notification.id)) {
                return prev;
              }
              return [data.notification, ...prev];
            });
            setUnreadCount((prev) => prev + 1);
            break;

          case "unread_count":
            setUnreadCount(data.count);
            break;

          case "all_marked_read":
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
            break;
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = (event) => {
      console.log("Notifications WebSocket disconnected:", event.code, event.reason);
      setConnected(false);
      wsRef.current = null;

      // Attempt to reconnect with exponential backoff (unless intentionally closed)
      if (enabled && event.code !== 1000) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(
            `Attempting to reconnect WebSocket in ${reconnectDelayRef.current}ms...`
          );
          connectWebSocket();
          // Increase delay with exponential backoff
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * 2,
            MAX_RECONNECT_DELAY
          );
        }, reconnectDelayRef.current);
      }
    };

    ws.onerror = () => {
      // WebSocket errors are typically followed by onclose
      // Start polling fallback when WebSocket fails
      if (!pollingIntervalRef.current && enabled) {
        console.log("Notifications WebSocket unavailable - starting polling fallback");
        pollingIntervalRef.current = setInterval(() => {
          fetchNotifications();
        }, 10000); // Poll every 10 seconds
      }
    };

    wsRef.current = ws;
  }, [enabled]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (id: number) => {
      // Update local state immediately for responsiveness
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Try WebSocket first, fallback to REST API
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "mark_read", notification_id: id })
        );
        return;
      }

      // Fallback to REST API
      try {
        await fetchWithAuth(`/api/notifications/${id}/read/`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        // Revert on failure
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
        );
        setUnreadCount((prev) => prev + 1);
      }
    },
    []
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    // Update local state immediately
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    // Try WebSocket first, fallback to REST API
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "mark_all_read" }));
      return;
    }

    // Fallback to REST API
    try {
      await fetchWithAuth("/api/notifications/read-all/", {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Revert on failure
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
    }
  }, [notifications, unreadCount]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    await fetchNotifications();
  }, [fetchNotifications]);

  // Initialize on mount
  useEffect(() => {
    if (!enabled) return;

    fetchNotifications();
    connectWebSocket();

    // Reconnect on tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Refresh notifications when tab becomes visible
        fetchNotifications();
        // Reconnect WebSocket if disconnected
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          connectWebSocket();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [enabled, fetchNotifications, connectWebSocket]);

  return {
    notifications,
    unreadCount,
    loading,
    connected,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}
