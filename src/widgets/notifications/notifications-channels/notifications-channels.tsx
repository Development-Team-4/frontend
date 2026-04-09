'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useSelectNotificationChannels } from '@/features/select-notification-channels';

export const NotificationsChannels = () => {
  const { setTelegramNotif, emailNotif, setEmailNotif, telegramNotif } =
    useSelectNotificationChannels();

  return (
    <Card className="mb-4 p-4 sm:mb-6 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-card-foreground">
        Каналы уведомлений
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-card-foreground">Email-уведомления</p>
            <p className="text-xs text-muted-foreground">
              Получать уведомления на электронную почту
            </p>
          </div>
          <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
        </div>

        <Separator />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-card-foreground">Telegram-уведомления</p>
            <p className="text-xs text-muted-foreground">
              Получать уведомления через Telegram-бота
            </p>
          </div>
          <Switch checked={telegramNotif} onCheckedChange={setTelegramNotif} />
        </div>
      </div>
    </Card>
  );
};
