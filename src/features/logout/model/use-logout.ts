'use client';

import { useMutation } from '@tanstack/react-query';
import { logoutApi } from '../api';
import { useRouter } from 'next/navigation';
import { getJtiFromToken } from '@/shared/lib/jwt-parser';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
} from '@/shared/lib/auth-tokens';

export const useLogout = () => {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => {
      if (typeof window === 'undefined') {
        return logoutApi.logout({ refreshToken: null, accessTokenJti: null });
      }
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();
      const accessTokenJti = accessToken ? getJtiFromToken(accessToken) : null;

      return logoutApi.logout({ refreshToken, accessTokenJti });
    },
    onSuccess: () => {
      clearAuthTokens();
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
