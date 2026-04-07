'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTicketsFilter } from '@/features/tickets-filter';
import { TicketRow } from './ticket-row';

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
            filtered.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
