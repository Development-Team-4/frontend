import { LoginForm } from '@/widgets/auth/login-form';
import { SiteLogo } from '@/components/ui/site-logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <SiteLogo className="mx-auto mb-4 h-16 w-16 rounded-xl" />
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
