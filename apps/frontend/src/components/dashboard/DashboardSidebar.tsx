'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import icon from '../../../assets/icon.png';
import { removeToken } from '@/lib/auth';
import type { UserRole } from '@/types/auth';
import { roleLabels } from './menuConfig';
import type { RoleMenuItem } from './types';

type DashboardSidebarProps = {
  role: UserRole;
  items: RoleMenuItem[];
  currentPath: string;
  open: boolean;
  onClose: () => void;
};

function isActiveItem(item: RoleMenuItem, currentPath: string) {
  return currentPath === item.href;
}

function getRoleHome(role: UserRole) {
  return `/${role === 'USER_ADMIN' ? 'user-admin' : role.toLowerCase()}`;
}

function SidebarContent({ role, items, currentPath, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  function handleSignOut() {
    removeToken();
    queryClient.clear();
    onClose();
    router.replace('/auth/signin');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        bgcolor: '#ffffff',
        borderRight: '1px solid',
        borderColor: '#d0d4e4',
        p: 2,
      }}
    >
      <Link
        href={getRoleHome(role)}
        onClick={onClose}
        style={{ textDecoration: 'none' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1.5, mb: 3, mt: 1 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, overflow: 'hidden', flexShrink: 0 }}>
            <Image src={icon} alt="" width={36} height={36} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#333333', lineHeight: 1.2 }}>
              STNK SatuJasa
            </Typography>
            <Typography sx={{ fontSize: 10, color: '#808080', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Operational Command
            </Typography>
          </Box>
        </Box>
      </Link>

      <Box component="nav" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ px: 2.5, pb: 1, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#808080' }}>
          Navigasi
        </Typography>

        {items.map((item) => {
          const active = isActiveItem(item, currentPath);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderRadius: 8,
                padding: '10px 16px',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: active ? '#e7ecff' : 'transparent',
                color: active ? '#6161ff' : '#535768',
                transition: 'all 0.15s',
              }}
            >
              {item.icon && (
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{item.icon}</span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <Box sx={{ ml: 'auto', borderRadius: '9999px', bgcolor: '#6161ff', color: '#ffffff', px: 1, py: 0.25, fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </Box>
              )}
            </Link>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: '#d0d4e4', bgcolor: '#f5f6f8', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#6161ff' }}>shield</span>
            <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#333333' }}>
              Secure Panel
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 11, color: '#808080', lineHeight: 1.5 }}>
            Akses menu mengikuti role aktif dan tetap berada dalam area kerja dashboard.
          </Typography>
        </Box>

        <button
          type="button"
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 8,
            padding: '10px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#b3261e',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          Keluar
        </button>
      </Box>
    </Box>
  );
}

export default function DashboardSidebar(props: DashboardSidebarProps) {
  return (
    <>
      <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 280, flexShrink: 0, position: 'fixed', left: 0, top: 0, zIndex: 50, height: '100vh' }}>
        <SidebarContent {...props} />
      </Box>

      {/* Mobile overlay */}
      <Box
        onClick={props.onClose}
        aria-hidden="true"
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          bgcolor: 'rgba(51,51,51,0.45)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s',
          opacity: props.open ? 1 : 0,
          pointerEvents: props.open ? 'auto' : 'none',
          display: { lg: 'none' },
        }}
      />

      {/* Mobile drawer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: 'min(280px, 88vw)',
          transition: 'transform 0.3s',
          transform: props.open ? 'translateX(0)' : 'translateX(-100%)',
          display: { lg: 'none' },
        }}
      >
        <SidebarContent {...props} />
      </Box>
    </>
  );
}
