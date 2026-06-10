import RoleDashboardShell from '@/components/dashboard/RoleDashboardShell';
import { roleMenus } from '@/components/dashboard/menuConfig';
import RoleGuard from '@/components/guards/RoleGuard';

export default function UserAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="USER_ADMIN">
      <RoleDashboardShell role="USER_ADMIN" menuItems={roleMenus.USER_ADMIN}>
        {children}
      </RoleDashboardShell>
    </RoleGuard>
  );
}
