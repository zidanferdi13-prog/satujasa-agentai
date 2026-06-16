'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import StatusPill from '@/components/shared/StatusPill';

interface SubscriptionData {
  tier: string;
  display_name: string;
  max_tenants: number;
  max_admin_users: number;
  current_tenants: number;
  current_admin_users: number;
  activated_at: string | null;
  expires_at: string | null;
}

interface OwnerSubscriptionProps {
  subscription?: SubscriptionData;
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function UsageBar({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isNearLimit = pct >= 80;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#6b7084' }}>{label}</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: isNearLimit ? '#ef4444' : '#1a1d2e' }}>
          {current}/{max}
        </Typography>
      </Box>
      <Box sx={{ height: 8, borderRadius: '4px', bgcolor: '#f0f1f5', overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '4px',
            bgcolor: isNearLimit ? '#ef4444' : color,
            transition: 'width 0.5s ease',
          }}
        />
      </Box>
    </Box>
  );
}

export default function OwnerSubscription({ subscription }: OwnerSubscriptionProps) {
  const sub = subscription ?? {
    tier: 'business',
    display_name: 'Business',
    max_tenants: 10,
    max_admin_users: 20,
    current_tenants: 7,
    current_admin_users: 12,
    activated_at: '2026-01-01T00:00:00Z',
    expires_at: '2026-07-17T00:00:00Z',
  };

  const daysLeft = daysUntil(sub.expires_at);

  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f0eeff',
              color: '#6254f3',
            }}
          >
            <span className="material-symbols-outlined">workspace_premium</span>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1a1d2e' }}>{sub.display_name ?? '—'}</Typography>
            <StatusPill status="Aktif" variant="success" />
          </Box>
        </Box>
      </Box>

      {daysLeft !== null && (
        <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '12px', bgcolor: daysLeft <= 7 ? '#fff4e6' : '#e6faf8' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: daysLeft <= 7 ? '#f6a326' : '#22c7b8' }}>
            {daysLeft <= 7 ? `⚠️ Berakhir dalam ${daysLeft} hari` : `✅ Berakhir dalam ${daysLeft} hari`}
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#8b8fa3', mt: 0.25 }}>
            {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </Typography>
        </Box>
      )}

      <UsageBar label="Tenant" current={sub.current_tenants ?? 0} max={sub.max_tenants ?? 0} color="#6254f3" />
      <UsageBar label="Admin User" current={sub.current_admin_users ?? 0} max={sub.max_admin_users ?? 0} color="#2388ff" />

      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 1,
          borderRadius: '12px',
          bgcolor: '#6254f3',
          '&:hover': { bgcolor: '#5244d3' },
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Kelola Langganan
      </Button>
    </Card>
  );
}
