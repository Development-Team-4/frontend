'use client';
import { useStore } from '@/shared/store/store';

export const useTopicsList = () => {
  const topics = useStore((state) => state.topics);
  const getCategoriesByTopicId = useStore(
    (state) => state.getCategoriesByTopicId,
  );
  const getStaffForCategory = useStore((state) => state.getStaffForCategory);
  return {
    topics,
    getCategoriesByTopicId,
    getStaffForCategory,
  };
};
