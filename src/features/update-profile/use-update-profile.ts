'use client';
import { users } from '@/shared/consts';
import { useStore } from '@/shared/store/store';
import { User } from '@/shared/types';

export const useUpdateProfile = () => {
  const currentUser: User = users[0];
  const userData = useStore((state) => state.userData);

  return {
    currentUser,
    userData,
  };
};
