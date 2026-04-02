import { users } from '@/shared/consts';
import { User } from '@/shared/types';

export const useUpdateProfile = () => {
  const currentUser: User = users[0];

  return {
    currentUser,
  };
};
