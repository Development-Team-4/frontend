'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => router.push('/'), 600);
  };
  return {
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
  };
};
