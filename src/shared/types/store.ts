import { Category } from './category';
import { Notification } from './common';
import { SortDirection, SortField } from './enums';
import { Ticket } from './ticket';
import { Topic } from './topic';
import { User } from './user';

export interface TicketsFilterState {
  users: User[];
  categories: Category[];

  search: string;
  statusFilter: string;
  topicFilter: string;
  categoryFilter: string;
  assigneeFilter: string;
  sortField: SortField;
  sortDir: SortDirection;

  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setTopicFilter: (topic: string) => void;
  setCategoryFilter: (category: string) => void;
  setAssigneeFilter: (assignee: string) => void;
  setSortField: (field: SortField) => void;
  setSortDir: (dir: SortDirection) => void;
  clearFilters: () => void;
  toggleSort: (field: SortField) => void;
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
  notifications: Notification[];
  typeConfig: Record<
    Notification['type'],
    { icon: React.ElementType; color: string; bg: string; label: string }
  >;
  topics: Topic[];
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByTopicId: (topicId: string) => Category[];
  getStaffForCategory: (categoryId: string) => User[];
  tickets: Ticket[];
}
