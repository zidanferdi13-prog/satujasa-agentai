import type { UserRole } from '@/types/auth';

const ROLE_ROUTES: Record<UserRole, string> = {
  ADMIN: '/admin',
  OWNER: '/owner',
  USER_ADMIN: '/user-admin',
};

export function getRoleRedirect(role: UserRole): string {
  return ROLE_ROUTES[role] ?? '/auth/signin';
}
