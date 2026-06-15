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
        overflow: 'hidden',
        bgcolor: 'rgba(255,255,255,0.96)',
        borderRight: '1px solid #e5e9f3',
        boxShadow: '4px 0 24px rgba(30, 41, 59, 0.04)',
        p: 2.5,
      }}
    >
      <Link
        href={getRoleHome(role)}
        onClick={onClose}
        style={{ textDecoration: 'none' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1.5, mb: 3, mt: 0.5 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: '13px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(79, 70, 229, 0.1)', boxShadow: '0 2px 8px rgba(79, 70, 229, 0.06)' }}>
            <Image src={icon} alt="" width={42} height={42} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#1d2433', lineHeight: 1.2 }}>
              STNK SatuJasa
            </Typography>
            <Typography sx={{ fontSize: 10, color: '#8a91a3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Operational Command
            </Typography>
          </Box>
        </Box>
      </Link>

      <Box component="nav" sx={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                borderRadius: 12,
                padding: '12px 18px',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                background: active ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: active ? '#ffffff' : '#535768',
                transition: 'all 0.2s',
                boxShadow: active ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
              }}
            >
              {item.icon && (
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: active ? '#ffffff' : '#8a91a3' }}>{item.icon}</span>
              )}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <Box sx={{ ml: 'auto', borderRadius: '9999px', bgcolor: active ? 'rgba(255,255,255,0.25)' : '#6161ff', color: '#ffffff', px: 1.25, py: 0.3, fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </Box>
              )}
            </Link>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid rgba(79, 70, 229, 0.08)',
            background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
            p: 2,
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(79, 70, 229, 0.1)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#4f46e5' }}>shield</span>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#1d2433' }}>
              Secure Panel
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, mb: 1 }}>
            Akses menu mengikuti role aktif dan tetap berada dalam area kerja dashboard.
          </Typography>
          <Link
            href="#"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#4f46e5',
              textDecoration: 'none',
            }}
          >
            Pelajari lebih lanjut →
          </Link>
        </Box>

        <button
          type="button"
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderRadius: '12px',
            padding: '12px 18px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
            e.currentTarget.style.borderColor = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#fecaca';
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
          bgcolor: 'rgba(29, 36, 51, 0.5)',
          backdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          width: 'min(300px, 88vw)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: props.open ? 'translateX(0)' : 'translateX(-100%)',
          display: { lg: 'none' },
        }}
      >
        <SidebarContent {...props} />
      </Box>
    </>
  );
}
