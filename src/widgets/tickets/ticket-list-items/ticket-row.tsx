'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategoryById } from '@/entities/category/model';
import { useUserById } from '@/entities/user/model/use-user';
import { statusLabels, statusStyles } from '@/shared/consts';
import { Ticket } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

interface TicketRowProps {
  ticket: Ticket;
}

export const TicketRow = ({ ticket }: TicketRowProps) => {
  const { data: category } = useCategoryById(ticket.categoryId);
  const { data: assigneeUser } = useUserById(ticket.assignee?.userId || null);
  const assigneeName =
    assigneeUser?.userName ||
    ticket.assignee?.userName ||
    ticket.assignee?.userId;

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
      <TableCell className="text-xs">
        {assigneeName ? (
          <span className="text-card-foreground">{assigneeName}</span>
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
    </TableRow>
  );
};
