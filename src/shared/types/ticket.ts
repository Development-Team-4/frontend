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

export interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  operation: string;
  oldSubject?: string | null;
  newSubject?: string | null;
  oldDescription?: string | null;
  newDescription?: string | null;
  oldStatus?: TicketStatus | null;
  newStatus?: TicketStatus | null;
  oldAssigneeId?: string | null;
  newAssigneeId?: string | null;
  changedAt: string;
}
