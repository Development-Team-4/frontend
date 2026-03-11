'use client';

import { useTicketsFilter } from '@/features/tickets-filter';

export const TicketsFiltersResult = () => {
  const { filtered } = useTicketsFilter();
  return (
    <p className="text-xs text-muted-foreground">
      Найдено: {filtered.length} тикет
      {filtered.length === 1 ? '' : filtered.length < 5 ? 'а' : 'ов'}
    </p>
  );
};
