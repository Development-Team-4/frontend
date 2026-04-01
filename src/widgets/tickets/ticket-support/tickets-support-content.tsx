'use client';

import { useTicketFilterSupport } from '@/features/ticket-filter-support';
import { TicketFiltersSupport } from './ticket-filters-support';
import { TicketsSupportList } from './tickets-support-list';

export const SupportTicketsContent = () => {
  const {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    userCategories,
    categoryTickets,
  } = useTicketFilterSupport();

  return (
    <>
      <TicketFiltersSupport
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        userCategories={userCategories}
        categoryTickets={categoryTickets}
      />

      <TicketsSupportList categoryTickets={categoryTickets} />
    </>
  );
};
