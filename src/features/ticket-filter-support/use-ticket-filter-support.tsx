'use client';

import { categoriesDataApi } from '@/entities/category/api';
import { useCheckStaffAssignments } from '@/entities/category/model';
import { useTickets } from '@/entities/ticket/model';
import { useTopics } from '@/entities/topic/model';
import { useStore } from '@/shared/store/store';
import { Category, Ticket } from '@/shared/types';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export const useTicketFilterSupport = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useTopics();
  const topics = useStore((state) => state.topics);
  const userData = useStore((state) => state.userData);

  const categoriesQueries = useQueries({
    queries: topics.map((topic) => ({
      queryKey: ['topic-categories', topic.id],
      queryFn: () => categoriesDataApi.getCategoriesDataByTopicId(topic.id),
      enabled: Boolean(topic.id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const allCategories = useMemo(() => {
    const map = new Map<string, Category>();

    categoriesQueries.forEach((query) => {
      (query.data ?? []).forEach((category) => {
        map.set(category.id, category);
      });
    });

    return Array.from(map.values());
  }, [categoriesQueries]);

  const { assignmentByCategoryId } = useCheckStaffAssignments({
    staffId: userData?.userId || '',
    categoryIds: allCategories.map((category) => category.id),
    enabled:
      userData?.userRole === 'SUPPORT' &&
      Boolean(userData?.userId) &&
      allCategories.length > 0,
  });

  const userCategories = useMemo(() => {
    if (!userData) return [];

    if (userData.userRole === 'ADMIN') {
      return allCategories;
    }

    if (userData.userRole !== 'SUPPORT') {
      return [];
    }

    return allCategories.filter((category) => {
      const checkedAssignment = assignmentByCategoryId[category.id];
      const fallbackFromCategory = Array.isArray(category.assignedStaff)
        ? category.assignedStaff.includes(userData.userId)
        : false;
      const fallbackFromUser = Array.isArray(userData.categoryIds)
        ? userData.categoryIds.includes(category.id)
        : false;
      const fallbackAssignment = fallbackFromCategory || fallbackFromUser;

      // Prefer `true` from explicit check, but never drop valid fallback data on `false`.
      return checkedAssignment === true || fallbackAssignment;
    });
  }, [allCategories, assignmentByCategoryId, userData]);

  useEffect(() => {
    if (
      categoryFilter !== 'all' &&
      !userCategories.some((category) => category.id === categoryFilter)
    ) {
      setCategoryFilter('all');
    }
  }, [categoryFilter, userCategories]);

  const selectedCategoryIds = useMemo(() => {
    if (categoryFilter === 'all') {
      return userCategories.map((category) => category.id);
    }

    return userCategories.some((category) => category.id === categoryFilter)
      ? [categoryFilter]
      : [];
  }, [categoryFilter, userCategories]);

  const { data: allTickets = [] } = useTickets();

  const categoryTickets = useMemo(() => {
    let result = allTickets.filter((ticket) =>
      selectedCategoryIds.includes(ticket.categoryId),
    );

    if (statusFilter !== 'all') {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    const uniqueTickets = new Map<string, Ticket>();
    result.forEach((ticket) => {
      uniqueTickets.set(ticket.id, ticket);
    });

    return Array.from(uniqueTickets.values()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [allTickets, selectedCategoryIds, statusFilter]);

  return {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    userCategories,
    categoryTickets,
  };
};
