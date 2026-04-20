'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersDataApi } from '@/entities/user/api';
import { normalizeApiError } from '@/shared/api/errors';
import { useStore } from '@/shared/store/store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_ID_REGEX = /^-?\d+$/;

const toDefaultSettings = (email: string) => ({
  userEmailNotification: email,
  userTelegramNotification: '',
});

export const useSelectNotificationChannels = () => {
  const userData = useStore((state) => state.userData);
  const queryClient = useQueryClient();

  const [emailNotification, setEmailNotification] = useState('');
  const [telegramNotification, setTelegramNotification] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telegramError, setTelegramError] = useState('');
  const [serverError, setServerError] = useState('');

  const settingsQuery = useQuery({
    queryKey: ['notification-settings', userData?.userId],
    enabled: Boolean(userData?.userId),
    queryFn: async () => {
      if (!userData?.userId) {
        return toDefaultSettings('');
      }

      try {
        return await usersDataApi.getUserNotificationSettings(userData.userId);
      } catch (error) {
        const normalizedError = normalizeApiError(error);
        if (normalizedError.status === 404) {
          return toDefaultSettings(userData.userEmail || '');
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
    setEmailNotification(settingsQuery.data.userEmailNotification || '');
    setTelegramNotification(settingsQuery.data.userTelegramNotification || '');
  }, [settingsQuery.data]);

  useEffect(() => {
    if (!userData?.userEmail) return;
    setEmailNotification((prev) => prev || userData.userEmail);
  }, [userData?.userEmail]);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!userData?.userId) {
        throw new Error('Пользователь не найден');
      }

      return usersDataApi.updateUserNotificationSettings(userData.userId, {
        userEmailNotification: emailNotification.trim(),
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

    const nextEmail = emailNotification.trim();
    const nextTelegram = telegramNotification.trim();
    const currentEmail = (
      settingsQuery.data?.userEmailNotification || ''
    ).trim();
    const currentTelegram = (
      settingsQuery.data?.userTelegramNotification || ''
    ).trim();

    if (!nextEmail || !nextTelegram) return false;
    if (!EMAIL_REGEX.test(nextEmail)) return false;
    if (!TELEGRAM_ID_REGEX.test(nextTelegram)) return false;

    return nextEmail !== currentEmail || nextTelegram !== currentTelegram;
  }, [
    emailNotification,
    settingsQuery.data?.userEmailNotification,
    settingsQuery.data?.userTelegramNotification,
    telegramNotification,
    updateMutation.isPending,
    userData?.userId,
  ]);

  const handleSave = async (): Promise<boolean> => {
    setEmailError('');
    setTelegramError('');
    setServerError('');

    const nextEmail = emailNotification.trim();
    const nextTelegram = telegramNotification.trim();

    if (!nextEmail) {
      setEmailError('Введите email для уведомлений');
      return false;
    }

    if (!EMAIL_REGEX.test(nextEmail)) {
      setEmailError('Введите корректный email');
      return false;
    }

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
      setEmailNotification(updated.userEmailNotification || '');
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
    emailNotification,
    telegramNotification,
    setEmailNotification,
    setTelegramNotification,
    handleSave,
    canSave,
    isLoading: settingsQuery.isLoading,
    isSaving: updateMutation.isPending,
    emailError,
    telegramError,
    serverError,
  };
};
