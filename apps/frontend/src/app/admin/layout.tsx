import RoleDashboardShell from '@/components/dashboard/RoleDashboardShell';
import { roleMenus } from '@/components/dashboard/menuConfig';
import RoleGuard from '@/components/guards/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="ADMIN">
      <RoleDashboardShell role="ADMIN" menuItems={roleMenus.ADMIN}>
        {children}
      </RoleDashboardShell>
    </RoleGuard>
  );
}
