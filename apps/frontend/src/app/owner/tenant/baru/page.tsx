'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import apiClient from '@/lib/axios';

interface SubscriptionInfo {
  tier: string;
  max_tenants: number;
  current_tenants: number;
}

interface DashboardData {
  subscription: SubscriptionInfo;
}

export default function TenantBaruPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');

  const { data: dashboardData } = useQuery<DashboardData>({
    queryKey: ['owner-dashboard'],
    queryFn: () => apiClient.get('/owner/dashboard').then((r) => r.data?.data ?? r.data),
  });

  const subscription = dashboardData?.subscription;
  const quotaUsed = subscription ? subscription.current_tenants : 0;
  const quotaMax = subscription ? subscription.max_tenants : 1;
  const quotaExceeded = quotaUsed >= quotaMax;

  const { mutate: createTenant, isPending } = useMutation({
    mutationFn: (payload: typeof form) =>
      apiClient.post('/owner/tenants', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-tenants'] });
      queryClient.invalidateQueries({ queryKey: ['owner-dashboard'] });
      router.push('/owner/tenant');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message ?? 'Gagal membuat tenant');
    },
  });

  function validate(): string | null {
    if (!form.name.trim()) return 'Nama tenant wajib diisi';
    if (!form.address.trim()) return 'Alamat wajib diisi';
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    createTenant(form);
  }

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
      <Box sx={{ mb: '28px' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: 28, md: 32 },
            fontWeight: 800,
            color: 'var(--dash-text)',
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          Tambah Tenant Baru 🏢
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: 15,
            color: 'var(--dash-muted)',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Daftarkan tenant baru untuk memperluas bisnis Anda.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

      {quotaExceeded && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: '14px',
            border: '1px solid rgba(246, 163, 38, 0.3)',
            bgcolor: 'rgba(255, 247, 237, 0.95)',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>
            Kuota tenant sudah penuh
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            Anda sudah menggunakan {quotaUsed} dari {quotaMax} tenant. Upgrade paket untuk menambah lebih banyak.
          </Typography>
        </Alert>
      )}

      {subscription && !quotaExceeded && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            p: 2.5,
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid #e5e9f3',
          }}
        >
          <Box sx={{ width: 48, height: 48, borderRadius: '13px', display: 'grid', placeItems: 'center', bgcolor: '#eef2ff', color: '#4f46e5' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>data_usage</span>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.3 }}>
              Kuota Tenant
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1d2433' }}>
              {quotaUsed} / {quotaMax} digunakan
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          borderRadius: '22px',
          border: '1px solid #e5e9f3',
          boxShadow: '0 12px 28px rgba(30, 41, 59, 0.06)',
          background: 'rgba(255,255,255,0.94)',
          p: { xs: 3, md: 4 },
          maxWidth: 640,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#1d2433', mb: 0.5 }}>
            Data Tenant
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
            Isi informasi lengkap tenant baru
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TextField
            label="Nama Tenant"
            fullWidth
            required
            placeholder="Biro Jasa Mandiri"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f8f9fc', '&:hover': { backgroundColor: '#ffffff' }, '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' } },
            }}
          />
          <TextField
            label="Alamat"
            fullWidth
            required
            multiline
            rows={2}
            placeholder="Jl. Merdeka No. 123, Jakarta"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f8f9fc', '&:hover': { backgroundColor: '#ffffff' }, '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' } },
            }}
          />
          <TextField
            label="No. Telepon (opsional)"
            fullWidth
            type="tel"
            placeholder="08123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f8f9fc', '&:hover': { backgroundColor: '#ffffff' }, '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' } },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={isPending}
              fullWidth
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                py: 1.25,
                fontWeight: 700,
                borderColor: '#e5e9f3',
                color: '#6b7280',
                '&:hover': { borderColor: '#d0d4e4', bgcolor: '#f8f9fc' },
              }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={quotaExceeded || isPending}
              fullWidth
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                py: 1.25,
                fontWeight: 700,
                bgcolor: 'var(--dash-primary)',
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
                '&:hover': { bgcolor: 'var(--dash-primary-2)' },
              }}
            >
              {isPending ? 'Menyimpan...' : 'Buat Tenant'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
