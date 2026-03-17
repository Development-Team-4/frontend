import { useStore } from '@/shared/store/store';

export const useTopicsList = () => {
  const topics = useStore((state) => state.topics);
  return {
    topics,
  };
};
