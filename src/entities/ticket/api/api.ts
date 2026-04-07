'use client';

import { api } from '@/shared/api/client';
import { TicketStatus } from '@/shared/types/enums';
import type { Ticket } from '@/shared/types';
import { getUserById } from '@/shared/lib/mock-data';

export interface TicketBackend {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  categoryId: string;
  createdBy: string;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TicketsFilterParams {
  categoryId?: string;
  assignedTo?: string;
  createdBy?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
}

const mapBackendTicket = (ticket: TicketBackend): Ticket => {
  const createdByUser = getUserById(ticket.createdBy);
  const assigneeUser = ticket.assigneeId
    ? getUserById(ticket.assigneeId)
    : undefined;

  return {
    id: ticket.id,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    categoryId: ticket.categoryId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    createdBy: createdByUser || {
      userId: ticket.createdBy,
      userName: 'Unknown',
      userEmail: '',
      userRole: 'USER',
    },
    assignee: assigneeUser || undefined,
  };
};

class TicketsDataApi {
  async getTickets(params: TicketsFilterParams): Promise<Ticket[]> {
    const backendTickets = await api
      .get<TicketBackend[]>('/tickets', {
        params,
      })
      .then((res) => res.data);

    return backendTickets.map(mapBackendTicket);
  }
}

export const ticketsDataApi = new TicketsDataApi();
