'use client';
import { useStore } from '@/shared/store/store';
import { useState } from 'react';

export const useTopicsCategoriesSettings = () => {
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedTopicForCategory, setSelectedTopicForCategory] = useState('');
  const topics = useStore((state) => state.topics);
  return {
    newTopicName,
    setNewTopicName,
    newTopicDescription,
    setNewTopicDescription,
    newCategoryName,
    setNewCategoryName,
    selectedTopicForCategory,
    setSelectedTopicForCategory,
    topics,
  };
};
