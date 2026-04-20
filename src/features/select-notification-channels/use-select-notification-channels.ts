'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersDataApi } from '@/entities/user/api';
import { normalizeApiError } from '@/shared/api/errors';
import { useStore } from '@/shared/store/store';

const TELEGRAM_ID_REGEX = /^-?\d+$/;
const NOTIFICATION_EMAIL = 'dim.maluckow2017@yandex.ru';

const toDefaultSettings = () => ({
  userEmailNotification: null as null,
  userTelegramNotification: '',
});

export const useSelectNotificationChannels = () => {
  const userData = useStore((state) => state.userData);
  const queryClient = useQueryClient();

  const [telegramNotification, setTelegramNotification] = useState('');
  const [telegramError, setTelegramError] = useState('');
  const [serverError, setServerError] = useState('');

  const settingsQuery = useQuery({
    queryKey: ['notification-settings', userData?.userId],
    enabled: Boolean(userData?.userId),
    queryFn: async () => {
      if (!userData?.userId) {
        return toDefaultSettings();
      }

      try {
        return await usersDataApi.getUserNotificationSettings(userData.userId);
      } catch (error) {
        const normalizedError = normalizeApiError(error);
        if (normalizedError.status === 404) {
          return toDefaultSettings();
        }
        throw normalizedError;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    if (!settingsQuery.data) return;
    setTelegramNotification(settingsQuery.data.userTelegramNotification || '');
  }, [settingsQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!userData?.userId) {
        throw new Error('Пользователь не найден');
      }

      return usersDataApi.updateUserNotificationSettings(userData.userId, {
        userEmailNotification: NOTIFICATION_EMAIL,
        userTelegramNotification: telegramNotification.trim(),
      });
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(
        ['notification-settings', userData?.userId],
        settings,
      );
    },
  });

  const canSave = useMemo(() => {
    if (!userData?.userId || updateMutation.isPending) return false;

    const nextTelegram = telegramNotification.trim();
    const currentTelegram = (
      settingsQuery.data?.userTelegramNotification || ''
    ).trim();

    if (!nextTelegram) return false;
    if (!TELEGRAM_ID_REGEX.test(nextTelegram)) return false;

    return nextTelegram !== currentTelegram;
  }, [
    settingsQuery.data?.userTelegramNotification,
    telegramNotification,
    updateMutation.isPending,
    userData?.userId,
  ]);

  const handleSave = async (): Promise<boolean> => {
    setTelegramError('');
    setServerError('');

    const nextTelegram = telegramNotification.trim();

    if (!nextTelegram) {
      setTelegramError('Введите Telegram ID, который прислал бот');
      return false;
    }

    if (!TELEGRAM_ID_REGEX.test(nextTelegram)) {
      setTelegramError('Telegram ID должен содержать только цифры');
      return false;
    }

    try {
      const updated = await updateMutation.mutateAsync();
      setTelegramNotification(updated.userTelegramNotification);
      return true;
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось обновить настройки уведомлений',
      );
      setServerError(normalizedError.message);
      return false;
    }
  };

  return {
    telegramNotification,
    setTelegramNotification,
    handleSave,
    canSave,
    isLoading: settingsQuery.isLoading,
    isSaving: updateMutation.isPending,
    telegramError,
    serverError,
  };
};
