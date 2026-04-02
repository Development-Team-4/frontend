import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category, Ticket } from '@/shared/types';
import { Dispatch, SetStateAction } from 'react';

interface TicketFiltersProps {
  statusFilter: string;
  categoryFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  userCategories: Category[];
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  categoryTickets: Ticket[];
}

export const TicketFiltersSupport = ({
  statusFilter,
  categoryFilter,
  setStatusFilter,
  userCategories,
  setCategoryFilter,
  categoryTickets,
}: TicketFiltersProps) => {
  return (
    <>
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
    </>
  );
};
