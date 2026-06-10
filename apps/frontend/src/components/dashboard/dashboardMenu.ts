import type { UserRole } from '@/types/auth';

export type DashboardMenuItem = {
  label: string;
  href: string;
  icon: string;
};

export const dashboardMenus: Record<UserRole, DashboardMenuItem[]> = {
  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Manajemen Owner', href: '/admin/owners', icon: 'supervisor_account' },
    { label: 'Manajemen Paket', href: '/admin/plans', icon: 'inventory_2' },
    { label: 'Laporan Platform', href: '/admin/reports', icon: 'monitoring' },
    { label: 'Pengaturan', href: '/admin/settings', icon: 'settings' },
  ],
  OWNER: [
    { label: 'Dashboard', href: '/owner', icon: 'dashboard' },
    { label: 'Cabang', href: '/owner/branches', icon: 'store' },
    { label: 'Admin Cabang', href: '/owner/admins', icon: 'badge' },
    { label: 'Transaksi', href: '/owner/transactions', icon: 'receipt_long' },
    { label: 'Laporan Bisnis', href: '/owner/reports', icon: 'query_stats' },
  ],
  USER_ADMIN: [
    { label: 'Dashboard', href: '/user-admin', icon: 'dashboard' },
    { label: 'Input Transaksi', href: '/user-admin/transactions/new', icon: 'add_circle' },
    { label: 'Data Transaksi', href: '/user-admin/transactions', icon: 'list_alt' },
    { label: 'Tracking Dokumen', href: '/user-admin/tracking', icon: 'route' },
    { label: 'Pelanggan', href: '/user-admin/customers', icon: 'groups' },
  ],
};

export const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Super Admin',
  OWNER: 'Owner',
  USER_ADMIN: 'Admin User',
};
