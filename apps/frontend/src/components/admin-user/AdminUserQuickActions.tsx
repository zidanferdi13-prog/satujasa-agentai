'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

interface QuickAction {
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  color: string;
  bgTint: string;
}

export default function AdminUserQuickActions() {
  const actions: QuickAction[] = [
    {
      icon: 'receipt_long',
      title: 'Buat Transaksi',
      subtitle: 'Input transaksi baru',
      href: '#',
      color: '#6046f4',
      bgTint: '#f3f0ff',
    },
    {
      icon: 'checklist',
      title: 'Approve Permintaan',
      subtitle: 'Review permintaan',
      href: '#',
      color: '#3b82f6',
      bgTint: '#eff6ff',
    },
    {
      icon: 'person_add',
      title: 'Tambah Tim',
      subtitle: 'Kelola anggota tim',
      href: '#',
      color: '#22c55e',
      bgTint: '#f0fdf4',
    },
    {
      icon: 'download',
      title: 'Export Laporan',
      subtitle: 'Unduh data laporan',
      href: '#',
      color: '#f59e0b',
      bgTint: '#fffbeb',
    },
  ];

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '22px',
        border: '1px solid #e5e9f3',
        boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
        bgcolor: '#fff',
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: '#1e293b',
          mb: 2,
        }}
      >
        Quick Actions
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
        }}
      >
        {actions.map((action) => (
          <Box
            key={action.title}
            component="a"
            href={action.href}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              borderRadius: '17px',
              bgcolor: action.bgTint,
              textDecoration: 'none',
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(30, 41, 59, 0.12)',
                borderColor: '#e5e9f3',
              },
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
                bgcolor: 'white',
                color: action.color,
                fontSize: 20,
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined">{action.icon}</span>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.3,
                }}
              >
                {action.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: '#8a91a3',
                  lineHeight: 1.3,
                }}
              >
                {action.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
