export type BackendRole = 'super-admin' | 'owner' | 'admin-user';
export type UserRole = 'ADMIN' | 'OWNER' | 'USER_ADMIN';

export function toFrontendRole(role: BackendRole): UserRole {
  const map: Record<BackendRole, UserRole> = {
    'super-admin': 'ADMIN',
    'owner': 'OWNER',
    'admin-user': 'USER_ADMIN',
  };
  return map[role];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface BackendUser {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role: BackendRole | UserRole;
  tenant_id?: string | null;
  owner_id?: string | null;
}

export function normalizeUser(user: BackendUser): User {
  const role = user.role as string;
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email,
    role: role === 'super-admin' || role === 'owner' || role === 'admin-user'
      ? toFrontendRole(role as BackendRole)
      : user.role as UserRole,
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phone: string;
    role: BackendRole;
    tenant_id?: string | null;
  };
}
