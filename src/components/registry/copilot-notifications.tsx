"use client";

import { useState, useMemo, useCallback } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  Info,
  X,
  Loader2,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "alert" | "message" | "update" | "reminder";
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  timestamp: string;
  category?: string;
}

type FilterTab = "all" | "unread" | "alerts" | "messages";

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Deployment Failed",
    message: "Production deployment pipeline failed at build step. Immediate attention required.",
    type: "alert",
    priority: "urgent",
    read: false,
    timestamp: "2 minutes ago",
  },
  {
    id: "notif-2",
    title: "New PR Review Request",
    message: "Alex requested your review on PR #472: Refactor auth module.",
    type: "message",
    priority: "high",
    read: false,
    timestamp: "15 minutes ago",
  },
  {
    id: "notif-3",
    title: "System Update Available",
    message: "Version 3.2.1 is available with performance improvements and bug fixes.",
    type: "update",
    priority: "medium",
    read: true,
    timestamp: "1 hour ago",
  },
  {
    id: "notif-4",
    title: "Meeting in 30 minutes",
    message: "Sprint planning meeting starts at 2:00 PM in Room 4B.",
    type: "reminder",
    priority: "medium",
    read: false,
    timestamp: "30 minutes ago",
  },
  {
    id: "notif-5",
    title: "Disk Usage Warning",
    message: "Server disk usage has exceeded 85%. Consider cleaning up old logs.",
    type: "alert",
    priority: "high",
    read: false,
    timestamp: "45 minutes ago",
  },
  {
    id: "notif-6",
    title: "Team message from Alex",
    message: "Hey, can you take a look at the latest design mockups when you get a chance?",
    type: "message",
    priority: "low",
    read: true,
    timestamp: "2 hours ago",
  },
  {
    id: "notif-7",
    title: "Invoice Payment Due",
    message: "Invoice #INV-2024-089 for $2,450.00 is due in 3 days.",
    type: "reminder",
    priority: "high",
    read: false,
    timestamp: "3 hours ago",
  },
  {
    id: "notif-8",
    title: "New Feature Released",
    message: "Dark mode support has been rolled out to all users.",
    type: "update",
    priority: "low",
    read: true,
    timestamp: "5 hours ago",
  },
  {
    id: "notif-9",
    title: "Security Scan Complete",
    message: "Weekly security scan finished. No vulnerabilities detected.",
    type: "alert",
    priority: "medium",
    read: true,
    timestamp: "6 hours ago",
  },
  {
    id: "notif-10",
    title: "Welcome to the team!",
    message: "We're glad to have you on board. Check out the getting started guide.",
    type: "message",
    priority: "low",
    read: true,
    timestamp: "1 day ago",
  },
];

const priorityBorderColors: Record<NotificationItem["priority"], string> = {
  urgent: "border-l-red-500",
  high: "border-l-amber-500",
  medium: "border-l-blue-500",
  low: "border-l-muted",
};

const priorityBadgeColors: Record<NotificationItem["priority"], string> = {
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  low: "bg-muted/50 text-muted-foreground border-border/50",
};

const typeIcons: Record<NotificationItem["type"], React.ReactNode> = {
  alert: <AlertTriangle className="h-4 w-4 text-red-400" />,
  message: <MessageSquare className="h-4 w-4 text-blue-400" />,
  update: <Info className="h-4 w-4 text-emerald-400" />,
  reminder: <Bell className="h-4 w-4 text-amber-400" />,
};

const typeBadgeColors: Record<NotificationItem["type"], string> = {
  alert: "bg-red-500/10 text-red-400 border-red-500/20",
  message: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  update: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  reminder: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface CopilotNotificationsProps {
  initialNotifications?: NotificationItem[];
  className?: string;
}

export function CopilotNotifications({
  initialNotifications = defaultNotifications,
  className,
}: CopilotNotificationsProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "alerts":
        return notifications.filter((n) => n.type === "alert");
      case "messages":
        return notifications.filter((n) => n.type === "message");
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const dismissNotification = useCallback((id: string) => {
    setDismissingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setDismissingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  // Expose notifications state to AI
  useCopilotReadable({
    description:
      "Current notification center state including all notifications with their read status, priority, type, and category",
    value: {
      totalNotifications: notifications.length,
      unreadCount,
      activeFilter: activeTab,
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        priority: n.priority,
        read: n.read,
        timestamp: n.timestamp,
        category: n.category,
      })),
    },
  });

  // AI action: mark notification as read
  useCopilotAction({
    name: "markAsRead",
    description:
      "Mark one or more notifications as read. Provide an array of notification IDs to mark as read, or pass a single ID.",
    parameters: [
      {
        name: "notificationIds",
        type: "string[]",
        description: "Array of notification IDs to mark as read",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Marking as read...</span>
          </div>
        );
      }
      const count = args.notificationIds?.length ?? 0;
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Marked <strong>{count}</strong> notification{count !== 1 ? "s" : ""} as read
          </span>
        </div>
      );
    },
    handler: ({ notificationIds }) => {
      const ids = new Set(notificationIds as string[]);
      setNotifications((prev) =>
        prev.map((n) => (ids.has(n.id) ? { ...n, read: true } : n))
      );
      return `Marked ${ids.size} notification(s) as read`;
    },
  });

  // AI action: dismiss notification
  useCopilotAction({
    name: "dismissNotification",
    description:
      "Dismiss and remove one or more notifications from the list. The notifications will fade out before being removed.",
    parameters: [
      {
        name: "notificationIds",
        type: "string[]",
        description: "Array of notification IDs to dismiss",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-red-400" />
            <span>Dismissing notifications...</span>
          </div>
        );
      }
      const count = args.notificationIds?.length ?? 0;
      return (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Dismissed <strong>{count}</strong> notification{count !== 1 ? "s" : ""}
          </span>
        </div>
      );
    },
    handler: ({ notificationIds }) => {
      for (const id of notificationIds as string[]) {
        dismissNotification(id);
      }
      return `Dismissed ${(notificationIds as string[]).length} notification(s)`;
    },
  });

  // AI action: categorize notifications
  useCopilotAction({
    name: "categorize",
    description:
      "Assign a category label to one or more notifications for organizational purposes",
    parameters: [
      {
        name: "notificationIds",
        type: "string[]",
        description: "Array of notification IDs to categorize",
        required: true,
      },
      {
        name: "category",
        type: "string",
        description: "The category label to assign (e.g., 'work', 'personal', 'infrastructure', 'billing')",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Categorizing notifications...</span>
          </div>
        );
      }
      const count = args.notificationIds?.length ?? 0;
      return (
        <div className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Categorized <strong>{count}</strong> notification{count !== 1 ? "s" : ""} as{" "}
            <strong>{args.category}</strong>
          </span>
        </div>
      );
    },
    handler: ({ notificationIds, category }) => {
      const ids = new Set(notificationIds as string[]);
      setNotifications((prev) =>
        prev.map((n) => (ids.has(n.id) ? { ...n, category } : n))
      );
      return `Categorized ${ids.size} notification(s) as "${category}"`;
    },
  });

  // AI action: prioritize notification
  useCopilotAction({
    name: "prioritize",
    description:
      "Change the priority level of one or more notifications. Valid priorities: low, medium, high, urgent.",
    parameters: [
      {
        name: "notificationIds",
        type: "string[]",
        description: "Array of notification IDs to re-prioritize",
        required: true,
      },
      {
        name: "priority",
        type: "string",
        description: 'The new priority level: "low", "medium", "high", or "urgent"',
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Updating priority...</span>
          </div>
        );
      }
      const count = args.notificationIds?.length ?? 0;
      return (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
          <CheckCircle className="h-4 w-4" />
          <span>
            Set <strong>{count}</strong> notification{count !== 1 ? "s" : ""} to{" "}
            <strong>{args.priority}</strong> priority
          </span>
        </div>
      );
    },
    handler: ({ notificationIds, priority }) => {
      const ids = new Set(notificationIds as string[]);
      const validPriority = priority as NotificationItem["priority"];
      setNotifications((prev) =>
        prev.map((n) =>
          ids.has(n.id) ? { ...n, priority: validPriority } : n
        )
      );
      return `Updated ${ids.size} notification(s) to ${priority} priority`;
    },
  });

  // AI action: summarize all notifications
  useCopilotAction({
    name: "summarizeAll",
    description:
      "Generate a summary of all current notifications. Returns a structured overview of the notification center state for the AI to present to the user.",
    parameters: [],
    render: ({ status }) => {
      if (status === "inProgress") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>Summarizing notifications...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
          <CheckCircle className="h-4 w-4" />
          <span>Notification summary generated</span>
        </div>
      );
    },
    handler: () => {
      const urgentCount = notifications.filter(
        (n) => n.priority === "urgent"
      ).length;
      const highCount = notifications.filter(
        (n) => n.priority === "high"
      ).length;
      const alertCount = notifications.filter(
        (n) => n.type === "alert"
      ).length;
      const messageCount = notifications.filter(
        (n) => n.type === "message"
      ).length;
      const categories = [
        ...new Set(notifications.map((n) => n.category).filter(Boolean)),
      ];

      return JSON.stringify({
        total: notifications.length,
        unread: unreadCount,
        byPriority: { urgent: urgentCount, high: highCount },
        byType: { alerts: alertCount, messages: messageCount },
        categories,
        topUrgent: notifications
          .filter((n) => n.priority === "urgent" || n.priority === "high")
          .map((n) => ({ id: n.id, title: n.title, type: n.type })),
      });
    },
  });

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "alerts",
      label: "Alerts",
      count: notifications.filter((n) => n.type === "alert").length,
    },
    {
      key: "messages",
      label: "Messages",
      count: notifications.filter((n) => n.type === "message").length,
    },
  ];

  return (
    <div className={cn("flex flex-col w-full max-w-xl", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white min-w-[18px]">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border/30">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab.key
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  activeTab === tab.key
                    ? "bg-foreground/10 text-foreground"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Sparkles className="h-8 w-8 mb-2 text-muted-foreground/40" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "relative flex gap-3 border-b border-border/20 border-l-4 px-4 py-3 transition-all duration-300",
                  priorityBorderColors[notification.priority],
                  !notification.read && "bg-muted/20",
                  dismissingIds.has(notification.id) &&
                    "opacity-0 translate-x-4"
                )}
              >
                {/* Type icon */}
                <div className="mt-0.5 shrink-0">{typeIcons[notification.type]}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Unread indicator dot */}
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                      <p
                        className={cn(
                          "text-sm truncate",
                          !notification.read
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground/80"
                        )}
                      >
                        {notification.title}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="shrink-0 rounded p-0.5 text-muted-foreground/40 hover:text-foreground transition-colors"
                      aria-label={`Dismiss ${notification.title}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Badges and timestamp */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Badge
                      className={cn(
                        "text-[10px] font-medium capitalize",
                        priorityBadgeColors[notification.priority]
                      )}
                    >
                      {notification.priority}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-[10px] font-medium capitalize",
                        typeBadgeColors[notification.type]
                      )}
                    >
                      {notification.type}
                    </Badge>
                    {notification.category && (
                      <Badge className="text-[10px] font-medium bg-violet-500/10 text-violet-400 border-violet-500/20">
                        {notification.category}
                      </Badge>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground/60">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 px-4 py-2 text-xs text-muted-foreground">
        <span>
          {filteredNotifications.length} of {notifications.length} notifications
        </span>
        {unreadCount > 0 && (
          <span className="text-blue-400">{unreadCount} unread</span>
        )}
      </div>
    </div>
  );
}
