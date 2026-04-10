'use client';
import { useCreateTopic, useTopics } from '@/entities/topic/model';
import { useCreateCategory } from '@/entities/category/model';
import { useStore } from '@/shared/store/store';
import { useState } from 'react';

export const useTopicsCategoriesSettings = () => {
  useTopics();
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [selectedTopicForCategory, setSelectedTopicForCategory] = useState('');
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const topics = useStore((state) => state.topics);
  const { mutateAsync: createTopic, isPending: isCreatingTopic } =
    useCreateTopic();
  const { mutateAsync: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();

  const isTopicNameValid =
    newTopicName.trim().length > 0 && newTopicName.trim().length <= 255;
  const isTopicDescriptionValid = newTopicDescription.trim().length <= 2000;
  const canCreateTopic =
    isTopicNameValid && isTopicDescriptionValid && !isCreatingTopic;
  const canCreateCategory =
    Boolean(selectedTopicForCategory) &&
    Boolean(newCategoryName.trim()) &&
    Boolean(newCategoryDescription.trim()) &&
    !isCreatingCategory;

  const handleCreateTopic = async () => {
    if (!canCreateTopic) return;

    await createTopic({
      name: newTopicName.trim(),
      description: newTopicDescription.trim() || undefined,
    });

    setNewTopicName('');
    setNewTopicDescription('');
    setIsCreateTopicOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!canCreateCategory) return;

    const topicId = selectedTopicForCategory;
    await createCategory({
      topicId,
      payload: {
        topicId,
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
      },
    });

    setNewCategoryName('');
    setNewCategoryDescription('');
    setSelectedTopicForCategory('');
    setIsCreateCategoryOpen(false);
  };

  return {
    newTopicName,
    setNewTopicName,
    newTopicDescription,
    setNewTopicDescription,
    newCategoryName,
    setNewCategoryName,
    newCategoryDescription,
    setNewCategoryDescription,
    selectedTopicForCategory,
    setSelectedTopicForCategory,
    topics,
    isCreateTopicOpen,
    setIsCreateTopicOpen,
    isCreatingTopic,
    canCreateTopic,
    handleCreateTopic,
    isCreateCategoryOpen,
    setIsCreateCategoryOpen,
    isCreatingCategory,
    canCreateCategory,
    handleCreateCategory,
  };
};
