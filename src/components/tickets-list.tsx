import {
  TicketsFilters,
  TicketsFiltersResult,
} from '@/widgets/tickets/ticket-filters';
import { TicketListItems } from '@/widgets/tickets/ticket-list-items';

export function TicketsList() {
  return (
    <div className="flex flex-col gap-4">
      <TicketsFilters />
      <TicketsFiltersResult />
      <TicketListItems />
    </div>
  );
}
