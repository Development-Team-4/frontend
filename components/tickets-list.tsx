import { TicketsFilters, TicketsFiltersResult } from '@/widgets/ticket-filters';
import { TicketListItems } from '@/widgets/ticket-list-items';

export function TicketsList() {
  return (
    <div className="flex flex-col gap-4">
      <TicketsFilters />
      <TicketsFiltersResult />
      <TicketListItems />
    </div>
  );
}
