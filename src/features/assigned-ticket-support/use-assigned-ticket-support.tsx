'use client';

import { useTickets } from '@/entities/ticket/model';
import { useStore } from '@/shared/store/store';
import { useMemo, useState } from 'react';

export const useAssignedTicketSupport = () => {
  const { data: tickets = [] } = useTickets();
  const userData = useStore((state) => state.userData);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const assignedTickets = useMemo(() => {
    const currentUserId = userData?.userId;
    if (!currentUserId) return [];

    let result = tickets.filter(
      (ticket) => ticket.assignee?.userId === currentUserId,
    );

    if (statusFilter !== 'all') {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [tickets, userData?.userId, statusFilter]);

  const activeCount = assignedTickets.filter(
    (ticket) => ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS',
  ).length;

  return {
    assignedTickets,
    statusFilter,
    setStatusFilter,
    activeCount,
  };
};
