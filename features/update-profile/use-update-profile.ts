import { User } from '@/entities/user/types';

export const useUpdateProfile = () => {
  const users: User[] = [
    {
      id: 'u1',
      name: 'Alexei Petrov',
      email: 'a.petrov@corp.com',
      role: 'ADMIN',
    },
    {
      id: 'u2',
      name: 'Maria Ivanova',
      email: 'm.ivanova@corp.com',
      role: 'AGENT',
    },
    {
      id: 'u3',
      name: 'Dmitry Sokolov',
      email: 'd.sokolov@corp.com',
      role: 'AGENT',
    },
    {
      id: 'u4',
      name: 'Elena Kuznetsova',
      email: 'e.kuznetsova@corp.com',
      role: 'USER',
    },
    {
      id: 'u5',
      name: 'Nikolai Volkov',
      email: 'n.volkov@corp.com',
      role: 'USER',
    },
    {
      id: 'u6',
      name: 'Irina Smirnova',
      email: 'i.smirnova@corp.com',
      role: 'AGENT',
    },
  ];

  const currentUser: User = users[0];

  return {
    currentUser,
  };
};
