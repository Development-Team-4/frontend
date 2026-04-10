'use client';
import { categoriesDataApi } from '@/entities/category/api';
import { useTopics, useUpdateTopic } from '@/entities/topic/model';
import { useStore } from '@/shared/store/store';
import { Category, Topic } from '@/shared/types';
import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export const useTopicsList = () => {
  const { isLoading: isTopicsLoading } = useTopics();
  const topics = useStore((state) => state.topics);
  const { mutateAsync: updateTopic, isPending: isUpdatingTopic } =
    useUpdateTopic();
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = useState('');
  const [editingTopicDescription, setEditingTopicDescription] = useState('');

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

  const canUpdateTopic =
    editingTopicName.trim().length > 0 &&
    editingTopicName.trim().length <= 255 &&
    editingTopicDescription.trim().length <= 2000 &&
    Boolean(editingTopicId) &&
    !isUpdatingTopic;

  const openEditTopic = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditingTopicName(topic.name);
    setEditingTopicDescription(topic.description || '');
    setIsEditTopicOpen(true);
  };

  const closeEditTopic = () => {
    setIsEditTopicOpen(false);
    setEditingTopicId(null);
    setEditingTopicName('');
    setEditingTopicDescription('');
  };

  const handleUpdateTopic = async () => {
    if (!canUpdateTopic || !editingTopicId) return;

    await updateTopic({
      id: editingTopicId,
      payload: {
        name: editingTopicName.trim(),
        description: editingTopicDescription.trim() || undefined,
      },
    });

    closeEditTopic();
  };

  return {
    topics,
    isTopicsLoading,
    getCategoriesByTopicId,
    isTopicCategoriesLoading,
    isEditTopicOpen,
    setIsEditTopicOpen,
    editingTopicName,
    setEditingTopicName,
    editingTopicDescription,
    setEditingTopicDescription,
    isUpdatingTopic,
    canUpdateTopic,
    openEditTopic,
    closeEditTopic,
    handleUpdateTopic,
  };
};
