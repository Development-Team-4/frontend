import api from '@/shared/api/client';

class LogoutApi {
  private baseUrl = 'auth';

  async logout({
    refreshToken,
    accessTokenJti,
  }: {
    refreshToken: string | null;
    accessTokenJti: string | undefined | null;
  }) {
    return api.post(`${this.baseUrl}/logout`, {
      refreshToken,
      accessTokenJti,
    });
  }
}

export const logoutApi = new LogoutApi();
