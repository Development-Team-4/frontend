'use client';

import { useQuery } from '@tanstack/react-query';
import { usersDataApi } from '../api';
import { useStore } from '@/shared/store/store';
import type { User } from '@/shared/types';

export const useUser = () => {
  const updateUserData = useStore((state) => state.updateUserData);

  return useQuery<User>({
    queryKey: ['userData'],
    queryFn: () => usersDataApi.getUserData(),
    select: (data) => {
      // Обновляем store с новыми данными
      updateUserData(data);
      // Возвращаем данные для использования в компонентах
      return data;
    },
    // Кэшировать данные 5 минут
    staleTime: 5 * 60 * 1000,
    // Оставлять данные в кэше 10 минут при неиспользовании
    gcTime: 10 * 60 * 1000,
    // Не перезагружать при фокусе окна (так как данные редко меняются)
    refetchOnWindowFocus: false,
    // Повторять запрос при ошибке максимум 1 раз
    retry: 1,
  });
};
