import { useStore } from '@/shared/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  CreateTicketFormData,
  createTicketSchema,
} from './model/createTicket.schema';
import { useTopics } from '@/entities/topic/model';
import { useCategories } from '@/entities/category/model';
import { createTicketApi } from './api';
import { Ticket } from '@/shared/types';
import { getApiFieldErrors, normalizeApiError } from '@/shared/api/errors';
import { toast } from 'sonner';

export const useCreateTicketForm = () => {
  useTopics();
  const router = useRouter();
  const queryClient = useQueryClient();
  const topics = useStore((state) => state.topics);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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
  const {
    data: filteredCategories = [],
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useCategories(topicId || null);
  const hasAvailableCategories = filteredCategories.length > 0;

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
    if (data.topicId && !hasAvailableCategories) {
      form.setError('categoryId', {
        type: 'manual',
        message: 'У выбранной темы нет доступных категорий',
      });
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    form.clearErrors();

    try {
      const newData = {
        subject: data.subject,
        description: data.description,
        categoryId: data.categoryId,
      };
      const createdTicket = await createTicketApi.createTicket(newData);

      queryClient.setQueryData<Ticket[]>(['tickets'], (prev = []) => [
        createdTicket,
        ...prev.filter((ticket) => ticket.id !== createdTicket.id),
      ]);
      queryClient.setQueryData(['ticket', createdTicket.id], createdTicket);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Тикет успешно создан');

      router.replace('/tickets');
    } catch (error) {
      const normalizedError = normalizeApiError(
        error,
        'Не удалось создать тикет',
      );

      const fieldErrors = getApiFieldErrors(normalizedError, {
        subject: 'subject',
        description: 'description',
        categoryId: 'categoryId',
      });

      (
        Object.entries(fieldErrors) as Array<
          [keyof CreateTicketFormData, string]
        >
      ).forEach(([field, message]) => {
        if (field in data) {
          form.setError(field, { type: 'server', message });
        }
      });

      if (Object.keys(fieldErrors).length === 0) {
        setServerError(normalizedError.message);
      }
      toast.error(normalizedError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(
    subject.trim() &&
    description.trim() &&
    topicId &&
    categoryId &&
    hasAvailableCategories &&
    !isCategoriesLoading &&
    !isCategoriesFetching &&
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
    serverError,
  };
};
