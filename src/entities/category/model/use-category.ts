'use client';

import { Category } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/shared/store/store';
import { categoriesDataApi } from '../api';
import { useEffect } from 'react';

export const useCategories = (topicId?: string | null) => {
  const topicFilter = useStore((state) => state.topicFilter);
  const updateCategories = useStore((state) => state.setCategories);
  const selectedTopicId =
    typeof topicId === 'string'
      ? topicId
      : topicFilter !== 'all'
        ? topicFilter
        : null;

  const query = useQuery<Category[]>({
    queryKey: ['categories', selectedTopicId],
    queryFn: () => {
      if (!selectedTopicId) {
        return Promise.resolve([]);
      }
      return categoriesDataApi.getCategoriesDataByTopicId(selectedTopicId);
    },
    enabled: Boolean(selectedTopicId),
  });

  useEffect(() => {
    if (!topicId && query.data) {
      updateCategories(query.data);
    }
  }, [query.data, updateCategories, topicId]);

  return query;
};

export const useCategoryById = (categoryId: string | null) => {
  return useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesDataApi.getCategoryById(categoryId!),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
