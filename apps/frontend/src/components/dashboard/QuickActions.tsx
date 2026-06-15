'use client';

import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type QuickActionItem = {
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  bgColor: string;
};

const ACTIONS: QuickActionItem[] = [
  {
    icon: 'person_add',
    title: 'Tambah Owner',
    subtitle: 'Registrasi pemilik baru',
    href: '/admin/owners',
    bgColor: '#eef2ff',
  },
  {
    icon: 'business',
    title: 'Kelola Tenant',
    subtitle: 'Atur data tenant',
    href: '/admin/owners',
    bgColor: '#f3e8ff',
  },
  {
    icon: 'bar_chart',
    title: 'Lihat Report',
    subtitle: 'Analisis & laporan',
    href: '/admin/laporan',
    bgColor: '#ecfdf3',
  },
  {
    icon: 'settings',
    title: 'Pengaturan',
    subtitle: 'Konfigurasi sistem',
    href: '/admin/pengaturan',
    bgColor: '#fff7ed',
  },
];

const ICON_COLORS: Record<string, string> = {
  person_add: 'var(--dash-primary)',
  business: 'var(--dash-violet)',
  bar_chart: 'var(--dash-green)',
  settings: 'var(--dash-orange)',
};

function MaterialIcon({ name }: { name: string }) {
  const color = ICON_COLORS[name] ?? 'var(--dash-primary)';
  return (
    <Box
      component="span"
      className="material-symbols-outlined"
      sx={{ fontSize: 22, color, lineHeight: 1 }}
    >
      {name}
    </Box>
  );
}

export default function QuickActions() {
  const router = useRouter();

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
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: 'var(--dash-text)', mb: 2 }}>
          Aksi Cepat
        </Typography>

        {/* 4-column grid; collapses to 2 on mobile */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {ACTIONS.map((action) => (
            <Box
              key={action.icon}
              onClick={() => router.push(action.href)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                p: 1.5,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                '&:hover': {
                  bgcolor: '#f8f9fc',
                },
              }}
            >
              {/* Icon background circle */}
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: action.bgColor,
                }}
              >
                <MaterialIcon name={action.icon} />
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--dash-text)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {action.title}
              </Typography>

              {/* Subtitle */}
              <Typography
                sx={{
                  fontSize: 11,
                  color: '#8a91a3',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {action.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
