export const TICKET_STATUSES = {
  CREATED: 'CREATED',
  IN_WORK: 'IN_WORK',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type TicketStatus =
  (typeof TICKET_STATUSES)[keyof typeof TICKET_STATUSES];

export const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  STATUS: 'status',
} as const;

export type SortField = (typeof SORT_FIELDS)[keyof typeof SORT_FIELDS];

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];
