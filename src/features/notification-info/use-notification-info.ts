'use client';
import { useStore } from '@/shared/store/store';

export const useNotificationInfo = () => {
  const notifications = useStore((state) => state.notifications);
  const setNotifications = useStore((state) => state.setNotifications);
  const typeConfig = useStore((state) => state.typeConfig);
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  return {
    unreadCount,
    markAllRead,
    markRead,
    notifications,
    typeConfig,
  };
};
