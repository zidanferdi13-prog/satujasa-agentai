'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
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
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 640 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Tambah Tenant Baru
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {quotaExceeded && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Kuota tenant sudah penuh
          </Typography>
          <Typography variant="body2">
            Anda sudah menggunakan {quotaUsed} dari {quotaMax} tenant. Upgrade paket untuk menambah lebih banyak.
          </Typography>
        </Alert>
      )}

      {subscription && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">Quota Tenant</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {quotaUsed} / {quotaMax} digunakan
          </Typography>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            label="Nama Tenant"
            fullWidth
            required
            placeholder="Biro Jasa Mandiri"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          />
          <TextField
            label="No. Telepon (opsional)"
            fullWidth
            type="tel"
            placeholder="08123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            <Button variant="outlined" onClick={() => router.back()} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" variant="contained" disabled={quotaExceeded || isPending}>
              {isPending ? 'Menyimpan...' : 'Buat Tenant'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
