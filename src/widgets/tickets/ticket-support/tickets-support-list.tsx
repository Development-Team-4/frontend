import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ticket } from '@/shared/types';
import { SupportTicketRow } from './support-ticket-row';

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
            categoryTickets.map((ticket) => (
              <SupportTicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
