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
        border: '1px solid #e5e9f3',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        background: 'rgba(255,255,255,0.94)',
        height: '100%',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18, color: 'var(--dash-text)', mb: 0.5 }}>
            Aksi Cepat
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, color: '#8a91a3' }}>
            Shortcut menu utama
          </Typography>
        </Box>

        {/* 2x2 grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr' },
            gap: 1.5,
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
                gap: 1.5,
                p: 2.5,
                borderRadius: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: '#f8f9fc',
                  borderColor: '#e5e9f3',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(30, 41, 59, 0.08)',
                },
              }}
            >
              {/* Icon background rounded square */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: action.bgColor,
                  transition: 'transform 0.2s',
                  '.MuiBox-root:hover &': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MaterialIcon name={action.icon} />
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--dash-text)',
                  textAlign: 'center',
                  lineHeight: 1.3,
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
                  lineHeight: 1.3,
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
