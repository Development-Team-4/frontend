import { User } from './user';

export interface Comment {
  id: string;
  ticketId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'ASSIGNMENT' | 'COMMENT' | 'STATUS_CHANGE';
  title: string;
  message: string;
  ticketId: string;
  read: boolean;
  createdAt: string;
}
