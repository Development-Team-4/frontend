import { Shield } from 'lucide-react';
import { LoginForm } from '@/widgets/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">TicketFlow</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Войдите в свой аккаунт
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
