import { api } from '@/shared/api/client';
import type { User } from '@/shared/types';

class UsersDataApi {
  private baseUrl = 'users';

  async getUserData(): Promise<User> {
    return api.get<User>(`${this.baseUrl}/me`).then((res) => res.data);
  }
}

export const usersDataApi = new UsersDataApi();
