'use client';

import { useMutation } from '@tanstack/react-query';
import { logoutApi } from '../api';
import { useRouter } from 'next/navigation';
import { getJtiFromToken } from '@/shared/lib/jwt-parser';

export const useLogout = () => {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => {
      if (typeof window === 'undefined') {
        return logoutApi.logout({ refreshToken: null, accessTokenJti: null });
      }

      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem('access_token');
      const accessTokenJti = accessToken ? getJtiFromToken(accessToken) : null;

      return logoutApi.logout({ refreshToken, accessTokenJti });
    },
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  return {
    logout: logoutMutation.mutate,
  };
};
