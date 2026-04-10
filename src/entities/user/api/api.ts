import { api } from '@/shared/api/client';
import type { User } from '@/shared/types';

interface UpdateUserRolePayload {
  userRole: 'SUPPORT' | 'USER' | 'ADMIN';
}
interface UpdateUserProfilePayload {
  userName: string;
}
interface CreateUserPayload {
  userName: string;
  userEmail: string;
  userPassword: string;
}

class UsersDataApi {
  private baseUrl = 'users';
  private authBaseUrl = 'auth';

  async getUserData(): Promise<User> {
    return api.get<User>(`${this.baseUrl}/me`).then((res) => res.data);
  }

  async getUserById(id: string): Promise<User> {
    return api.get<User>(`${this.baseUrl}/${id}`).then((res) => res.data);
  }

  async getAllUsers(): Promise<User[]> {
    return api.get<User[]>(`${this.baseUrl}`).then((res) => res.data);
  }

  async createUser(payload: CreateUserPayload): Promise<void> {
    await api.post(`${this.authBaseUrl}/register`, payload);
  }

  async updateUserRole(
    userId: string,
    userRole: UpdateUserRolePayload['userRole'],
  ) {
    return api
      .patch<User>(`${this.baseUrl}/${userId}/role`, { userRole })
      .then((res) => res.data);
  }

  async updateUserProfile(
    id: string,
    payload: UpdateUserProfilePayload,
  ): Promise<User> {
    return api
      .put<User>(`${this.baseUrl}/${id}`, payload)
      .then((res) => res.data);
  }
}

export const usersDataApi = new UsersDataApi();
