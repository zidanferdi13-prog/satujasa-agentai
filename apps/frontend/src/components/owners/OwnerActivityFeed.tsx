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
    <Card sx={{ borderRadius: '22px', border: '1px solid #e8eaf0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f0f1f5' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#1a1d2e' }}>Aktivitas Terbaru</Typography>
      </Box>

      <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
        {displayItems.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#a0a4b8', fontSize: 13 }}>Belum ada aktivitas</Typography>
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
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderBottom: i < displayItems.length - 1 ? '1px solid #f5f6f8' : 'none',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: '#fafbfd' },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: cfg.bg,
                    color: cfg.color,
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{cfg.icon}</span>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#2d3142', lineHeight: 1.5 }}>
                    {item.description}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#a0a4b8', mt: 0.25 }}>
                    {formatRelative(item.created_at)}
                  </Typography>
                </Box>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#c8cad4', flexShrink: 0, mt: 0.5 }}>
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
