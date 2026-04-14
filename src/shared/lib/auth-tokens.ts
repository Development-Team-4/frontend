export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  const value = match.slice(name.length + 1);
  return value ? decodeURIComponent(value) : null;
}

function setCookieValue(name: string, value: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

function clearCookieValue(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function setAuthTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  setCookieValue(ACCESS_TOKEN_KEY, tokens.accessToken);
  setCookieValue(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  clearCookieValue(ACCESS_TOKEN_KEY);
  clearCookieValue(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  const tokenFromCookie = getCookieValue(ACCESS_TOKEN_KEY);
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  if (typeof window !== 'undefined') {
    const tokenFromLocalStorage = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (tokenFromLocalStorage) {
      return tokenFromLocalStorage;
    }
  }

  return null;
}

export function getRefreshToken(): string | null {
  const tokenFromCookie = getCookieValue(REFRESH_TOKEN_KEY);
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  if (typeof window !== 'undefined') {
    const tokenFromLocalStorage = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (tokenFromLocalStorage) {
      return tokenFromLocalStorage;
    }
  }

  return null;
}
