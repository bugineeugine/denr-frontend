export type AppNotificationType = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  severity: "info" | "success" | "warning" | "critical";
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationListResponse = {
  message: string;
  data: {
    notifications: AppNotificationType[];
    unreadCount: number;
  };
};
