import { useStore } from '@/shared/store/store';
import { useState } from 'react';

export const useTopicsCategoriesSettings = () => {
  const [newTopicName, setNewTopicName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedTopicForCategory, setSelectedTopicForCategory] = useState('');
  const topics = useStore((state) => state.topics);
  return {
    newTopicName,
    setNewTopicName,
    newCategoryName,
    setNewCategoryName,
    selectedTopicForCategory,
    setSelectedTopicForCategory,
    topics,
  };
};
