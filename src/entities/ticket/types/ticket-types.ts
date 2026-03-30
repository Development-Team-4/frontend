import { User } from '@/entities/user/types';

export type TicketStatus = 'CREATED' | 'IN_WORK' | 'RESOLVED' | 'CLOSED';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  assignee?: User;
}
