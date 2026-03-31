'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoginFormData, loginSchema } from './model/login.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useLoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      console.log(data);
      // await login(data)
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push('/');
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
