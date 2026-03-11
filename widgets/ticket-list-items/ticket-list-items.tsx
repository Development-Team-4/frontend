'use client';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTicketsFilter } from '@/features/tickets-filter';
import { getCategoryById } from '@/lib/mock-data';
import { statusLabels, statusStyles } from '@/shared/consts';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

export const TicketListItems = () => {
  const { toggleSort, SortIcon, filtered } = useTicketsFilter();
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[90px]">ID</TableHead>
            <TableHead>Тема</TableHead>
            <TableHead className="w-[100px]">
              <button
                onClick={() => toggleSort('status')}
                className="flex items-center gap-1"
              >
                Статус
                <SortIcon field="status" />
              </button>
            </TableHead>
            <TableHead className="w-[150px]">Категория</TableHead>
            <TableHead className="w-[130px]">Исполнитель</TableHead>
            <TableHead className="w-[100px]">
              <button
                onClick={() => toggleSort('updatedAt')}
                className="flex items-center gap-1"
              >
                Обновлён
                <SortIcon field="updatedAt" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                Тикеты не найдены
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((ticket) => {
              const category = getCategoryById(ticket.categoryId);
              return (
                <TableRow key={ticket.id} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="hover:text-primary"
                    >
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
                    {ticket.assignee ? (
                      <span className="text-card-foreground">
                        {ticket.assignee.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Не назначен
                      </span>
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
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
