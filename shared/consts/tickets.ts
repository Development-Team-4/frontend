import { TicketStatus } from '@/entities/ticket/types';

export const statusOrder: Record<TicketStatus, number> = {
  CREATED: 0,
  IN_WORK: 1,
  RESOLVED: 2,
  CLOSED: 3,
};

export const statusStyles: Record<TicketStatus, string> = {
  CREATED: 'bg-chart-1/15 text-chart-1',
  IN_WORK: 'bg-chart-2/15 text-chart-2',
  RESOLVED: 'bg-success/15 text-success',
  CLOSED: 'bg-muted text-muted-foreground',
};

export const statusLabels: Record<TicketStatus, string> = {
  CREATED: 'Создан',
  IN_WORK: 'В работе',
  RESOLVED: 'Решён',
  CLOSED: 'Закрыт',
};
