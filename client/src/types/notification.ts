export interface NotificationItem {
  _id: string;
  recipientEmail: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
