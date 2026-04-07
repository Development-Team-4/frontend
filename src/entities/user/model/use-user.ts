'use client';

import { useQuery } from '@tanstack/react-query';
import { usersDataApi } from '../api';
import { useStore } from '@/shared/store/store';
import type { User } from '@/shared/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useUser = () => {
  const updateUserData = useStore((state) => state.updateUserData);
  const router = useRouter();

  const query = useQuery<User>({
    queryKey: ['userData'],
    queryFn: () => usersDataApi.getUserData(),
    select: (data) => {
      updateUserData(data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch user:', query.error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.push('/login');
    }
  }, [query.error, router]);

  return query;
};

export const useUserById = (userId: string | null) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => usersDataApi.getUserById(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
