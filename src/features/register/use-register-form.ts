import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from './model/register.schema';

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

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      console.log('validated data:', data);

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
