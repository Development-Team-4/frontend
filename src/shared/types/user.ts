export type UserRole = 'ADMIN' | 'SUPPORT' | 'USER';

export interface User {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userAvatar?: string;
  userCreatedAt?: string;
  categoryIds?: string[];
  notificationChannels?: {
    email: boolean;
    telegram: boolean;
  };
}
