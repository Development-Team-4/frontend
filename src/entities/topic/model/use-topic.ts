'use client';

import { Topic } from '@/shared/types/topic';
import { useQuery } from '@tanstack/react-query';
import { topicsDataApi } from '../api';
import { useStore } from '@/shared/store/store';

export const useTopics = () => {
  const updateTopics = useStore((state) => state.updateTopics);
  useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: () => topicsDataApi.getTopicsData(),
    select: (data) => {
      updateTopics(data);
      return data;
    },
  });
};
