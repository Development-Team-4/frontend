'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { currentUser, getCategoryById } from '@/shared/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { statusLabels, statusStyles, tickets } from '@/shared/consts';

export default function AssignedTicketsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const assignedTickets = useMemo(() => {
    let result = tickets.filter((t) => t.assignee?.id === currentUser.id);

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [statusFilter]);

  const activeCount = assignedTickets.filter(
    (t) => t.status === 'IN_WORK' || t.status === 'CREATED',
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Мои назначенные тикеты
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Тикеты, назначенные на вас. Активных: {activeCount}
        </p>
      </div>

      <div className="mb-4 flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-card">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="CREATED">Создан</SelectItem>
            <SelectItem value="IN_WORK">В работе</SelectItem>
            <SelectItem value="RESOLVED">Решён</SelectItem>
            <SelectItem value="CLOSED">Закрыт</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        Найдено: {assignedTickets.length} тикет
        {assignedTickets.length === 1
          ? ''
          : assignedTickets.length < 5
            ? 'а'
            : 'ов'}
      </p>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>Тема</TableHead>
              <TableHead className="w-[100px]">Статус</TableHead>
              <TableHead className="w-[150px]">Категория</TableHead>
              <TableHead className="w-[130px]">Автор</TableHead>
              <TableHead className="w-[100px]">Обновлён</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedTickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  У вас нет назначенных тикетов
                </TableCell>
              </TableRow>
            ) : (
              assignedTickets.map((ticket) => {
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
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {ticket.createdBy.name}
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
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
