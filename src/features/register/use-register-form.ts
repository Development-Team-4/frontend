import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from './model/register.schema';
import { regApi } from './api';
import { getApiFieldErrors, normalizeApiError } from '@/shared/api/errors';
import { setAuthTokens } from '@/shared/lib/auth-tokens';

export const useRegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);
    setServerError('');
    form.clearErrors();

    try {
      const response = await regApi.registration({
        userName: values.fullname,
        userEmail: values.email,
        userPassword: values.password,
      });

      if (response?.status === 200 || response?.status === 201) {
        setAuthTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        router.push('/tickets');
      }
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось зарегистрироваться',
      );

      const fieldErrors = getApiFieldErrors(normalizedError, {
        userName: 'fullname',
        userEmail: 'email',
        userPassword: 'password',
        password: 'password',
        confirmPassword: 'confirmPassword',
      });

      (
        Object.entries(fieldErrors) as Array<[keyof RegisterFormData, string]>
      ).forEach(([field, message]) => {
        if (field in values) {
          form.setError(field, { type: 'server', message });
        }
      });

      if (Object.keys(fieldErrors).length === 0) {
        setServerError(normalizedError.message);
      }

      console.error('Registration error:', normalizedError);
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
