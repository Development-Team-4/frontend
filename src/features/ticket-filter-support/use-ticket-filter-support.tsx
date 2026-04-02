'use client';
import { currentUser } from '@/shared/lib/mock-data';
import { categories, tickets } from '@/shared/consts';
import { useMemo, useState } from 'react';

export const useTicketFilterSupport = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const userCategories = useMemo(() => {
    if (currentUser.role === 'ADMIN') return categories;
    return categories.filter((c) => currentUser.categoryIds?.includes(c.id));
  }, []);

  const categoryTickets = useMemo(() => {
    const categoryIds = userCategories.map((c) => c.id);
    let result = tickets.filter((t) => categoryIds.includes(t.categoryId));

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.categoryId === categoryFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [statusFilter, categoryFilter, userCategories]);

  return {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    userCategories,
    categoryTickets,
  };
};
