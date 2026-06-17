'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import type { AdminUserDashboardResponse } from '@/types/dashboard';

/* ── Determine icon + color from action text ── */
function getActivityIcon(action: string): { icon: string; color: string; bg: string } {
  const lower = action.toLowerCase();
  if (
    lower.includes('transaksi') ||
    lower.includes('#trx')
  ) {
    return { icon: 'receipt_long', color: '#3b82f6', bg: '#eff6ff' };
  }
  if (
    lower.includes('disetujui') ||
    lower.includes('setuju') ||
    lower.includes('approve')
  ) {
    return { icon: 'task_alt', color: '#22c55e', bg: '#f0fdf4' };
  }
  // default: tenant/building
  return { icon: 'apartment', color: '#6046f4', bg: '#f3f0ff' };
}

/* ── Props ── */
interface AdminUserActivityFeedProps {
  activities?: AdminUserDashboardResponse['activity'];
}

export default function AdminUserActivityFeed({ activities }: AdminUserActivityFeedProps) {
  const items = activities ?? [];

  return (
    <Card
      sx={{
        p: '22px',
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 10px 24px rgba(30, 41, 59, 0.06)',
        bgcolor: '#fff',
        mb: 3,
      }}
    >
      {/* ── Header ── */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: '#1e293b',
          mb: 2,
        }}
      >
        Aktivitas Tenant
      </Typography>

      {/* ── Empty state ── */}
      {(!items || items.length === 0) ? (
        <Box
          sx={{
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b8fa3',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 8 }}>
            inbox
          </span>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            Belum ada aktivitas
          </Typography>
        </Box>
      ) : (
        /* ── Activity list ── */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.slice(0, 5).map((item, idx) => {
            const { icon, color, bg } = getActivityIcon(item.action);
            const isLast = idx === Math.min(items.length, 5) - 1;

            return (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  py: 1.5,
                  borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                  borderRadius: '10px',
                  px: 1,
                  mx: -1,
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                  },
                }}
              >
                {/* Icon bubble */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: bg,
                    color,
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </Box>

                {/* Content */}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#1e293b',
                      lineHeight: 1.3,
                      mb: 0.25,
                    }}
                  >
                    {item.tenant_name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: '#64748b',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.action}
                  </Typography>
                </Box>

                {/* Time ago */}
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: '#94a3b8',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {item.time_ago}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Card>
  );
}
