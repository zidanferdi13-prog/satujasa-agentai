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
  if (!subscription) {
    return (
      <Card sx={{ borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)', p: 3 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.25 }}>
            Subscription Plan
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>
            Paket langganan dan penggunaan resource
          </Typography>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 14, color: '#8a91a3' }}>Data subscription tidak tersedia.</Typography>
        </Box>
      </Card>
    );
  }

  const sub = subscription;

  const daysLeft = daysUntil(sub.expires_at ?? null);

  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)', p: 3 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.25 }}>
          Subscription Plan
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>
          Paket langganan dan penggunaan resource
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, p: 2.5, borderRadius: '16px', bgcolor: '#f8f9fc', border: '1px solid #eef0f6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6254f3 0%, #8b5cf6 100%)',
              color: 'white',
              boxShadow: '0 8px 16px rgba(98, 84, 243, 0.2)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>workspace_premium</span>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>{sub.display_name ?? '—'}</Typography>
            <StatusPill status="Aktif" variant="success" />
          </Box>
        </Box>
      </Box>

      {daysLeft !== null && (
        <Box
          sx={{
            mb: 3,
            p: 1.75,
            borderRadius: '14px',
            bgcolor: daysLeft <= 7 ? '#fff4e6' : '#e6faf8',
            border: '1px solid',
            borderColor: daysLeft <= 7 ? 'rgba(246, 163, 38, 0.3)' : 'rgba(34, 199, 184, 0.3)',
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: daysLeft <= 7 ? '#f6a326' : '#22c7b8', mb: 0.3 }}>
            {daysLeft <= 7 ? `⚠️ Berakhir dalam ${daysLeft} hari` : `✅ Berakhir dalam ${daysLeft} hari`}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#8a91a3' }}>
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
          mt: 2,
          borderRadius: '14px',
          bgcolor: '#6254f3',
          py: 1.5,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: 14,
          boxShadow: '0 8px 20px rgba(98, 84, 243, 0.25)',
          '&:hover': { bgcolor: '#5244d3', boxShadow: '0 10px 24px rgba(98, 84, 243, 0.3)' },
        }}
      >
        Kelola Langganan
      </Button>
    </Card>
  );
}
