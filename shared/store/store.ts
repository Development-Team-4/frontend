import { create } from 'zustand';
import { IStore } from '../types/store';
import { User } from '@/entities/user/types';
import { Category } from '@/entities/category/types';

type SortField = 'createdAt' | 'updatedAt' | 'status';
type SortDirection = 'asc' | 'desc';

interface TicketsFilterState {
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
}

export const useStore = create<TicketsFilterState>((set, get) => ({
  users: [
    {
      id: 'u1',
      name: 'Алексей Петров',
      email: 'a.petrov@corp.com',
      role: 'ADMIN',
      notificationChannels: { email: true, telegram: true },
    },
    {
      id: 'u2',
      name: 'Мария Иванова',
      email: 'm.ivanova@corp.com',
      role: 'SUPPORT',
      categoryIds: ['c1', 'c2', 'c6'],
      notificationChannels: { email: true, telegram: false },
    },
    {
      id: 'u3',
      name: 'Дмитрий Соколов',
      email: 'd.sokolov@corp.com',
      role: 'SUPPORT',
      categoryIds: ['c1', 'c3'],
      notificationChannels: { email: true, telegram: true },
    },
    {
      id: 'u4',
      name: 'Елена Кузнецова',
      email: 'e.kuznetsova@corp.com',
      role: 'USER',
      notificationChannels: { email: true, telegram: false },
    },
    {
      id: 'u5',
      name: 'Николай Волков',
      email: 'n.volkov@corp.com',
      role: 'USER',
      notificationChannels: { email: false, telegram: true },
    },
    {
      id: 'u6',
      name: 'Ирина Смирнова',
      email: 'i.smirnova@corp.com',
      role: 'SUPPORT',
      categoryIds: ['c3', 'c4', 'c5', 'c6'],
      notificationChannels: { email: true, telegram: true },
    },
  ],

  categories: [
    {
      id: 'c1',
      topicId: 't1',
      name: 'Ошибки и баги',
      description: 'Сообщения об ошибках в системе',
      assignedStaff: ['u2', 'u3'],
    },
    {
      id: 'c2',
      topicId: 't1',
      name: 'Настройка и интеграции',
      description: 'Помощь с настройкой',
      assignedStaff: ['u2'],
    },
    {
      id: 'c3',
      topicId: 't1',
      name: 'Доступ и авторизация',
      description: 'Проблемы с входом в систему',
      assignedStaff: ['u3', 'u6'],
    },
    {
      id: 'c4',
      topicId: 't2',
      name: 'Оплата',
      description: 'Вопросы по оплате',
      assignedStaff: ['u6'],
    },
    {
      id: 'c5',
      topicId: 't2',
      name: 'Возвраты',
      description: 'Запросы на возврат средств',
      assignedStaff: ['u6'],
    },
    {
      id: 'c6',
      topicId: 't3',
      name: 'Консультации',
      description: 'Консультации по продуктам',
      assignedStaff: ['u2', 'u6'],
    },
  ],

  search: '',
  statusFilter: 'all',
  topicFilter: 'all',
  categoryFilter: 'all',
  assigneeFilter: 'all',
  sortField: 'updatedAt',
  sortDir: 'desc',

  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTopicFilter: (topicFilter) => set({ topicFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setAssigneeFilter: (assigneeFilter) => set({ assigneeFilter }),
  setSortField: (sortField) => set({ sortField }),
  setSortDir: (sortDir) => set({ sortDir }),

  clearFilters: () =>
    set({
      search: '',
      statusFilter: 'all',
      topicFilter: 'all',
      categoryFilter: 'all',
      assigneeFilter: 'all',
    }),

  toggleSort: (field) => {
    const { sortField, sortDir } = get();
    if (sortField === field) {
      set({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortField: field, sortDir: 'desc' });
    }
  },
}));
