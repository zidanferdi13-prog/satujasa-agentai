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
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: '#d0d4e4',
        bgcolor: '#ffffff',
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Left — mobile hamburger + page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
        <Box
          component="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          sx={{
            display: { xs: 'flex', lg: 'none' },
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '9999px',
            border: 'none',
            bgcolor: 'transparent',
            color: '#535768',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>menu</span>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#808080' }}>
              Workspace
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#808080' }}>/</Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6161ff' }}>
              {roleLabels[role]}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: { xs: 18, md: 22 },
              fontWeight: 800,
              color: '#333333',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Right — avatar + notification */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
        <Box
          component="button"
          aria-label="Notifikasi"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '9999px',
            border: 'none',
            bgcolor: 'transparent',
            color: '#535768',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>notifications</span>
          <Box sx={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '9999px', bgcolor: '#b3261e', border: '2px solid', borderColor: '#ffffff' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, border: '1px solid', borderColor: '#d0d4e4', px: 2, py: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#e7ecff',
              color: '#6161ff',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {getInitials(user)}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#333333' }}>
                {displayName}
              </Typography>
              <Box sx={{ borderRadius: '9999px', px: 1, py: 0.25, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', bgcolor: badge.bg, color: badge.text }}>
                {roleLabels[role]}
              </Box>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#808080', fontWeight: 500 }}>
              {email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
