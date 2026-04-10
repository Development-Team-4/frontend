import api from '@/shared/api/client';

class RegistrationApi {
  private baseUrl = 'auth';

  async registration(userData: {
    userName: string;
    userEmail: string;
    userPassword: string;
  }) {
    return api.post(`${this.baseUrl}/register`, userData);
  }
}

export const regApi = new RegistrationApi();
