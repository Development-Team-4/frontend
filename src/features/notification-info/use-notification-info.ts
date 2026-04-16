'use client';
import {
  useDeleteUserNotification,
  useMarkNotificationAsRead,
  useNotifications,
} from '@/entities/notification/model';
import { useStore } from '@/shared/store/store';
import { normalizeApiError } from '@/shared/api/errors';
import { toast } from 'sonner';

export const useNotificationInfo = () => {
  const { isLoading, isFetching } = useNotifications();
  const userData = useStore((state) => state.userData);
  const notifications = useStore((state) => state.notifications);
  const setNotifications = useStore((state) => state.setNotifications);
  const typeConfig = useStore((state) => state.typeConfig);
  const { mutateAsync: markNotificationAsRead, isPending: isMarkingRead } =
    useMarkNotificationAsRead();
  const { mutateAsync: deleteUserNotification, isPending: isDeletingOne } =
    useDeleteUserNotification();

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await Promise.all(unread.map((n) => markNotificationAsRead(n.id)));
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось отметить все уведомления как прочитанные',
      );
      toast.error(normalizedError.message);
    }
  };

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось отметить уведомление как прочитанное',
      );
      toast.error(normalizedError.message);
    }
  };

  const removeNotification = async (userId: string, notificationId: string) => {
    const prev = notifications;
    setNotifications((current) =>
      current.filter((item) => item.id !== notificationId),
    );

    try {
      await deleteUserNotification({ userId, notificationId });
      toast.success('Уведомление удалено');
    } catch (error) {
      setNotifications(prev);
      const normalizedError = normalizeApiError(
        error,
        'Не удалось удалить уведомление',
      );
      toast.error(normalizedError.message);
    }
  };

  const removeAllNotifications = async () => {
    if (notifications.length === 0) return;

    const prev = notifications;
    setNotifications([]);

    try {
      await Promise.all(
        prev.map((item) => {
          if (!item.userId) {
            return Promise.resolve();
          }

          return deleteUserNotification({
            userId: item.userId,
            notificationId: item.id,
          });
        }),
      );
      toast.success('Все уведомления удалены');
    } catch (error) {
      setNotifications(prev);
      const normalizedError = normalizeApiError(
        error,
        'Не удалось удалить уведомления',
      );
      toast.error(normalizedError.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const canClearAll = Boolean(userData?.userId);

  return {
    isLoading: isLoading || isFetching,
    unreadCount,
    canClearAll,
    isDeletingAll: isDeletingOne,
    isDeletingOne,
    isMarkingRead,
    markAllRead,
    markRead,
    removeNotification,
    removeAllNotifications,
    notifications,
    typeConfig,
  };
};
