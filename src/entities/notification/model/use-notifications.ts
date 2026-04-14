'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsDataApi, CreateNotificationPayload } from '../api';
import { Notification } from '@/shared/types';
import { useStore } from '@/shared/store/store';
import { useEffect } from 'react';

const mergeNotificationsWithReadState = (
  incoming: Notification[],
  current: Notification[],
) => {
  const readById = new Map(current.map((item) => [item.id, item.read]));

  return [...incoming]
    .map((item) => ({
      ...item,
      read: readById.get(item.id) ?? false,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const useNotifications = () => {
  const userData = useStore((state) => state.userData);
  const setNotifications = useStore((state) => state.setNotifications);

  const query = useQuery<Notification[]>({
    queryKey: ['notifications', userData?.userRole, userData?.userId],
    queryFn: () => {
      if (!userData) return Promise.resolve([]);
      if (userData.userRole === 'ADMIN') {
        return notificationsDataApi.getNotifications();
      }
      return notificationsDataApi.getUserNotifications(userData.userId);
    },
    enabled: Boolean(userData?.userId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.data) return;
    const current = useStore.getState().notifications;
    const merged = mergeNotificationsWithReadState(query.data, current);
    setNotifications(merged);
  }, [query.data, setNotifications]);

  return query;
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) =>
      notificationsDataApi.createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
