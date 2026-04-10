'use client';
import { useUpdateUserProfile } from '@/entities/user/model/use-user';
import { getApiFieldErrors, normalizeApiError } from '@/shared/api/errors';
import { useStore } from '@/shared/store/store';
import { useEffect, useState } from 'react';

export const useUpdateProfile = () => {
  const userData = useStore((state) => state.userData);
  const [userName, setUserName] = useState('');
  const [nameError, setNameError] = useState('');
  const [serverError, setServerError] = useState('');
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
    setNameError('');
    setServerError('');

    try {
      await updateUserProfile({
        userId: userData.userId,
        userName: userName.trim(),
      });
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось обновить профиль',
      );
      const fieldErrors = getApiFieldErrors(normalizedError, {
        userName: 'userName',
        name: 'userName',
      });

      if (fieldErrors.userName) {
        setNameError(fieldErrors.userName);
      } else {
        setServerError(normalizedError.message);
      }
    }
  };

  return {
    userData,
    userName,
    setUserName,
    isUpdating,
    canSave,
    handleSave,
    nameError,
    serverError,
  };
};
