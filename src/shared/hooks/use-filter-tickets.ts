import { tickets as mockTickets } from '@/shared/consts';
import { useMemo } from 'react';
import type { Ticket } from '@/shared/types';

interface FilterOptions {
  search?: string;
  statusFilter?: string;
  topicFilter?: string;
  categoryFilter?: string;
  categories?: Array<{ id: string; topicId: string }>;
  tickets?: Ticket[];
}

export const useFilterTickets = ({
  search = '',
  statusFilter = 'all',
  topicFilter = 'all',
  categoryFilter = 'all',
  categories = [],
  tickets: externalTickets,
}: FilterOptions) => {
  return useMemo(() => {
    let result = [...(externalTickets || mockTickets)];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (topicFilter !== 'all') {
      const categoryIdsInTopic = categories
        .filter((c) => c.topicId === topicFilter)
        .map((c) => c.id);
      result = result.filter((t) => categoryIdsInTopic.includes(t.categoryId));
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.categoryId === categoryFilter);
    }

    return result;
  }, [
    search,
    statusFilter,
    topicFilter,
    categoryFilter,
    categories,
    externalTickets,
  ]);
};
