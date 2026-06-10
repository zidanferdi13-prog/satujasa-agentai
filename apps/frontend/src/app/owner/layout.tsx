import RoleDashboardShell from '@/components/dashboard/RoleDashboardShell';
import { roleMenus } from '@/components/dashboard/menuConfig';
import RoleGuard from '@/components/guards/RoleGuard';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="OWNER">
      <RoleDashboardShell role="OWNER" menuItems={roleMenus.OWNER}>
        {children}
      </RoleDashboardShell>
    </RoleGuard>
  );
}
