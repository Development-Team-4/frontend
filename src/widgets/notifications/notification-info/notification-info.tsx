'use client';

import { Button } from '@/components/ui/button';
import { useNotificationInfo } from '@/features/notification-info';
import { Check } from 'lucide-react';

export const NotificationInfo = () => {
  const { unreadCount, markAllRead } = useNotificationInfo();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Уведомления</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} непрочитанн${unreadCount === 1 ? 'ое' : 'ых'} уведомлени${unreadCount === 1 ? 'е' : 'й'}`
            : 'Все уведомления прочитаны'}
        </p>
      </div>
      {unreadCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={markAllRead}
          className="cursor-pointer"
        >
          <Check className="mr-1 h-3.5 w-3.5" />
          Отметить все
        </Button>
      )}
    </div>
  );
};
