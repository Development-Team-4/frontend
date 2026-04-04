import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from './model/register.schema';
import { regApi } from './api';

export const useRegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      const response = await regApi.registration({
        userName: values.fullname,
        userEmail: values.email,
        userPassword: values.password,
      });

      if (response?.status === 200 || response?.status === 201) {
        localStorage.setItem('access_token', response.data.accessToken);
        localStorage.setItem('refresh_token', response.data.refreshToken);

        router.push('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...form,
    onSubmit,
    isLoading,
  };
};
