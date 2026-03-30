import { categories, tickets, topics, users } from '@/shared/consts';
import { Category, Ticket, Topic, User } from '@/shared/types';

export const currentUser: User = users[5]; // 5 SUPPORT 0 - ADMIN 4 USER

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoriesByTopicId(topicId: string): Category[] {
  return categories.filter((c) => c.topicId === topicId);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getStaffForCategory(categoryId: string): User[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return users.filter((u) => category.assignedStaff.includes(u.id));
}

export function getTicketsByUser(userId: string): Ticket[] {
  return tickets.filter((t) => t.createdBy.id === userId);
}

export function getTicketsByCategory(categoryId: string): Ticket[] {
  return tickets.filter((t) => t.categoryId === categoryId);
}

export function getTicketsByAssignee(userId: string): Ticket[] {
  return tickets.filter((t) => t.assignee?.id === userId);
}
