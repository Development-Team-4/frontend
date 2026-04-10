import api from '@/shared/api/client';

class LoginApi {
  private baseUrl = 'auth';

  async login(userData: { userEmail: string; userPassword: string }) {
    return api.post(`${this.baseUrl}/login`, userData);
  }
}

export const loginApi = new LoginApi();
