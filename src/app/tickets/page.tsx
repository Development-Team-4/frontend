import { TicketsList } from '@/components/tickets-list';

export default function TicketsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Тикеты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Просмотр, фильтрация и управление тикетами
        </p>
      </div>
      <TicketsList />
    </div>
  );
}
