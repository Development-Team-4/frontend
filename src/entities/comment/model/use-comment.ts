'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Comment } from '@/shared/types';
import { commentsDataApi } from '../api';

export const useTicketComments = (ticketId: string | null) => {
  return useQuery<Comment[]>({
    queryKey: ['ticket-comments', ticketId],
    queryFn: () => commentsDataApi.getTicketComments(ticketId!),
    enabled: Boolean(ticketId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateTicketComment = (ticketId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      commentsDataApi.createTicketComment(ticketId!, { content }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(
        ['ticket-comments', ticketId],
        (prev = []) => [...prev, newComment],
      );
    },
  });
};
