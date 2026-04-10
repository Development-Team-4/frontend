import { User } from './user';

export interface Comment {
  id: string;
  ticketId: string;
  author: User;
  content: string;
  createdAt: string;
}

export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'ASSIGNMENT',
  COMMENT: 'COMMENT',
  STATUS_CHANGE: 'STATUS_CHANGE',
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export interface Notification {
  id: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  ticketId: string;
  sent?: boolean;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}
