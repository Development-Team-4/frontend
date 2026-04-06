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
      updateUserData(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
