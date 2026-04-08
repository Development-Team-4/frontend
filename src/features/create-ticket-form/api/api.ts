import { api } from '@/shared/api/client';
import { Ticket } from '@/shared/types';
import type { TicketBackend } from '@/entities/ticket/api/api';

const normalizeCreatedTicket = (raw: Ticket | TicketBackend): Ticket => {
  if (typeof (raw as TicketBackend).createdBy === 'string') {
    const backend = raw as TicketBackend;

    return {
      id: backend.id,
      subject: backend.subject,
      description: backend.description,
      status: backend.status,
      categoryId: backend.categoryId,
      createdAt: backend.createdAt,
      updatedAt: backend.updatedAt,
      createdBy: {
        userId: backend.createdBy,
        userName: 'Unknown',
        userEmail: '',
        userRole: 'USER',
      },
      assignee: backend.assigneeId
        ? {
            userId: backend.assigneeId,
            userName: 'Unknown',
            userEmail: '',
            userRole: 'USER',
          }
        : undefined,
    };
  }

  return raw as Ticket;
};

class CreateTicketApi {
  async createTicket({
    subject,
    description,
    categoryId,
  }: {
    subject: string;
    description: string;
    categoryId: string;
  }) {
    return api
      .post<Ticket | TicketBackend>(`/tickets`, {
        subject,
        description,
        categoryId,
      })
      .then((res) => normalizeCreatedTicket(res.data));
  }
}

export const createTicketApi = new CreateTicketApi();
