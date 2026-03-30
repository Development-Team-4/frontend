'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema } from './model/login.schema';

type LoginErrors = {
  email?: string;
  password?: string;
};

export const useLoginForm = () => {
  const router = useRouter();

  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const setEmail = (value: string) => {
    setEmailState(value);
    setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const setPassword = (value: string) => {
    setPasswordState(value);
    setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const nextErrors: LoginErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === 'email' || field === 'password') {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // await login(result.data)
      setTimeout(() => router.push('/'), 600);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
  };
};
