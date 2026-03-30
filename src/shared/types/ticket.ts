import { TicketStatus } from './enums';
import { User } from './user';

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
