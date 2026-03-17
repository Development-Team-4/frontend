import { create } from 'zustand';
import { IStore } from '../types/store';
import { User } from '@/entities/user/types';
import { Category } from '@/entities/category/types';
import { Notification } from '@/lib/types';
import { MessageSquare, RefreshCw, UserPlus } from 'lucide-react';
import { Topic } from '@/entities/topic/types';

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

  topics: [
    {
      id: 't1',
      name: 'Техническая поддержка',
      description: 'Вопросы по работе системы',
    },
    {
      id: 't2',
      name: 'Биллинг и оплата',
      description: 'Вопросы по оплате и счетам',
    },
    {
      id: 't3',
      name: 'Продукты и услуги',
      description: 'Информация о продуктах',
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

  notifications: [
    {
      id: 'n1',
      type: 'COMMENT',
      title: 'Новый комментарий в TK-1001',
      message: 'Дмитрий Соколов: Фикс на код-ревью...',
      ticketId: 'TK-1001',
      read: false,
      createdAt: '2026-02-28T16:30:00Z',
    },
    {
      id: 'n2',
      type: 'STATUS_CHANGE',
      title: 'Статус изменён: TK-1006',
      message: "Тикет TK-1006 переведён в статус 'Решён'",
      ticketId: 'TK-1006',
      read: false,
      createdAt: '2026-02-26T14:00:00Z',
    },
    {
      id: 'n3',
      type: 'ASSIGNMENT',
      title: 'Назначен: TK-1004',
      message: 'Вам назначен тикет TK-1004',
      ticketId: 'TK-1004',
      read: true,
      createdAt: '2026-02-25T16:10:00Z',
    },
    {
      id: 'n4',
      type: 'COMMENT',
      title: 'Новый комментарий в TK-1003',
      message: 'Мария Иванова: Нашла проблему...',
      ticketId: 'TK-1003',
      read: true,
      createdAt: '2026-02-28T11:00:00Z',
    },
    {
      id: 'n5',
      type: 'STATUS_CHANGE',
      title: 'TK-1007 Решён',
      message: 'Тикет TK-1007 был решён Марией Ивановой',
      ticketId: 'TK-1007',
      read: true,
      createdAt: '2026-02-25T10:00:00Z',
    },
  ],

  search: '',
  statusFilter: 'all',
  topicFilter: 'all',
  categoryFilter: 'all',
  assigneeFilter: 'all',
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

  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTopicFilter: (topicFilter) => set({ topicFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setAssigneeFilter: (assigneeFilter) => set({ assigneeFilter }),
  setSortField: (sortField) => set({ sortField }),
  setSortDir: (sortDir) => set({ sortDir }),
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

  getCategoriesByTopicId(topicId: string): Category[] {
    return get().categories.filter((c) => c.topicId === topicId);
  },

  getStaffForCategory(categoryId: string): User[] {
    const category = get().getCategoryById(categoryId);
    if (!category) return [];
    return get().users.filter((u) => category.assignedStaff.includes(u.id));
  },

  getCategoryById(id: string): Category | undefined {
    return get().categories.find((c) => c.id === id);
  },
}));
