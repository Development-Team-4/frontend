import { getCategoriesByTopicId } from '@/lib/mock-data';
import { useStore } from '@/shared/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CreateTicketFormData,
  createTicketSchema,
} from './model/createTicket.schema';

export const useCreateTicketForm = () => {
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

  const filteredCategories = useMemo(() => {
    if (!topicId) return [];
    return getCategoriesByTopicId(topicId);
  }, [topicId]);

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

      // await createTicket(data)
      await new Promise((resolve) => setTimeout(resolve, 800));

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
