'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

interface OwnerActivityFeedProps {
  activities?: ActivityItem[];
}

function getIconConfig(type: string): { icon: string; color: string; bg: string } {
  const t = type?.toLowerCase() ?? '';
  if (t.includes('tenant')) return { icon: 'apartment', color: '#6254f3', bg: '#f0eeff' };
  if (t.includes('admin')) return { icon: 'person', color: '#2388ff', bg: '#e8f4ff' };
  if (t.includes('transaction') || t.includes('transaksi')) return { icon: 'receipt_long', color: '#22c7b8', bg: '#e6faf8' };
  if (t.includes('subscription') || t.includes('langganan')) return { icon: 'workspace_premium', color: '#f6a326', bg: '#fff4e6' };
  return { icon: 'info', color: '#8b8fa3', bg: '#f4f5f8' };
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

export default function OwnerActivityFeed({ activities = [] }: OwnerActivityFeedProps) {
  const displayItems = activities.length > 0 ? activities : [
    { id: '1', type: 'tenant_created', description: 'Tenant baru "PT Maju Jaya" ditambahkan', created_at: new Date(Date.now() - 120000).toISOString() },
    { id: '2', type: 'admin_added', description: 'Admin user "Budi Santoso" ditambahkan ke tenant "CV Sejahtera"', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', type: 'transaction', description: 'Transaksi baru #STNK-2026-0042 dibuat', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', type: 'subscription', description: 'Subscription di-upgrade ke paket Business', created_at: new Date(Date.now() - 86400000).toISOString() },
  ];

  return (
    <Card sx={{ borderRadius: '22px', border: '1px solid #e5e9f3', boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)', background: 'rgba(255,255,255,0.94)', overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2.25, borderBottom: '1px solid #f0f1f5' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.25 }}>Aktivitas Terbaru</Typography>
        <Typography sx={{ fontSize: 13, color: '#8a91a3' }}>Log aktivitas real-time dari platform</Typography>
      </Box>

      <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
        {displayItems.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '22px', display: 'grid', placeItems: 'center', bgcolor: '#f0f1f5', mx: 'auto', mb: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#8a91a3' }}>history</span>
            </Box>
            <Typography sx={{ color: '#1d2433', fontSize: 16, fontWeight: 800, mb: 0.5 }}>Belum ada aktivitas</Typography>
            <Typography sx={{ color: '#8a91a3', fontSize: 13 }}>Aktivitas akan muncul di sini.</Typography>
          </Box>
        ) : (
          displayItems.map((item, i) => {
            const cfg = getIconConfig(item.type);
            return (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  px: 3,
                  py: 2,
                  borderBottom: i < displayItems.length - 1 ? '1px solid #f5f6f8' : 'none',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: '#f8f9fc' },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: cfg.bg,
                    color: cfg.color,
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{cfg.icon}</span>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d2433', lineHeight: 1.5, mb: 0.25 }}>
                    {item.description}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#8a91a3' }}>
                    {formatRelative(item.created_at)}
                  </Typography>
                </Box>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#c8cad4', flexShrink: 0, marginTop: 2 }}>
                  chevron_right
                </span>
              </Box>
            );
          })
        )}
      </Box>
    </Card>
  );
}
