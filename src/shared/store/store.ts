import { create } from 'zustand';
import { MessageSquare, RefreshCw, UserPlus } from 'lucide-react';
import { Category, Ticket, TicketsFilterState, User } from '@/shared/types';
import { notifications, tickets } from '../consts';

export const useStore = create<TicketsFilterState>((set, get) => ({
  userData: null,
  updateUserData: (newUserData) => set({ userData: newUserData }),
  updateTopics: (topics) => set({ topics }),
  users: [],
  setUsers: (users) => set({ users }),
  tickets,
  topics: [],
  categories: [],
  notifications,

  search: '',
  statusFilter: 'all',
  topicFilter: 'all',
  categoryFilter: 'all',
  sortField: 'updatedAt',
  sortDir: 'desc',

  typeConfig: {
    COMMENT: {
      icon: MessageSquare,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
      label: 'Комментарий',
    },
    ASSIGNMENT: {
      icon: UserPlus,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
      label: 'Назначение',
    },
    STATUS_CHANGE: {
      icon: RefreshCw,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      label: 'Статус',
    },
  },
  ticketComments: [],
  updateTicketComments: (newComments) => set({ ticketComments: newComments }),

  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTopicFilter: (topicFilter) => set({ topicFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSortField: (sortField) => set({ sortField }),
  setSortDir: (sortDir) => set({ sortDir }),
  setCategories: (categories) => set({ categories }),

  setNotifications: (notifications) =>
    set((state) => ({
      notifications:
        typeof notifications === 'function'
          ? notifications(state.notifications)
          : notifications,
    })),

  clearFilters: () =>
    set({
      search: '',
      statusFilter: 'all',
      topicFilter: 'all',
      categoryFilter: 'all',
    }),

  toggleSort: (field) => {
    const { sortField, sortDir } = get();

    if (sortField === field) {
      set({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortField: field, sortDir: 'desc' });
    }
  },

  getCategoriesByTopicId: (topicId: string): Category[] => {
    return get().categories.filter((c) => c.topicId === topicId);
  },

  getStaffForCategory: (categoryId: string): User[] => {
    const category = get().getCategoryById(categoryId);
    if (!category) return [];
    const assignedStaff = category.assignedStaff || [];
    return get().users.filter((u) => assignedStaff.includes(u.userId));
  },

  getCategoryById: (id: string): Category | undefined => {
    return get().categories.find((c) => c.id === id);
  },

  getCategoryTickets: (userCategories: Category[]): Ticket[] => {
    const { tickets, statusFilter, categoryFilter } = get();

    const categoryIds = userCategories.map((c) => c.id);

    let result = tickets.filter((t) => categoryIds.includes(t.categoryId));

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.categoryId === categoryFilter);
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },
}));
