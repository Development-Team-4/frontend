'use client';

import Link from 'next/link';
import { useCategoryById } from '@/entities/category/model';
import { useUserById } from '@/entities/user/model/use-user';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { statusLabels, statusStyles } from '@/shared/consts';
import { Ticket } from '@/shared/types';

interface RecentTicketItemProps {
  ticket: Ticket;
}

export function RecentTicketItem({ ticket }: RecentTicketItemProps) {
  const { data: category } = useCategoryById(ticket.categoryId);
  const { data: createdByUser } = useUserById(ticket.createdBy?.userId || null);
  const { data: assigneeUser } = useUserById(ticket.assignee?.userId || null);

  const createdByName =
    createdByUser?.userName ||
    ticket.createdBy?.userName ||
    ticket.createdBy?.userId;
  const assigneeName =
    assigneeUser?.userName ||
    ticket.assignee?.userName ||
    ticket.assignee?.userId;

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group flex items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-accent"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            {ticket.id}
          </span>
          {category && (
            <span className="text-[10px] text-muted-foreground">
              {category.name}
            </span>
          )}
        </div>

        <p className="truncate text-sm text-card-foreground transition-colors group-hover:text-primary">
          {ticket.subject}
        </p>

        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(ticket.updatedAt), {
            addSuffix: true,
            locale: ru,
          })}

          {createdByName && (
            <>
              <span>·</span>
              <span className="truncate">Автор: {createdByName}</span>
            </>
          )}

          {assigneeName && (
            <>
              <span>·</span>
              <span className="truncate">Исп.: {assigneeName}</span>
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
}
