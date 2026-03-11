import { User } from '@/entities/user/types';

export const useUpdateProfile = () => {
  const users: User[] = [
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
  ];

  const currentUser: User = users[0];

  return {
    currentUser,
  };
};
