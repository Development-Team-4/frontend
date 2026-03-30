'use client';

import { useStore } from '@/shared/store/store';
import { tickets } from '@/lib/mock-data';
import { statusOrder } from '@/shared/consts';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';
import { SortField } from '@/shared/types';

export const useTicketsFilter = () => {
  const store = useStore();

  const supportStaff = useMemo(
    () => store.users.filter((u) => u.role === 'SUPPORT' || u.role === 'ADMIN'),
    [store.users],
  );

  const filteredCategories = useMemo(() => {
    if (store.topicFilter === 'all') return store.categories;
    return store.categories.filter((c) => c.topicId === store.topicFilter);
  }, [store.topicFilter, store.categories]);

  const hasFilters = useMemo(
    () =>
      store.statusFilter !== 'all' ||
      store.topicFilter !== 'all' ||
      store.categoryFilter !== 'all' ||
      store.assigneeFilter !== 'all' ||
      store.search !== '',
    [
      store.statusFilter,
      store.topicFilter,
      store.categoryFilter,
      store.assigneeFilter,
      store.search,
    ],
  );

  const filtered = useMemo(() => {
    let result = [...tickets];

    if (store.search) {
      const q = store.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    if (store.statusFilter !== 'all') {
      result = result.filter((t) => t.status === store.statusFilter);
    }

    if (store.topicFilter !== 'all') {
      const categoryIdsInTopic = store.categories
        .filter((c) => c.topicId === store.topicFilter)
        .map((c) => c.id);
      result = result.filter((t) => categoryIdsInTopic.includes(t.categoryId));
    }

    if (store.categoryFilter !== 'all') {
      result = result.filter((t) => t.categoryId === store.categoryFilter);
    }

    if (store.assigneeFilter !== 'all') {
      if (store.assigneeFilter === 'unassigned') {
        result = result.filter((t) => !t.assignee);
      } else {
        result = result.filter((t) => t.assignee?.id === store.assigneeFilter);
      }
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (store.sortField) {
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
      return store.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [
    store.search,
    store.statusFilter,
    store.topicFilter,
    store.categoryFilter,
    store.assigneeFilter,
    store.sortField,
    store.sortDir,
    store.categories,
  ]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (store.sortField !== field)
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;

    return store.sortDir === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  return {
    search: store.search,
    setSearch: store.setSearch,
    statusFilter: store.statusFilter,
    setStatusFilter: store.setStatusFilter,
    topicFilter: store.topicFilter,
    setTopicFilter: store.setTopicFilter,
    categoryFilter: store.categoryFilter,
    setCategoryFilter: store.setCategoryFilter,
    assigneeFilter: store.assigneeFilter,
    setAssigneeFilter: store.setAssigneeFilter,
    sortField: store.sortField,
    sortDir: store.sortDir,
    toggleSort: store.toggleSort,
    clearFilters: store.clearFilters,

    supportStaff,
    filteredCategories,
    hasFilters,
    filtered,
    SortIcon,
  };
};
