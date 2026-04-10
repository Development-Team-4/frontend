'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { RecentTicketItem } from './recent-ticket-item';
import { useTickets } from '@/entities/ticket/model';

export function RecentTickets() {
  const { data: tickets = [], isLoading } = useTickets();

  const recent = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-card-foreground">
          Недавние тикеты
        </h3>
        <Link
          href="/tickets"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Все тикеты
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="rounded-md border border-dashed border-border/70 px-3 py-4 text-center text-xs text-muted-foreground">
            Загрузка тикетов...
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-md border border-dashed border-border/70 px-3 py-4 text-center text-xs text-muted-foreground">
            Пока нет недавних тикетов
          </div>
        ) : (
          recent.map((ticket) => (
            <RecentTicketItem key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </Card>
  );
}
