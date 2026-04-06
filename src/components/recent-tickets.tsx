'use client';

import Link from 'next/link';
import { getCategoryById } from '@/shared/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Clock, ArrowUpRight } from 'lucide-react';
import { statusLabels, statusStyles, tickets } from '@/shared/consts';

export function RecentTickets() {
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
        {recent.map((ticket) => {
          const category = getCategoryById(ticket.categoryId);
          return (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group flex items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-accent"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {ticket.id}
                  </span>
                  {category && (
                    <span className="text-[10px] text-muted-foreground">
                      {category.name}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-card-foreground group-hover:text-primary transition-colors">
                  {ticket.subject}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(ticket.updatedAt), {
                    addSuffix: true,
                    locale: ru,
                  })}
                  {ticket.assignee && (
                    <>
                      <span>{'·'}</span>
                      <span>{ticket.assignee.userName}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                <Badge
                  className={`border-0 text-[10px] ${statusStyles[ticket.status]}`}
                >
                  {statusLabels[ticket.status]}
                </Badge>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
