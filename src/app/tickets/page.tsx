import { TicketsList } from '@/components/tickets-list';

export default function TicketsPage() {
  return (
    <div className="px-3 py-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Тикеты
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Просмотр, фильтрация и управление тикетами
        </p>
      </div>
      <TicketsList />
    </div>
  );
}
