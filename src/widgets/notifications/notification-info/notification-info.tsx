'use client';

import { Button } from '@/components/ui/button';
import { useNotificationInfo } from '@/features/notification-info';
import { Check, Trash2 } from 'lucide-react';

export const NotificationInfo = () => {
  const {
    unreadCount,
    markAllRead,
    removeAllNotifications,
    canClearAll,
    isDeletingAll,
    isMarkingRead,
  } = useNotificationInfo();

  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Уведомления</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} непрочитанн${unreadCount === 1 ? 'ое' : 'ых'} уведомлени${unreadCount === 1 ? 'е' : 'й'}`
            : 'Все уведомления прочитаны'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {canClearAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAllNotifications}
            className="cursor-pointer"
            disabled={isDeletingAll}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Удалить все
          </Button>
        )}

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="cursor-pointer"
            disabled={isMarkingRead}
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            Отметить все
          </Button>
        )}
      </div>
    </div>
  );
};
