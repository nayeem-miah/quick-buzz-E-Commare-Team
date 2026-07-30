import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./UsePublic";
import { NotificationItem } from "../types/notification";

const useNotifications = (email?: string | null) => {
  const axiosPublic = useAxiosPublic();

  const { data: notifications = [], refetch, isLoading } = useQuery<NotificationItem[]>({
    queryKey: ["notifications", email],
    queryFn: async () => {
      const res = await axiosPublic.get("/notifications");
      return res.data.data;
    },
    enabled: !!email,
    refetchInterval: 10000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      await axiosPublic.patch(`/notifications/${id}/read`);
      refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosPublic.patch("/notifications/read-all");
      refetch();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axiosPublic.delete(`/notifications/${id}`);
      refetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

export default useNotifications;
