import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { statusLabels, statusStyles } from '@/shared/consts';
import { getCategoryById } from '@/shared/lib/mock-data';
import { User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ticket } from '@/shared/types';

export const TicketsSupportList = ({
  categoryTickets,
}: {
  categoryTickets: Ticket[];
}) => {
  return (
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
  );
};
