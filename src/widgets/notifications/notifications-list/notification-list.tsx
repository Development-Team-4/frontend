'use client';

import { Card } from '@/components/ui/card';
import { Bell, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationInfo } from '@/features/notification-info';
import { ru } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTickets } from '@/entities/ticket/model/use-tickets';

const NOTIFICATIONS_PER_PAGE = 10;

export const NotificationList = () => {
  const {
    notifications,
    markRead,
    removeNotification,
    typeConfig,
    isLoading,
    isDeletingOne,
    isMarkingRead,
  } = useNotificationInfo();
  const { data: tickets = [] } = useTickets();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / NOTIFICATIONS_PER_PAGE),
  );

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * NOTIFICATIONS_PER_PAGE;
    return notifications.slice(start, start + NOTIFICATIONS_PER_PAGE);
  }, [notifications, page]);

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
        paginatedNotifications.map((n) => {
          const config = typeConfig[n.type];
          const ticket = tickets.find((item) => item.id === n.ticketId);
          const title =
            n.type === 'STATUS_CHANGE'
              ? `Статус тикета ${ticket?.subject || n.ticketId} был изменен`
              : n.title;

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
                    {title}
                  </p>
                  {!n.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {n.message}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
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
                      className="cursor-pointer text-[10px] text-muted-foreground hover:text-foreground"
                      disabled={isMarkingRead}
                    >
                      Прочитано
                    </button>
                  )}
                  {n.userId && (
                    <button
                      onClick={() => removeNotification(n.userId!, n.id)}
                      className="inline-flex cursor-pointer items-center gap-1 text-[10px] text-destructive hover:opacity-90"
                      disabled={isDeletingOne}
                    >
                      <Trash2 className="h-3 w-3" />
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })
      )}

      {notifications.length > NOTIFICATIONS_PER_PAGE && (
        <Card className="mt-2 flex items-center justify-between px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Страница {page} из {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              В начало
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              disabled={page === 1}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((currentPage) => Math.min(totalPages, currentPage + 1))
              }
              disabled={page === totalPages}
            >
              Вперед
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              В конец
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
