'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategoryById } from '@/entities/category/model';
import { useUserById } from '@/entities/user/model/use-user';
import { useTicketsFilter } from '@/features/tickets-filter';
import { statusLabels, statusStyles } from '@/shared/consts';
import { Ticket } from '@/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { TicketRow } from './ticket-row';

const MobileTicketCard = ({ ticket }: { ticket: Ticket }) => {
  const { data: category } = useCategoryById(ticket.categoryId);
  const { data: assigneeUser } = useUserById(ticket.assignee?.userId || null);

  const assigneeName =
    assigneeUser?.userName ||
    ticket.assignee?.userName ||
    ticket.assignee?.userId;

  return (
    <Card className="p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <Link
          href={`/tickets/${ticket.id}`}
          className="min-w-0 font-mono text-[11px] text-muted-foreground hover:text-primary"
        >
          <span className="block truncate">{ticket.id}</span>
        </Link>
        <Badge
          className={`shrink-0 border-0 text-[10px] ${statusStyles[ticket.status]}`}
        >
          {statusLabels[ticket.status]}
        </Badge>
      </div>

      <Link
        href={`/tickets/${ticket.id}`}
        className="block text-sm font-medium text-card-foreground transition-colors hover:text-primary"
      >
        {ticket.subject}
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="min-w-0">
          <p className="text-muted-foreground">Категория</p>
          <p className="truncate text-card-foreground">
            {category?.name || '—'}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground">Исполнитель</p>
          <p className="truncate text-card-foreground">
            {assigneeName || (
              <span className="italic text-muted-foreground">Не назначен</span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Обновлён{' '}
        {formatDistanceToNow(new Date(ticket.updatedAt), {
          addSuffix: true,
          locale: ru,
        })}
      </p>
    </Card>
  );
};

export const TicketListItems = () => {
  const { toggleSort, SortIcon, filtered, isLoading } = useTicketsFilter();

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-12" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-48" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-28" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="space-y-2 md:hidden">
        {isLoading ? (
          Array.from({ length: 4 }, (_, index) => (
            <Card key={`mobile-skeleton-${index}`} className="p-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-4 w-4/5" />
              <Skeleton className="mt-3 h-3 w-full" />
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Тикеты не найдены
          </Card>
        ) : (
          filtered.map((ticket) => (
            <MobileTicketCard key={`mobile-${ticket.id}`} ticket={ticket} />
          ))
        )}
      </div>

      <div className="hidden rounded-lg border border-border bg-card md:block">
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
            {isLoading ? (
              renderSkeletonRows()
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  Тикеты не найдены
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
