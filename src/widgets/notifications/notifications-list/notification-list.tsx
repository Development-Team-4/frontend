'use client';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationInfo } from '@/features/notification-info';
import { ru } from 'date-fns/locale';

export const NotificationList = () => {
  const { notifications, markRead, typeConfig, isLoading } =
    useNotificationInfo();

  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 text-sm text-muted-foreground">
          Загрузка уведомлений...
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">Нет уведомлений</p>
        </Card>
      ) : (
        notifications.map((n) => {
          const config = typeConfig[n.type];
          return (
            <Card
              key={n.id}
              className={`flex items-start gap-3 p-4 transition-colors ${
                !n.read ? 'border-primary/20 bg-primary/5' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
              >
                <config.icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-card-foreground">
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {n.message}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                      locale: ru,
                    })}
                  </span>
                  <Link
                    href={`/tickets/${n.ticketId}`}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Открыть тикет
                  </Link>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Прочитано
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};
