'use client';
import { useAssignedTicketSupport } from '@/features/assigned-ticket-support';
import { TicketsAssignedFilters } from './tickets-assigned-filters';
import { TicketsAssignedList } from './tickets-assigned-list';

export const TicketsAssignedContent = () => {
  const { assignedTickets, statusFilter, setStatusFilter, activeCount } =
    useAssignedTicketSupport();
  return (
    <>
      <TicketsAssignedFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assignedTickets={assignedTickets}
        activeCount={activeCount}
      />
      <TicketsAssignedList assignedTickets={assignedTickets} />
    </>
  );
};
