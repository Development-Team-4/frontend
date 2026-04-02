import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ticket } from '@/shared/types';
import { Dispatch, SetStateAction } from 'react';

interface TicketsAssignedFiltersProps {
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  assignedTickets: Ticket[];
  activeCount: number;
}
export const TicketsAssignedFilters = ({
  statusFilter,
  setStatusFilter,
  assignedTickets,
  activeCount,
}: TicketsAssignedFiltersProps) => {
  return (
    <>
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
    </>
  );
};
