'use client';
import { useUpdateUserProfile } from '@/entities/user/model/use-user';
import { useStore } from '@/shared/store/store';
import { useEffect, useState } from 'react';

export const useUpdateProfile = () => {
  const userData = useStore((state) => state.userData);
  const [userName, setUserName] = useState('');
  const { mutateAsync: updateUserProfile, isPending: isUpdating } =
    useUpdateUserProfile();

  useEffect(() => {
    setUserName(userData?.userName || '');
  }, [userData?.userName]);

  const canSave =
    Boolean(userData?.userId) &&
    Boolean(userName.trim()) &&
    userName.trim() !== (userData?.userName || '') &&
    !isUpdating;

  const handleSave = async () => {
    if (!userData?.userId || !canSave) return;
    await updateUserProfile({
      userId: userData.userId,
      userName: userName.trim(),
    });
  };

  return {
    userData,
    userName,
    setUserName,
    isUpdating,
    canSave,
    handleSave,
  };
};
