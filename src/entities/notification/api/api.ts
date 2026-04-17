import { api } from '@/shared/api/client';
import { Notification, NotificationType } from '@/shared/types';

type NotificationBackend = {
  id: string;
  userId: string;
  ticketId: string;
  type: NotificationType;
  title: string;
  message: string;
  read?: boolean;
  sent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateNotificationPayload = {
  userId: string;
  ticketId: string;
  type: NotificationType;
};

const mapNotificationFromBackend = (
  backend: NotificationBackend,
  read = false,
): Notification => ({
  id: backend.id,
  userId: backend.userId,
  ticketId: backend.ticketId,
  type: backend.type,
  title: backend.title,
  message: backend.message,
  sent: backend.sent,
  createdAt: backend.createdAt,
  updatedAt: backend.updatedAt,
  read: backend.read ?? read,
});

class NotificationsDataApi {
  async getNotifications(): Promise<Notification[]> {
    return api
      .get<NotificationBackend[]>('/notifications')
      .then((res) => res.data.map((item) => mapNotificationFromBackend(item)));
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return api
      .get<NotificationBackend[]>(`/notifications/${userId}`)
      .then((res) => res.data.map((item) => mapNotificationFromBackend(item)));
  }

  async createNotification(
    payload: CreateNotificationPayload,
  ): Promise<Notification> {
    return api
      .post<NotificationBackend>('/notifications', payload)
      .then((res) => mapNotificationFromBackend(res.data));
  }

  async deleteUserNotifications(userId: string): Promise<void> {
    await api.delete(`/notifications/${userId}`);
  }

  async deleteUserNotification(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    await api.delete(`/notifications/${userId}/${notificationId}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  }
}

export const notificationsDataApi = new NotificationsDataApi();
