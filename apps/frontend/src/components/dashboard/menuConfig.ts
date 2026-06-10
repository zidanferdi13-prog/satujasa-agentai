import type { UserRole } from '@/types/auth';
import type { RoleMenuItem } from './types';

export const roleMenus: Record<UserRole, RoleMenuItem[]> = {
  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Manage Owners', href: '/admin/owners', icon: 'admin_panel_settings' },
    { label: 'Pengguna', href: '/admin/pengguna', icon: 'group' },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: 'settings' },
  ],
  OWNER: [
    { label: 'Dashboard', href: '/owner', icon: 'dashboard' },
    { label: 'Tenant Saya', href: '/owner/tenant', icon: 'store' },
    { label: 'Admin User', href: '/owner/admin-users', icon: 'manage_accounts' },
    { label: 'Bisnis', href: '/owner/bisnis', icon: 'storefront' },
    { label: 'Laporan', href: '/owner/laporan', icon: 'monitoring' },
  ],
  USER_ADMIN: [
    { label: 'Dashboard', href: '/user-admin', icon: 'dashboard' },
    { label: 'Transaksi', href: '/user-admin/transaksi', icon: 'receipt_long' },
    { label: 'Tim', href: '/user-admin/tim', icon: 'groups' },
    { label: 'Permintaan', href: '/user-admin/permintaan', icon: 'assignment' },
  ],
};

export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Admin',
  OWNER: 'Owner',
  USER_ADMIN: 'User Admin',
};
