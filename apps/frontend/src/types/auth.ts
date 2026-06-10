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
