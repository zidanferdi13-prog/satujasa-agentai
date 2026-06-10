import type { UserRole } from '@/types/auth';

export type RoleMenuItem = {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: RoleMenuItem[];
};

export type DashboardRole = UserRole;
