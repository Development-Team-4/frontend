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
    isLoading,
    setIsLoading,
  } = useLoginForm();
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          />
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
          />
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
