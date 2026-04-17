'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketsDataApi } from '../api';
import type { Ticket, TicketHistoryEntry } from '@/shared/types';
import { useStore } from '@/shared/store/store';
import { TicketStatus } from '@/shared/types';

export const useTickets = () => {
  return useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: () => ticketsDataApi.getTickets({}),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useTicketById = (ticketId: string | null) => {
  return useQuery<Ticket>({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsDataApi.getTicketById(ticketId!),
    enabled: Boolean(ticketId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useTicketHistory = (ticketId: string | null) => {
  return useQuery<TicketHistoryEntry[]>({
    queryKey: ['ticket-history', ticketId],
    queryFn: () => ticketsDataApi.getTicketHistory(ticketId!),
    enabled: Boolean(ticketId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAssignTicketAssignee = () => {
  const queryClient = useQueryClient();
  const userData = useStore((state) => state.userData);

  return useMutation({
    mutationFn: ({
      ticketId,
      assigneeId,
    }: {
      ticketId: string;
      assigneeId: string;
    }) => ticketsDataApi.assignTicketAssignee(ticketId, { assigneeId }),
    onSuccess: (updatedTicket, variables) => {
      const nextTicket: Ticket = {
        ...updatedTicket,
        assignee:
          userData && userData.userId === variables.assigneeId
            ? userData
            : updatedTicket.assignee,
      };

      queryClient.setQueryData<Ticket>(['ticket', nextTicket.id], nextTicket);
      queryClient.setQueryData<Ticket[]>(['tickets'], (prev = []) =>
        prev.map((ticket) =>
          ticket.id === nextTicket.id ? nextTicket : ticket,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', nextTicket.id] });
      queryClient.invalidateQueries({
        queryKey: ['ticket-history', nextTicket.id],
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: TicketStatus;
    }) => ticketsDataApi.updateTicketStatus(ticketId, { status }),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData<Ticket>(
        ['ticket', updatedTicket.id],
        updatedTicket,
      );
      queryClient.setQueryData<Ticket[]>(['tickets'], (prev = []) =>
        prev.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', updatedTicket.id] });
      queryClient.invalidateQueries({
        queryKey: ['ticket-history', updatedTicket.id],
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId }: { ticketId: string }) =>
      ticketsDataApi.deleteTicket(ticketId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Ticket[]>(['tickets'], (prev = []) =>
        prev.filter((ticket) => ticket.id !== variables.ticketId),
      );
      queryClient.removeQueries({ queryKey: ['ticket', variables.ticketId] });
      queryClient.invalidateQueries({
        queryKey: ['ticket-history', variables.ticketId],
      });
      queryClient.removeQueries({
        queryKey: ['ticket-comments', variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      subject,
      description,
    }: {
      ticketId: string;
      subject: string;
      description: string;
    }) => ticketsDataApi.updateTicket(ticketId, { subject, description }),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData<Ticket>(
        ['ticket', updatedTicket.id],
        updatedTicket,
      );
      queryClient.setQueryData<Ticket[]>(['tickets'], (prev = []) =>
        prev.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', updatedTicket.id] });
      queryClient.invalidateQueries({
        queryKey: ['ticket-history', updatedTicket.id],
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
