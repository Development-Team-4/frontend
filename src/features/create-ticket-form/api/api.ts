import { api } from '@/shared/api/client';
import { Ticket } from '@/shared/types';

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
      .post<Ticket>(`/tickets`, { subject, description, categoryId })
      .then((res) => res.data);
  }
}

export const createTicketApi = new CreateTicketApi();
