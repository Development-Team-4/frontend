import { useMutation } from '@tanstack/react-query';
import { logoutApi } from '../api';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();
  const refreshToken = localStorage.getItem('refresh_token');
  const accessTokenJti = localStorage.getItem('access_token')?.split('.')[1];
  const logoutMutation = useMutation({
    mutationFn: () => logoutApi.logout({ refreshToken, accessTokenJti }),
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
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
