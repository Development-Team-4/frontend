import { tickets } from '@/shared/consts';
import { useMemo } from 'react';

interface FilterOptions {
  search?: string;
  statusFilter?: string;
  topicFilter?: string;
  categoryFilter?: string;
  assigneeFilter?: string;
  categories?: Array<{ id: string; topicId: string }>;
}

export const useFilterTickets = ({
  search = '',
  statusFilter = 'all',
  topicFilter = 'all',
  categoryFilter = 'all',
  assigneeFilter = 'all',
  categories = [],
}: FilterOptions) => {
  return useMemo(() => {
    let result = [...tickets];

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

    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned') {
        result = result.filter((t) => !t.assignee);
      } else {
        result = result.filter((t) => t.assignee?.id === assigneeFilter);
      }
    }

    return result;
  }, [
    search,
    statusFilter,
    topicFilter,
    categoryFilter,
    assigneeFilter,
    categories,
  ]);
};
