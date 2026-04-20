'use client';

import Link from 'next/link';
import { ExternalLink, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSelectNotificationChannels } from '@/features/select-notification-channels';

export const NotificationsChannels = () => {
  const {
    emailNotification,
    telegramNotification,
    setEmailNotification,
    setTelegramNotification,
    handleSave,
    canSave,
    isLoading,
    isSaving,
    emailError,
    telegramError,
    serverError,
  } = useSelectNotificationChannels();

  const telegramBotLink =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
    'https://t.me/braverto_ticket_system_bot';

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      toast.success('Настройки уведомлений обновлены');
    }
  };

  return (
    <Card className="mb-4 p-4 sm:mb-6 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-card-foreground">
        Каналы уведомлений
      </h2>

      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-border bg-background p-3">
          <p className="text-sm text-card-foreground">Telegram-бот</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Откройте бота, нажмите Start, скопируйте выданный Telegram ID и
            вставьте его ниже.
          </p>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="mt-3 w-full sm:w-auto"
          >
            <Link href={telegramBotLink} target="_blank" rel="noreferrer">
              <Send className="h-3.5 w-3.5" />
              Открыть бота
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 text-xs" htmlFor="notification-email">
              Email для уведомлений
            </Label>
            <Input
              id="notification-email"
              value={emailNotification}
              onChange={(event) => setEmailNotification(event.target.value)}
              placeholder="user@example.com"
              disabled={isLoading || isSaving}
            />
            {emailError && (
              <p className="mt-1 text-xs text-destructive">{emailError}</p>
            )}
          </div>

          <div>
            <Label
              className="mb-1.5 text-xs"
              htmlFor="notification-telegram-id"
            >
              Telegram ID
            </Label>
            <Input
              id="notification-telegram-id"
              value={telegramNotification}
              onChange={(event) => setTelegramNotification(event.target.value)}
              placeholder="Например: 653949548"
              disabled={isLoading || isSaving}
            />
            {telegramError && (
              <p className="mt-1 text-xs text-destructive">{telegramError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-stretch sm:justify-end">
          <Button
            size="sm"
            className="w-full cursor-pointer sm:w-auto"
            onClick={onSave}
            disabled={!canSave}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить настройки'
            )}
          </Button>
        </div>

        {serverError && (
          <p className="text-xs text-destructive">{serverError}</p>
        )}
      </div>
    </Card>
  );
};
