import { Badge } from '@/components/ui/badge';
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
import { User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ticket } from '@/shared/types';
import { AssignedTicketRow } from './assigned-ticket-row';

export const TicketsAssignedList = ({
  assignedTickets,
}: {
  assignedTickets: Ticket[];
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
            assignedTickets.map((ticket) => (
              <AssignedTicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
