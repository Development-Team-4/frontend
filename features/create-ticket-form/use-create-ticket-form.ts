import { getCategoriesByTopicId } from '@/lib/mock-data';
import { useStore } from '@/shared/store/store';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export const useCreateTicketForm = () => {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const topics = useStore((state) => state.topics);
  const [description, setDescription] = useState('');
  const [topicId, setTopicId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!topicId) return [];
    return getCategoriesByTopicId(topicId);
  }, [topicId]);

  const handleTopicChange = (value: string) => {
    setTopicId(value);
    setCategoryId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/tickets');
    }, 800);
  };

  const canSubmit = subject && description && categoryId;
  return {
    handleSubmit,
    handleTopicChange,
    filteredCategories,
    isSubmitting,
    subject,
    setSubject,
    description,
    setDescription,
    topicId,
    categoryId,
    setCategoryId,
    canSubmit,
    topics,
  };
};
