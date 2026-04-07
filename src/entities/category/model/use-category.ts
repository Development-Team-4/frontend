'use client';

import { Category } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/shared/store/store';
import { categoriesDataApi } from '../api';
import { useEffect } from 'react';

export const useCategories = () => {
  const topicFilter = useStore((state) => state.topicFilter);
  const updateCategories = useStore((state) => state.setCategories);

  const query = useQuery<Category[]>({
    queryKey: ['categories', topicFilter],
    queryFn: () => {
      if (topicFilter === 'all') {
        return Promise.resolve([]);
      }
      return categoriesDataApi.getCategoriesDataByTopicId(topicFilter);
    },
    enabled: topicFilter !== 'all',
  });

  useEffect(() => {
    if (query.data) {
      updateCategories(query.data);
    }
  }, [query.data, updateCategories]);

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
