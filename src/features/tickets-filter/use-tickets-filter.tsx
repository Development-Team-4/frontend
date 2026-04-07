'use client';

import { useStore } from '@/shared/store/store';
import { useMemo, useEffect } from 'react';
import { useFilterTickets } from '@/shared/hooks/use-filter-tickets';
import { useSortTickets } from '@/shared/hooks/use-sort-tickets';
import { SortIcon } from '@/components/ui/sort-icon';
import { SortField } from '@/shared/types';
import { useTopics } from '@/entities/topic/model';
import { useCategories } from '@/entities/category/model/use-category';
import { useTickets } from '@/entities/ticket/model';

export const useTicketsFilter = () => {
  useTopics();
  useCategories();

  const { data: backendTickets = [] } = useTickets();
  const topics = useStore((state) => state.topics);
  const store = useStore();

  useEffect(() => {
    if (store.topicFilter !== 'all') {
      store.setCategoryFilter('all');
    }
  }, [store.topicFilter, store.setCategoryFilter]);

  const filteredCategories = useMemo(() => {
    if (store.topicFilter === 'all') return store.categories;
    return store.categories.filter((c) => c.topicId === store.topicFilter);
  }, [store.topicFilter, store.categories]);

  const hasFilters = useMemo(
    () =>
      store.statusFilter !== 'all' ||
      store.topicFilter !== 'all' ||
      store.categoryFilter !== 'all' ||
      store.search !== '',
    [store.statusFilter, store.topicFilter, store.categoryFilter, store.search],
  );

  const filtered = useFilterTickets({
    search: store.search,
    statusFilter: store.statusFilter,
    topicFilter: store.topicFilter,
    categoryFilter: store.categoryFilter,
    categories: store.categories,
    tickets: backendTickets,
  });

  const sortedFiltered = useSortTickets({
    tickets: filtered,
    sortField: store.sortField,
    sortDir: store.sortDir,
  });

  const SortIconComponent = ({ field }: { field: SortField }) => (
    <SortIcon
      field={field}
      currentSortField={store.sortField}
      sortDir={store.sortDir}
    />
  );

  return {
    search: store.search,
    setSearch: store.setSearch,
    statusFilter: store.statusFilter,
    setStatusFilter: store.setStatusFilter,
    topicFilter: store.topicFilter,
    setTopicFilter: store.setTopicFilter,
    categoryFilter: store.categoryFilter,
    setCategoryFilter: store.setCategoryFilter,
    sortField: store.sortField,
    sortDir: store.sortDir,
    toggleSort: store.toggleSort,
    clearFilters: store.clearFilters,

    filteredCategories,
    hasFilters,
    filtered: sortedFiltered,
    SortIcon: SortIconComponent,
    topics,
  };
};
