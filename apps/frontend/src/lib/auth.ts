import type { User } from '@/types/auth';

const TOKEN_KEY = 'satujasa_token';
const USER_KEY = 'satujasa_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function removeToken(): void {
  clearAuthStorage();
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function handleUnauthorizedRedirect(): void {
  clearAuthStorage();
  if (typeof window === 'undefined') return;

  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const params = new URLSearchParams();
  if (next && next !== '/auth/signin') {
    params.set('redirect', next);
  }

  const destination = params.toString() ? `/auth/signin?${params.toString()}` : '/auth/signin';
  if (window.location.pathname !== '/auth/signin') {
    window.location.replace(destination);
  }
}

export function getPostLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('redirect');
}

export function clearPostLoginRedirect(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('redirect');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export { TOKEN_KEY, USER_KEY };