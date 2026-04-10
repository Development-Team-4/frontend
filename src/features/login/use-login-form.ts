'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoginFormData, loginSchema } from './model/login.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginApi } from './api';
import { usersDataApi } from '@/entities/user/api';
import { getApiFieldErrors, normalizeApiError } from '@/shared/api/errors';

export const useLoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const getRedirectPath = (userRole: string): string => {
    switch (userRole) {
      case 'ADMIN':
        return '/';
      case 'SUPPORT':
        return '/support/tickets';
      case 'USER':
      default:
        return '/tickets';
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError('');
    form.clearErrors();

    try {
      console.log(data);
      const newData = {
        userEmail: data.email,
        userPassword: data.password,
      };

      const response = await loginApi.login(newData);

      if (response?.status === 200 || response?.status === 201) {
        localStorage.setItem('access_token', response.data.accessToken);
        localStorage.setItem('refresh_token', response.data.refreshToken);

        try {
          const userData = await usersDataApi.getUserData();
          const redirectPath = getRedirectPath(userData.userRole);
          router.push(redirectPath);
        } catch (error) {
          console.error(
            'Failed to fetch user data, redirecting to dashboard:',
            error,
          );
          router.push('/tickets');
        }
      }
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось выполнить вход',
      );

      const fieldErrors = getApiFieldErrors(normalizedError, {
        userEmail: 'email',
        userPassword: 'password',
        email: 'email',
        password: 'password',
      });

      (
        Object.entries(fieldErrors) as Array<[keyof LoginFormData, string]>
      ).forEach(([field, message]) => {
        if (field in data) {
          form.setError(field, { type: 'server', message });
        }
      });

      if (Object.keys(fieldErrors).length === 0) {
        setServerError(normalizedError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    onSubmit,
    isLoading,
    serverError,
  };
};
