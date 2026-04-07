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
      // Если выбран 'all', не делаем запрос
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
