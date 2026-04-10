'use client';

import { categoriesDataApi } from '@/entities/category/api';
import { useTopics } from '@/entities/topic/model';
import { useStore } from '@/shared/store/store';
import { Category } from '@/shared/types';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export const useStaffList = () => {
  useTopics();
  const users = useStore((state) => state.users);
  const topics = useStore((state) => state.topics);
  const categories = useStore((state) => state.categories);
  const setCategories = useStore((state) => state.setCategories);

  const supportStaff = users.filter(
    (u) => u.userRole === 'SUPPORT' || u.userRole === 'ADMIN',
  );

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

  const isCategoriesLoading = categoriesQueries.some(
    (query) => query.isLoading || query.isFetching,
  );

  useEffect(() => {
    const hasChanges =
      allCategories.length !== categories.length ||
      allCategories.some((nextCategory) => {
        const currentCategory = categories.find(
          (c) => c.id === nextCategory.id,
        );
        if (!currentCategory) return true;

        const nextAssigned = (nextCategory.assignedStaff || []).join(',');
        const currentAssigned = (currentCategory.assignedStaff || []).join(',');

        return (
          currentCategory.name !== nextCategory.name ||
          currentCategory.description !== nextCategory.description ||
          currentCategory.topicId !== nextCategory.topicId ||
          currentAssigned !== nextAssigned
        );
      });

    if (hasChanges) {
      setCategories(allCategories);
    }
  }, [allCategories, categories, setCategories]);

  return {
    supportStaff,
    categories,
    isCategoriesLoading,
  };
};
