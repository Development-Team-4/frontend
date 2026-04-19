'use client';

import { api } from '@/shared/api/client';
import { TicketStatus } from '@/shared/types/enums';
import type { Ticket, TicketHistoryEntry } from '@/shared/types';
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

interface AssignTicketAssigneePayload {
  assigneeId: string;
}

interface UpdateTicketStatusPayload {
  status: TicketStatus;
}

interface UpdateTicketPayload {
  subject: string;
  description: string;
}

interface UpgradeTicketDescriptionPayload {
  ticketName: string;
  currentDescription: string;
}

type TicketHistoryBackend = TicketHistoryEntry;

type TicketsQueryParams = TicketsFilterParams & {
  'filterRequest.categoryId'?: string;
  'filterRequest.assignedTo'?: string;
  'filterRequest.createdBy'?: string;
  'filterRequest.status'?: string;
  'filterRequest.createdAfter'?: string;
  'filterRequest.createdBefore'?: string;
  'filterRequest[categoryId]'?: string;
  'filterRequest[assignedTo]'?: string;
  'filterRequest[createdBy]'?: string;
  'filterRequest[status]'?: string;
  'filterRequest[createdAfter]'?: string;
  'filterRequest[createdBefore]'?: string;
  filterRequest?: string;
};

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
    assignee:
      assigneeUser ||
      (ticket.assigneeId
        ? {
            userId: ticket.assigneeId,
            userName: 'Unknown',
            userEmail: '',
            userRole: 'USER',
          }
        : undefined),
  };
};

const extractImprovedDescription = (raw: unknown): string => {
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Сервис ИИ вернул пустой ответ');
  }

  const payload = raw as Record<string, unknown>;
  const directCandidates = [
    payload.improvedDescription,
    payload.upgradedDescription,
    payload.description,
    payload.result,
    payload.text,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  const nestedData = payload.data;
  if (typeof nestedData === 'string' && nestedData.trim()) {
    return nestedData.trim();
  }

  if (nestedData && typeof nestedData === 'object') {
    const nestedPayload = nestedData as Record<string, unknown>;
    const nestedCandidates = [
      nestedPayload.improvedDescription,
      nestedPayload.upgradedDescription,
      nestedPayload.description,
      nestedPayload.result,
      nestedPayload.text,
    ];

    for (const candidate of nestedCandidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  throw new Error('Не удалось получить улучшенное описание из ответа ИИ');
};

class TicketsDataApi {
  async getTickets(params: TicketsFilterParams): Promise<Ticket[]> {
    const plainParams: TicketsQueryParams = { ...params };
    const dotParams: TicketsQueryParams = {
      ...(params.categoryId
        ? { 'filterRequest.categoryId': params.categoryId }
        : {}),
      ...(params.assignedTo
        ? { 'filterRequest.assignedTo': params.assignedTo }
        : {}),
      ...(params.createdBy
        ? { 'filterRequest.createdBy': params.createdBy }
        : {}),
      ...(params.status ? { 'filterRequest.status': params.status } : {}),
      ...(params.createdAfter
        ? { 'filterRequest.createdAfter': params.createdAfter }
        : {}),
      ...(params.createdBefore
        ? { 'filterRequest.createdBefore': params.createdBefore }
        : {}),
    };
    const bracketParams: TicketsQueryParams = {
      ...(params.categoryId
        ? { 'filterRequest[categoryId]': params.categoryId }
        : {}),
      ...(params.assignedTo
        ? { 'filterRequest[assignedTo]': params.assignedTo }
        : {}),
      ...(params.createdBy
        ? { 'filterRequest[createdBy]': params.createdBy }
        : {}),
      ...(params.status ? { 'filterRequest[status]': params.status } : {}),
      ...(params.createdAfter
        ? { 'filterRequest[createdAfter]': params.createdAfter }
        : {}),
      ...(params.createdBefore
        ? { 'filterRequest[createdBefore]': params.createdBefore }
        : {}),
    };
    const jsonParam: TicketsQueryParams = {
      filterRequest: JSON.stringify(params),
    };

    const requestVariants = [plainParams, dotParams, bracketParams, jsonParam];
    let lastError: unknown;

    for (const queryParams of requestVariants) {
      try {
        const backendTickets = await api
          .get<TicketBackend[]>('/tickets', {
            params: queryParams,
          })
          .then((res) => res.data);

        return backendTickets.map(mapBackendTicket);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

  async getTicketById(id: string): Promise<Ticket> {
    const backendTicket = await api
      .get<TicketBackend>(`/tickets/${id}`)
      .then((res) => res.data);

    return mapBackendTicket(backendTicket);
  }

  async assignTicketAssignee(
    ticketId: string,
    payload: AssignTicketAssigneePayload,
  ): Promise<Ticket> {
    const backendTicket = await api
      .put<TicketBackend>(`/tickets/${ticketId}/assignee`, payload)
      .then((res) => res.data);

    return mapBackendTicket(backendTicket);
  }

  async updateTicketStatus(
    ticketId: string,
    payload: UpdateTicketStatusPayload,
  ): Promise<Ticket> {
    const backendTicket = await api
      .put<TicketBackend>(`/tickets/${ticketId}/status`, payload)
      .then((res) => res.data);

    return mapBackendTicket(backendTicket);
  }

  async updateTicket(
    ticketId: string,
    payload: UpdateTicketPayload,
  ): Promise<Ticket> {
    const backendTicket = await api
      .put<TicketBackend>(`/tickets/${ticketId}`, payload)
      .then((res) => res.data);

    return mapBackendTicket(backendTicket);
  }

  async deleteTicket(ticketId: string): Promise<void> {
    await api.delete(`/tickets/${ticketId}`);
  }

  async getTicketHistory(ticketId: string): Promise<TicketHistoryEntry[]> {
    return api
      .get<TicketHistoryBackend[]>(`/tickets/${ticketId}/history`)
      .then((res) => res.data);
  }

  async upgradeDescription(
    payload: UpgradeTicketDescriptionPayload,
  ): Promise<string> {
    const response = await api
      .post<unknown>('/gpt/upgrade', payload)
      .then((res) => res.data);

    return extractImprovedDescription(response);
  }
}

export const ticketsDataApi = new TicketsDataApi();
