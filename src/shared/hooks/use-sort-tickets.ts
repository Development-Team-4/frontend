import { statusOrder } from '@/shared/consts';
import { useMemo } from 'react';
import { SortField, Ticket } from '@/shared/types';

interface SortOptions {
  tickets: Ticket[];
  sortField: SortField;
  sortDir: 'asc' | 'desc';
}

export const useSortTickets = ({
  tickets,
  sortField,
  sortDir,
}: SortOptions) => {
  return useMemo(() => {
    const result = [...tickets];

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'createdAt':
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          cmp =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'status':
          cmp = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tickets, sortField, sortDir]);
};
