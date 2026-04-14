'use client';

import { Topic } from '@/shared/types/topic';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateTopicPayload, topicsDataApi, UpdateTopicPayload } from '../api';
import { useStore } from '@/shared/store/store';
import { useEffect } from 'react';

export const useTopics = () => {
  const updateTopics = useStore((state) => state.updateTopics);
  const query = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: () => topicsDataApi.getTopicsData(),
  });

  useEffect(() => {
    if (!query.data) return;
    updateTopics(query.data);
  }, [query.data, updateTopics]);

  return query;
};

export const useCreateTopic = () => {
  const updateTopics = useStore((state) => state.updateTopics);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTopicPayload) =>
      topicsDataApi.createTopic(payload),
    onSuccess: (newTopic) => {
      queryClient.setQueryData<Topic[]>(['topics'], (prev = []) => {
        const nextTopics: Topic[] = [...prev, newTopic];
        updateTopics(nextTopics);
        return nextTopics;
      });
    },
  });
};

export const useUpdateTopic = () => {
  const updateTopics = useStore((state) => state.updateTopics);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTopicPayload;
    }) => topicsDataApi.updateTopic(id, payload),
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<Topic[]>(['topics'], (prev = []) => {
        const nextTopics = prev.map((topic) =>
          topic.id === updatedTopic.id ? updatedTopic : topic,
        );
        updateTopics(nextTopics);
        return nextTopics;
      });
    },
  });
};
