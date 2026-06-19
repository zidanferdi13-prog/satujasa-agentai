'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { User, UserRole } from '@/types/auth';
import { roleLabels } from './menuConfig';

type DashboardTopBarProps = {
  title: string;
  user?: User | null;
  role: UserRole;
  onMenuClick: () => void;
};

const roleBadgeColors: Record<UserRole, { bg: string; text: string }> = {
  ADMIN: { bg: '#e7ecff', text: '#6161ff' },
  OWNER: { bg: '#e0fbf6', text: '#00a889' },
  USER_ADMIN: { bg: '#fff5cc', text: '#b38a00' },
};

function getInitials(user?: User | null) {
  const source = user?.name || user?.email || 'SatuJasa';
  const words = source.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase()).join('') || 'SA';
}

export default function DashboardTopBar({ title, user, role, onMenuClick }: DashboardTopBarProps) {
  const displayName = user?.name || 'Super Admin';
  const email = user?.email || 'superadmin@satujasa.id';
  const badge = roleBadgeColors[role];

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e9f3',
        // bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        px: { xs: 2, md: 5 },
      }}
    >
      {/* Left — mobile hamburger + page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
        <Box
          component="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          sx={{
            display: { xs: 'flex', lg: 'none' },
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: '12px',
            border: '1px solid #e5e9f3',
            bgcolor: 'transparent',
            color: '#535768',
            cursor: 'pointer',
            transition: 'all 0.15s',
            '&:hover': {
              bgcolor: '#f8f9fc',
              borderColor: '#d0d4e4',
            },
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 22 }}>menu</span>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#808080' }}>
              Workspace
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#808080' }}>/</Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5' }}>
              {roleLabels[role]}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 18, md: 22 },
              fontWeight: 800,
              color: '#1d2433',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: '#8a91a3',
              fontWeight: 400,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: { xs: 'none', md: 'block' },
            }}
          >
            Monitor performa platform dan kelola sistem dari satu pusat kendali.
          </Typography>
        </Box>
      </Box>

      {/* Right — search + avatar + notification */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 } }}>
        {/* Search bar - hidden on mobile */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            px: 2.5,
            py: 1.25,
            borderRadius: '14px',
            border: '1px solid #e5e9f3',
            bgcolor: '#f8f9fc',
            minWidth: 280,
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#d0d4e4',
              bgcolor: '#ffffff',
            },
            '&:focus-within': {
              borderColor: '#4f46e5',
              bgcolor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
            },
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 20, color: '#8a91a3' }}>
            search
          </span>
          <input
            type="text"
            aria-label="Cari menu, data, atau perintah"
            placeholder="Cari menu, data, atau perintah..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: 500,
              color: '#1d2433',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
        </Box>

        <Box
          component="button"
          aria-label="Notifikasi"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: '12px',
            border: '1px solid #e5e9f3',
            bgcolor: 'transparent',
            color: '#535768',
            cursor: 'pointer',
            transition: 'all 0.15s',
            '&:hover': {
              bgcolor: '#f8f9fc',
              borderColor: '#d0d4e4',
            },
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 22 }}>notifications</span>
          <Box aria-hidden="true" sx={{ position: 'absolute', top: 8, right: 8, width: 9, height: 9, borderRadius: '50%', bgcolor: '#ef4444', border: '2px solid', borderColor: '#ffffff' }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderRadius: '14px',
            border: '1px solid #e5e9f3',
            px: 2,
            py: 1,
            bgcolor: 'rgba(255,255,255,0.94)',
            transition: 'all 0.15s',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
            }}
          >
            {getInitials(user)}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mb: 0.25 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#1d2433', lineHeight: 1.2 }}>
                {displayName}
              </Typography>
              <Box
                sx={{
                  borderRadius: 6,
                  px: 1.5,
                  py: 0.3,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  bgcolor: badge.bg,
                  color: badge.text,
                  border: `1px solid ${badge.text}20`,
                }}
              >
                {roleLabels[role]}
              </Box>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#8a91a3', fontWeight: 500, lineHeight: 1.3 }}>
              {email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
