'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import apiClient from '@/lib/axios';

interface DashboardStats {
  transactions_today: number;
  transactions_pending: number;
  transactions_done: number;
}

export default function UserAdminPage() {
  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['user-admin-dashboard'],
    queryFn: () => apiClient.get('/admin-user/dashboard').then((r) => r.data?.data ?? r.data),
  });

  const stats = data ?? { transactions_today: 0, transactions_pending: 0, transactions_done: 0 };

  return (
    <Box
      sx={{
        p: { xs: '20px', sm: '24px 28px', lg: '32px 40px 48px' },
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 90% 0%, rgba(99, 102, 241, 0.13), transparent 35%),
          radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.08), transparent 32%),
          #f6f8fc
        `,
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #6254f3 0%, #8b7cf6 50%, #a594fc 100%)',
          color: 'white',
          boxShadow: '0 20px 50px rgba(98, 84, 243, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: 28, md: 34 },
              fontWeight: 800,
              mb: 1,
              lineHeight: 1.2,
              color: '#ffffff',
            }}
          >
            Admin User Dashboard 👥
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: 15,
              opacity: 0.9,
              lineHeight: 1.6,
              color: '#ffffff',
            }}
          >
            Pantau aktivitas transaksi dan kelola operasional tenant Anda.
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5, mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: '22px' }} />
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5, mb: 4 }}>
          {/* Transactions Today */}
          <Card
            sx={{
              borderRadius: '22px',
              border: '1px solid #e5e9f3',
              boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
              background: 'rgba(255,255,255,0.94)',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ffffff' }}>
                today
              </span>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                Transaksi Hari Ini
              </Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#1d2433', lineHeight: 1 }}>
                {stats.transactions_today}
              </Typography>
            </Box>
          </Card>

          {/* Pending */}
          <Card
            sx={{
              borderRadius: '22px',
              border: '1px solid #e5e9f3',
              boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
              background: 'rgba(255,255,255,0.94)',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ffffff' }}>
                pending
              </span>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                Pending
              </Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#1d2433', lineHeight: 1 }}>
                {stats.transactions_pending}
              </Typography>
            </Box>
          </Card>

          {/* Completed */}
          <Card
            sx={{
              borderRadius: '22px',
              border: '1px solid #e5e9f3',
              boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
              background: 'rgba(255,255,255,0.94)',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                boxShadow: '0 8px 16px rgba(34, 197, 94, 0.2)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ffffff' }}>
                check_circle
              </span>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                Selesai
              </Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#1d2433', lineHeight: 1 }}>
                {stats.transactions_done}
              </Typography>
            </Box>
          </Card>
        </Box>
      )}

      {/* Tenant Activity Section */}
      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '22px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#eef2ff',
            mx: 'auto',
            mb: 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#4f46e5' }}>
            history
          </span>
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>
          Tenant Activity
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
          Activity log akan ditampilkan di sini.
        </Typography>
      </Box>
    </Box>
  );
}
