'use client';

import { useQuery } from '@tanstack/react-query';
import { ticketsDataApi } from '../api';
import type { Ticket } from '@/shared/types';

export const useTickets = () => {
  return useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: () => ticketsDataApi.getTickets({}),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
