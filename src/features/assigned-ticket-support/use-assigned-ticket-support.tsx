'use client';
import { currentUser } from '@/shared/lib/mock-data';
import { useStore } from '@/shared/store/store';
import { useMemo, useState } from 'react';

export const useAssignedTicketSupport = () => {
  const tickets = useStore((state) => state.tickets);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const assignedTickets = useMemo(() => {
    let result = tickets.filter((t) => t.assignee?.id === currentUser.id);

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [statusFilter]);

  const activeCount = assignedTickets.filter(
    (t) => t.status === 'IN_WORK' || t.status === 'CREATED',
  ).length;

  return {
    assignedTickets,
    statusFilter,
    setStatusFilter,
    activeCount,
  };
};
