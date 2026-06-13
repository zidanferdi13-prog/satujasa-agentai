'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { UserRole } from '@/types/auth';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import type { RoleMenuItem } from './types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f6f8' }}>
      <DashboardSidebar
        role={role}
        items={menuItems}
        currentPath={pathname}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          ml: { lg: '280px' },
        }}
      >
        <DashboardTopBar
          title={title}
          user={user}
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <Box sx={{ flex: 1, p: { xs: 2, md: 4, lg: 5 } }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Card sx={{ minHeight: 500, overflow: 'hidden' }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                {children}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
