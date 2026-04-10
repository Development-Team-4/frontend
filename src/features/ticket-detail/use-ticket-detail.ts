'use client';

import { useParams } from 'next/navigation';
import { useTicketById } from '@/entities/ticket/model';

export const useTicketDetail = () => {
  const params = useParams<{ id: string | string[] }>();
  const paramId = params?.id;
  const ticketId = Array.isArray(paramId) ? paramId[0] : (paramId ?? '');

  const query = useTicketById(ticketId || null);

  return {
    ticketId,
    ...query,
  };
};
