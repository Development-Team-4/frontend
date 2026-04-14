'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/features/login';
import Link from 'next/link';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isLoading,
    serverError,
    onSubmit,
  } = useLoginForm();

  return (
    <Card className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div>
          <Label htmlFor="email" className="mb-1.5 text-xs">
            Электронная почта
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Введите email"
            className="bg-background"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5 text-xs">
            Пароль
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Введите пароль"
            className="bg-background"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>

        {serverError && (
          <p className="text-center text-xs text-destructive">{serverError}</p>
        )}
      </form>

      <div className="mt-4 text-center">
        <Link href="/register" className="text-xs text-primary hover:underline">
          {'Нет аккаунта? Зарегистрироваться'}
        </Link>
      </div>
    </Card>
  );
};
