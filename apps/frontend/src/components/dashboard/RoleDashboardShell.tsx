'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { UserRole } from '@/types/auth';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import type { RoleMenuItem } from './types';

type RoleDashboardShellProps = {
  role: UserRole;
  menuItems: RoleMenuItem[];
  children: React.ReactNode;
};

function titleFromSegment(segment: string) {
  if (!segment) return 'Dashboard';
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPageTitle(pathname: string, menuItems: RoleMenuItem[]) {
  const menuMatches = menuItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length);

  if (menuMatches[0]) return menuMatches[0].label;

  const lastSegment = pathname.split('/').filter(Boolean).at(-1) || '';
  return titleFromSegment(lastSegment);
}

export default function RoleDashboardShell({ role, menuItems, children }: RoleDashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const title = useMemo(() => getPageTitle(pathname, menuItems), [pathname, menuItems]);

  return (
    <div className="min-h-screen bg-surface text-on-surface landing-texture">
      <DashboardSidebar
        role={role}
        items={menuItems}
        currentPath={pathname}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-h-screen flex-col lg:ml-[280px]">
        <DashboardTopBar
          title={title}
          user={user}
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="mx-auto max-w-6xl">
            <section className="glass-card relative min-h-[500px] overflow-hidden rounded-2xl p-6 shadow-sm md:p-10">
              <div className="pointer-events-none absolute right-0 top-0 p-8 text-primary opacity-[0.04]">
                <span className="material-symbols-outlined text-[160px]">admin_panel_settings</span>
              </div>
              <div className="relative z-10">{children}</div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
