'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/features/login';
import Link from 'next/link';

export const LoginForm = () => {
  const {
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
  } = useLoginForm();

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <Label htmlFor="email" className="mb-1.5 text-xs">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5 text-xs">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!email || !password || isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/register" className="text-xs text-primary hover:underline">
          {"Don't have an account? Register"}
        </Link>
      </div>
    </Card>
  );
};
