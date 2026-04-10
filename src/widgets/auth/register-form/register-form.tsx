'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterForm } from '@/features/register';
import Link from 'next/link';

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    isLoading,
    serverError,
  } = useRegisterForm();

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="fullname" className="mb-1.5 text-xs">
            Full Name
          </Label>
          <Input
            id="fullname"
            placeholder="John Doe"
            className="bg-background"
            {...register('fullname')}
          />
          {errors.fullname && (
            <p className="mt-1 text-xs text-red-500">
              {errors.fullname.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="mb-1.5 text-xs">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className="bg-background"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5 text-xs">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            className="bg-background"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-1.5 text-xs">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat password"
            className="bg-background"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>

        {serverError && (
          <p className="text-center text-xs text-destructive">{serverError}</p>
        )}
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-xs text-primary hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </Card>
  );
};
