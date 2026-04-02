export type UserRole = 'ADMIN' | 'SUPPORT' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  categoryIds?: string[];
  notificationChannels?: {
    email: boolean;
    telegram: boolean;
  };
}
