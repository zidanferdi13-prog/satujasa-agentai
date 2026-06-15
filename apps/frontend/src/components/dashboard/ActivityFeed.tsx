'use client';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import type { ActivityItem } from '@/types/dashboard';

type ActivityFeedProps = {
  data?: ActivityItem[];
};

const TYPE_CONFIG: Record<
  ActivityItem['type'],
  { icon: string; color: string }
> = {
  owner_registered: { icon: 'person_add', color: '#4f46e5' },
  tenant_created: { icon: 'business', color: '#22c55e' },
  admin_added: { icon: 'group_add', color: '#8b5cf6' },
  owner_updated: { icon: 'edit', color: '#f59e0b' },
  system_updated: { icon: 'settings', color: '#6b7280' },
};

const DEFAULT_DATA: ActivityItem[] = [
  {
    id: '1',
    type: 'owner_registered',
    description: 'Pemilik Baru Terdaftar',
    detail: 'Budi Santoso mendaftar sebagai pemilik kendaraan',
    created_at: new Date().toISOString(),
    relative_time: '2 menit lalu',
  },
  {
    id: '2',
    type: 'tenant_created',
    description: 'Tenant Baru Dibuat',
    detail: 'PT Maju Jaya bergabung sebagai tenant',
    created_at: new Date().toISOString(),
    relative_time: '15 menit lalu',
  },
  {
    id: '3',
    type: 'admin_added',
    description: 'Admin Ditambahkan',
    detail: 'Siti Nurhaliza ditambahkan sebagai admin',
    created_at: new Date().toISOString(),
    relative_time: '1 jam lalu',
  },
  {
    id: '4',
    type: 'owner_updated',
    description: 'Data Pemilik Diperbarui',
    detail: 'Data Ahmad Fauzi berhasil diperbarui',
    created_at: new Date().toISOString(),
    relative_time: '3 jam lalu',
  },
  {
    id: '5',
    type: 'system_updated',
    description: 'Pembaruan Sistem',
    detail: 'Sistem diperbarui ke versi 2.4.1',
    created_at: new Date().toISOString(),
    relative_time: '5 jam lalu',
  },
];

function MaterialIcon({ name, color }: { name: string; color: string }) {
  return (
    <Box
      component="span"
      className="material-symbols-outlined"
      sx={{
        fontSize: 18,
        color,
        lineHeight: 1,
      }}
    >
      {name}
    </Box>
  );
}

export default function ActivityFeed({ data }: ActivityFeedProps) {
  const items = data ?? DEFAULT_DATA;

  return (
    <Card
      sx={{
        borderRadius: '22px',
        border: '1px solid var(--dash-line)',
        boxShadow: 'var(--dash-shadow-soft)',
        background: '#ffffff',
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: 'var(--dash-text)' }}>
            Aktivitas Terakhir
          </Typography>
          <Button
            component={Link}
            href="/admin/activity"
            variant="text"
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--dash-primary)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Lihat semua &rarr;
          </Button>
        </Box>

        {/* Activity list */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item) => {
            const config = TYPE_CONFIG[item.type];
            return (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  px: 1,
                  borderRadius: '12px',
                  transition: 'background-color 0.15s',
                  '&:hover': {
                    bgcolor: '#f8f9fc',
                  },
                }}
              >
                {/* Colored circular icon */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${config.color}1a`,
                    flexShrink: 0,
                  }}
                >
                  <MaterialIcon name={config.icon} color={config.color} />
                </Box>

                {/* Title + detail */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--dash-text)',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: '#8a91a3',
                      lineHeight: 1.3,
                      mt: 0.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.detail}
                  </Typography>
                </Box>

                {/* Relative time */}
                <Typography
                  sx={{
                    fontSize: 11,
                    color: '#8a91a3',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {item.relative_time}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
