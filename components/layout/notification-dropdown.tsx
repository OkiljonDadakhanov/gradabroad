"use client";

import { useState } from "react";
import { Bell, CheckCheck, FileText, MessageSquare, Info, Inbox } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useNotifications, Notification } from "@/hooks/useNotifications";

export function NotificationDropdown() {
  const { locale, t } = useI18n();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const getNotificationContent = (notification: Notification) => {
    const translation = notification.translations.find((t) => t.lang === locale)
      || notification.translations.find((t) => t.lang === "en")
      || notification.translations[0];

    if (translation) {
      return { title: translation.title, message: translation.message };
    }

    return {
      title: t("notifications.notification"),
      message: "",
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("notifications.justNow");
    if (diffMins < 60) return `${diffMins}${t("notifications.minutesAgo")}`;
    if (diffHours < 24) return `${diffHours}${t("notifications.hoursAgo")}`;
    if (diffDays < 7) return `${diffDays}${t("notifications.daysAgo")}`;
    return date.toLocaleDateString();
  };

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText size={16} className="text-blue-500" />;
      case "message":
        return <MessageSquare size={16} className="text-green-500" />;
      case "system":
      default:
        return <Info size={16} className="text-purple-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-100";
      case "message":
        return "bg-green-100";
      case "system":
      default:
        return "bg-purple-100";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setDetailOpen(true);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            title={t("header.notifications")}
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 dark:bg-gray-900 dark:border-gray-800" align="end">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("notifications.title")}</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 rounded-full">
                  {unreadCount} {t("notifications.new")}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                <CheckCheck size={14} />
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="h-[350px] dark:bg-gray-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <div className="w-8 h-8 border-2 border-purple-200 dark:border-purple-500/30 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-3" />
                <p className="text-sm">{t("common.loading")}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Inbox size={28} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("notifications.noNotifications")}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t("notifications.checkBackLater")}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => {
                  const content = getNotificationContent(notification);
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200",
                        !notification.is_read && "bg-purple-50/50 dark:bg-purple-500/5 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                          getTypeColor(notification.type)
                        )}>
                          {getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm text-gray-900 dark:text-gray-100 line-clamp-1",
                              !notification.is_read && "font-semibold"
                            )}>
                              {content.title || notification.type}
                            </p>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          {content.message && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {content.message}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t dark:border-gray-800 px-4 py-2 bg-gray-50/50 dark:bg-gray-900">
              <button className="w-full text-center text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-1 transition-colors">
                {t("notifications.viewAll")}
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Notification Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedNotification && (
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  getTypeColor(selectedNotification.type)
                )}>
                  {getTypeIcon(selectedNotification.type)}
                </div>
              )}
              <div>
                <DialogTitle className="text-left dark:text-gray-100">
                  {selectedNotification && getNotificationContent(selectedNotification).title}
                </DialogTitle>
                {selectedNotification && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFullDate(selectedNotification.created_at)}
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedNotification && getNotificationContent(selectedNotification).message}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
