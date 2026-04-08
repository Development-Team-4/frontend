'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategoryById } from '@/entities/category/model';
import { useUserById } from '@/entities/user/model/use-user';
import { statusLabels, statusStyles } from '@/shared/consts';
import { Ticket } from '@/shared/types';
import { User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface SupportTicketRowProps {
  ticket: Ticket;
}

export const SupportTicketRow = ({ ticket }: SupportTicketRowProps) => {
  const { data: category } = useCategoryById(ticket.categoryId);
  const { data: createdByUser } = useUserById(ticket.createdBy.userId || null);
  const createdByName =
    createdByUser?.userName ||
    ticket.createdBy.userName ||
    ticket.createdBy.userId;
  const canTake = !ticket.assignee && ticket.status === 'OPEN';

  return (
    <TableRow className="group">
      <TableCell className="font-mono text-xs text-muted-foreground">
        <Link href={`/tickets/${ticket.id}`} className="hover:text-primary">
          {ticket.id}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          href={`/tickets/${ticket.id}`}
          className="text-sm text-card-foreground group-hover:text-primary transition-colors"
        >
          {ticket.subject}
        </Link>
      </TableCell>
      <TableCell>
        <Badge
          className={`border-0 text-[10px] ${statusStyles[ticket.status]}`}
        >
          {statusLabels[ticket.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {category?.name || '—'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {createdByName}
        </div>
      </TableCell>
      <TableCell className="text-xs">
        {ticket.assignee ? (
          <span className="text-card-foreground">
            {ticket.assignee.userName}
          </span>
        ) : (
          <span className="text-muted-foreground italic">Не назначен</span>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(ticket.updatedAt), {
          addSuffix: true,
          locale: ru,
        })}
      </TableCell>
      <TableCell>
        {canTake && (
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Взять в работу
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
