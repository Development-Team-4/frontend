'use client';
import { useStore } from '@/shared/store/store';

export const useUpdateProfile = () => {
  const userData = useStore((state) => state.userData);

  return {
    userData,
  };
};
