'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterForm } from '@/features/register';
import Link from 'next/link';

export const RegisterForm = () => {
  const {
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    setIsLoading,
  } = useRegisterForm();
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name" className="mb-1.5 text-xs">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background"
          />
        </div>
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
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        </div>

        <div>
          <Label htmlFor="confirm-password" className="mb-1.5 text-xs">
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Min. 8 characters"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-background"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!name || !email || !password || isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-xs text-primary hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </Card>
  );
};
