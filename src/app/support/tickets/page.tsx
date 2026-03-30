'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  tickets,
  currentUser,
  categories,
  getCategoryById,
} from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { statusLabels, statusStyles } from '@/shared/consts';

export default function SupportTicketsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const userCategories = useMemo(() => {
    if (currentUser.role === 'ADMIN') return categories;
    return categories.filter((c) => currentUser.categoryIds?.includes(c.id));
  }, []);

  const categoryTickets = useMemo(() => {
    const categoryIds = userCategories.map((c) => c.id);
    let result = tickets.filter((t) => categoryIds.includes(t.categoryId));

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.categoryId === categoryFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [statusFilter, categoryFilter, userCategories]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Тикеты моих категорий
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Тикеты в категориях, к которым вы назначены
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {userCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        Найдено: {categoryTickets.length} тикет
        {categoryTickets.length === 1
          ? ''
          : categoryTickets.length < 5
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
              <TableHead className="w-[130px]">Исполнитель</TableHead>
              <TableHead className="w-[100px]">Обновлён</TableHead>
              <TableHead className="w-[100px]">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  Тикеты не найдены
                </TableCell>
              </TableRow>
            ) : (
              categoryTickets.map((ticket) => {
                const category = getCategoryById(ticket.categoryId);
                const canTake = !ticket.assignee && ticket.status === 'CREATED';
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
                    <TableCell>
                      {canTake && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          Взять в работу
                        </Button>
                      )}
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
