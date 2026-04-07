import { useStore } from '@/shared/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CreateTicketFormData,
  createTicketSchema,
} from './model/createTicket.schema';
import { useTopics } from '@/entities/topic/model';
import { useCategories } from '@/entities/category/model';
import { createTicketApi } from './api';

export const useCreateTicketForm = () => {
  useTopics();
  const router = useRouter();
  const topics = useStore((state) => state.topics);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      description: '',
      topicId: '',
      categoryId: '',
    },
    mode: 'onSubmit',
  });

  const topicId = form.watch('topicId');
  const categoryId = form.watch('categoryId');
  const subject = form.watch('subject');
  const description = form.watch('description');
  const { data: filteredCategories = [] } = useCategories(topicId || null);

  const handleTopicChange = (value: string) => {
    form.setValue('topicId', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue('categoryId', '', {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCategoryChange = (value: string) => {
    form.setValue('categoryId', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: CreateTicketFormData) => {
    setIsSubmitting(true);

    try {
      console.log('ticket data:', data);

      const newData = {
        subject: data.subject,
        description: data.description,
        categoryId: data.categoryId,
      };
      await createTicketApi.createTicket(newData);

      router.push('/tickets');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(
    subject.trim() &&
    description.trim() &&
    topicId &&
    categoryId &&
    !isSubmitting,
  );

  return {
    ...form,
    onSubmit,
    handleTopicChange,
    handleCategoryChange,
    filteredCategories,
    isSubmitting,
    canSubmit,
    topics,
    topicId,
    categoryId,
  };
};
