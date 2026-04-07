'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { useCategoryById } from '@/entities/category/model';
import { statusLabels, statusStyles } from '@/shared/consts';
import { Ticket } from '@/shared/types';
import { User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AssignedTicketRowProps {
  ticket: Ticket;
}

export const AssignedTicketRow = ({ ticket }: AssignedTicketRowProps) => {
  const { data: category } = useCategoryById(ticket.categoryId);

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
          {ticket.createdBy.userName}
        </div>
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
