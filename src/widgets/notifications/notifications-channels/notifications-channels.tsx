'use client';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useSelectNotificationChannels } from '@/features/select-notification-channels';

export const NotificationsChannels = () => {
  const {
    setTelegramNotif,
    slaWarnings,
    setSlaWarnings,
    escalations,
    setEscalations,
    emailNotif,
    setEmailNotif,
    telegramNotif,
  } = useSelectNotificationChannels();
  return (
    <Card className="mb-6 p-6">
      <h2 className="mb-4 text-sm font-medium text-card-foreground">
        Notification Channels
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-card-foreground">Email Notifications</p>
            <p className="text-xs text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-card-foreground">
              Telegram Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              Receive notifications via Telegram bot
            </p>
          </div>
          <Switch checked={telegramNotif} onCheckedChange={setTelegramNotif} />
        </div>
        {/* <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-card-foreground">SLA Warnings</p>
            <p className="text-xs text-muted-foreground">
              Get notified before SLA deadlines
            </p>
          </div>
          <Switch checked={slaWarnings} onCheckedChange={setSlaWarnings} />
        </div>
        <Separator /> */}
        {/* <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-card-foreground">Escalation Alerts</p>
            <p className="text-xs text-muted-foreground">
              Notify when tickets are escalated
            </p>
          </div>
          <Switch checked={escalations} onCheckedChange={setEscalations} />
        </div> */}
      </div>
    </Card>
  );
};
