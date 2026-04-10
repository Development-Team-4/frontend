import { Category, Comment, Notification, Ticket, User } from '../types';

export const users: User[] = [
  {
    userId: 'u1',
    userName: 'Алексей Петров',
    userEmail: 'a.petrov@corp.com',
    userRole: 'ADMIN',
    notificationChannels: { email: true, telegram: true },
  },
  {
    userId: 'u2',
    userName: 'Мария Иванова',
    userEmail: 'm.ivanova@corp.com',
    userRole: 'SUPPORT',
    categoryIds: ['c1', 'c2', 'c6'],
    notificationChannels: { email: true, telegram: false },
  },
  {
    userId: 'u3',
    userName: 'Дмитрий Соколов',
    userEmail: 'd.sokolov@corp.com',
    userRole: 'SUPPORT',
    categoryIds: ['c1', 'c3'],
    notificationChannels: { email: true, telegram: true },
  },
  {
    userId: 'u4',
    userName: 'Елена Кузнецова',
    userEmail: 'e.kuznetsova@corp.com',
    userRole: 'USER',
    notificationChannels: { email: true, telegram: false },
  },
  {
    userId: 'u5',
    userName: 'Николай Волков',
    userEmail: 'n.volkov@corp.com',
    userRole: 'USER',
    notificationChannels: { email: false, telegram: true },
  },
  {
    userId: 'u6',
    userName: 'Ирина Смирнова',
    userEmail: 'i.smirnova@corp.com',
    userRole: 'SUPPORT',
    categoryIds: ['c3', 'c4', 'c5', 'c6'],
    notificationChannels: { email: true, telegram: true },
  },
];

export const topics = [
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
];

export const categories: Category[] = [
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
];

export const tickets: Ticket[] = [
  {
    id: 'TK-1001',
    subject: 'Страница входа возвращает ошибку 500',
    description:
      'После последнего обновления страница входа постоянно выдаёт ошибку 500. Проблема началась примерно в 14:00 UTC. В логах сервера видно NullPointerException в AuthenticationController.',
    status: 'IN_WORK',
    categoryId: 'c3',
    createdAt: '2026-02-28T14:05:00Z',
    updatedAt: '2026-02-28T16:30:00Z',
    createdBy: users[3],
    assignee: users[2],
  },
  {
    id: 'TK-1002',
    subject: 'Добавить тёмную тему для дашборда',
    description:
      'Пользователи просят добавить поддержку тёмной темы для главной панели. Нужно реализовать переключение тем с использованием CSS-переменных.',
    status: 'CREATED',
    categoryId: 'c1',
    createdAt: '2026-02-27T10:00:00Z',
    updatedAt: '2026-02-27T10:00:00Z',
    createdBy: users[4],
  },
  {
    id: 'TK-1003',
    subject: 'Кэш Redis не очищается при обновлении профиля',
    description:
      'Кэш Redis не обновляется корректно при изменении профиля пользователя. Устаревшие данные отображаются до 30 минут после изменений.',
    status: 'IN_WORK',
    categoryId: 'c2',
    createdAt: '2026-02-26T09:15:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
    createdBy: users[1],
    assignee: users[1],
  },
  {
    id: 'TK-1004',
    subject: 'Не приходят письма для сброса пароля',
    description:
      'Несколько пользователей сообщили, что функция сброса пароля не отправляет письма. Проблема может быть связана с изменением конфигурации SMTP.',
    status: 'IN_WORK',
    categoryId: 'c3',
    createdAt: '2026-02-25T16:00:00Z',
    updatedAt: '2026-02-27T09:30:00Z',
    createdBy: users[4],
    assignee: users[5],
  },
  {
    id: 'TK-1005',
    subject: 'Вопрос по оплате подписки',
    description:
      'Здравствуйте! Хотел бы уточнить возможность оплаты годовой подписки с рассрочкой на 3 месяца. Есть ли такая опция?',
    status: 'CREATED',
    categoryId: 'c4',
    createdAt: '2026-02-28T08:00:00Z',
    updatedAt: '2026-02-28T08:00:00Z',
    createdBy: users[4],
  },
  {
    id: 'TK-1006',
    subject: 'Запрос на возврат средств',
    description:
      'Прошу оформить возврат средств за последний месяц подписки. Причина: не использовал сервис из-за командировки.',
    status: 'RESOLVED',
    categoryId: 'c5',
    createdAt: '2026-02-24T11:00:00Z',
    updatedAt: '2026-02-26T14:00:00Z',
    createdBy: users[4],
    assignee: users[5],
  },
  {
    id: 'TK-1007',
    subject: 'Миграция базы данных не прошла на staging',
    description:
      'Миграция Flyway V42 не прошла на staging-окружении из-за конфликта схемы. Нужно исправить перед следующим релизом.',
    status: 'RESOLVED',
    categoryId: 'c1',
    createdAt: '2026-02-23T13:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
    createdBy: users[2],
    assignee: users[2],
  },
  {
    id: 'TK-1008',
    subject: 'API возвращает неверный HTTP-код при rate limiting',
    description:
      'API rate limiter возвращает 403 Forbidden вместо 429 Too Many Requests при превышении лимита. Это вызывает проблемы с логикой повторных запросов на клиенте.',
    status: 'CLOSED',
    categoryId: 'c1',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-02-22T15:00:00Z',
    createdBy: users[4],
    assignee: users[1],
  },
  {
    id: 'TK-1009',
    subject: 'Grafana дашборды не показывают метрики',
    description:
      "После миграции Prometheus endpoint несколько дашбордов Grafana показывают 'No Data'. Проблема затрагивает JVM метрики и панели задержки запросов.",
    status: 'IN_WORK',
    categoryId: 'c2',
    createdAt: '2026-02-27T14:00:00Z',
    updatedAt: '2026-02-28T09:00:00Z',
    createdBy: users[0],
    assignee: users[1],
  },
  {
    id: 'TK-1010',
    subject: 'Консультация по интеграции API',
    description:
      'Хотел бы получить консультацию по интеграции вашего API с нашей CRM-системой. Какие есть варианты и ограничения?',
    status: 'CREATED',
    categoryId: 'c6',
    createdAt: '2026-02-28T07:00:00Z',
    updatedAt: '2026-02-28T07:00:00Z',
    createdBy: users[4],
  },
];

export const notifications: Notification[] = [
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
];

export const comments: Record<string, Comment[]> = {
  'TK-1001': [
    {
      id: 'c1',
      ticketId: 'TK-1001',
      author: users[2],
      content:
        'Смотрю проблему. Стектрейс указывает на null user context в session filter.',
      createdAt: '2026-02-28T14:22:00Z',
    },
    {
      id: 'c2',
      ticketId: 'TK-1001',
      author: users[2],
      content:
        'Нашёл причину: новый Redis session serializer некорректно обрабатывает legacy session tokens. Работаю над исправлением.',
      createdAt: '2026-02-28T15:45:00Z',
    },
    {
      id: 'c3',
      ticketId: 'TK-1001',
      author: users[0],
      content:
        'Сколько времени займёт исправление? Клиенты сообщают об этой проблеме.',
      createdAt: '2026-02-28T16:00:00Z',
    },
    {
      id: 'c4',
      ticketId: 'TK-1001',
      author: users[2],
      content: 'Фикс на код-ревью. ETA деплоя: ~30 минут.',
      createdAt: '2026-02-28T16:30:00Z',
    },
  ],
  'TK-1003': [
    {
      id: 'c5',
      ticketId: 'TK-1003',
      author: users[1],
      content:
        'Проверяю конфигурацию TTL. Похоже, аннотации @CacheEvict не срабатывают для endpoint обновления профиля.',
      createdAt: '2026-02-26T10:00:00Z',
    },
    {
      id: 'c6',
      ticketId: 'TK-1003',
      author: users[1],
      content:
        'Нашла проблему: прокси Spring Cache не перехватывает self-invocations внутри того же класса. Рефакторю кэш-слой.',
      createdAt: '2026-02-28T11:00:00Z',
    },
  ],
  'TK-1004': [
    {
      id: 'c7',
      ticketId: 'TK-1004',
      author: users[5],
      content:
        'SMTP credentials были обновлены, но не обновлены в Kubernetes secrets. Жду DevOps для обновления.',
      createdAt: '2026-02-25T17:15:00Z',
    },
    {
      id: 'c8',
      ticketId: 'TK-1004',
      author: users[5],
      content: 'Команда DevOps в отпуске до понедельника. Эскалирую тимлиду.',
      createdAt: '2026-02-27T09:30:00Z',
    },
  ],
  'TK-1006': [
    {
      id: 'c9',
      ticketId: 'TK-1006',
      author: users[5],
      content:
        'Заявка на возврат принята. Средства будут возвращены в течение 3-5 рабочих дней.',
      createdAt: '2026-02-25T10:00:00Z',
    },
    {
      id: 'c10',
      ticketId: 'TK-1006',
      author: users[4],
      content: 'Спасибо за оперативную обработку!',
      createdAt: '2026-02-26T14:00:00Z',
    },
  ],
};
