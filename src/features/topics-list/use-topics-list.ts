'use client';
import { categoriesDataApi } from '@/entities/category/api';
import { useTopics } from '@/entities/topic/model';
import { useStore } from '@/shared/store/store';
import { Category } from '@/shared/types';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useTopicsList = () => {
  useTopics();
  const topics = useStore((state) => state.topics);
  const getStaffForCategory = useStore((state) => state.getStaffForCategory);

  const categoriesQueries = useQueries({
    queries: topics.map((topic) => ({
      queryKey: ['topic-categories', topic.id],
      queryFn: () => categoriesDataApi.getCategoriesDataByTopicId(topic.id),
      enabled: Boolean(topic.id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const categoriesByTopicId = useMemo(() => {
    return topics.reduce<Record<string, Category[]>>((acc, topic, index) => {
      acc[topic.id] = categoriesQueries[index]?.data ?? [];
      return acc;
    }, {});
  }, [topics, categoriesQueries]);

  const categoriesLoadingByTopicId = useMemo(() => {
    return topics.reduce<Record<string, boolean>>((acc, topic, index) => {
      const query = categoriesQueries[index];
      acc[topic.id] = Boolean(query?.isLoading || query?.isFetching);
      return acc;
    }, {});
  }, [topics, categoriesQueries]);

  const getCategoriesByTopicId = (topicId: string): Category[] => {
    return categoriesByTopicId[topicId] ?? [];
  };

  const isTopicCategoriesLoading = (topicId: string): boolean => {
    return categoriesLoadingByTopicId[topicId] ?? false;
  };

  return {
    topics,
    getCategoriesByTopicId,
    isTopicCategoriesLoading,
    getStaffForCategory,
  };
};
