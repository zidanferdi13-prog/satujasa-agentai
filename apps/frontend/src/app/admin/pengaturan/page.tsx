'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import apiClient from '@/lib/axios';

interface SettingsPayload {
  app_name: string;
  support_email: string;
  support_phone: string;
}

export default function AdminPengaturanPage() {
  const [form, setForm] = useState<SettingsPayload>({
    app_name: '',
    support_email: '',
    support_phone: '',
  });

  const [validationError, setValidationError] = useState('');

  // Fetch existing settings
  const { data: settingsData, isLoading: isSettingsLoading } = useQuery<{ data: SettingsPayload }>({
    queryKey: ['admin-settings'],
    queryFn: () => apiClient.get('/admin/settings'),
    retry: 1,
  });

  // Populate form when data arrives
  useEffect(() => {
    const d = settingsData?.data;
    if (d) {
      setForm({
        app_name: d.app_name ?? '',
        support_email: d.support_email ?? '',
        support_phone: d.support_phone ?? '',
      });
    }
  }, [settingsData]);

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: (payload: SettingsPayload) =>
      apiClient.post('/admin/settings', payload),
    onSuccess: () => {
      setValidationError('');
    },
    onError: (err: any) => {
      setValidationError(err?.response?.data?.error ?? 'Gagal menyimpan pengaturan');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');
    if (!form.app_name.trim()) {
      setValidationError('Nama aplikasi wajib diisi');
      return;
    }
    saveMutation.mutate(form);
  }

  if (isSettingsLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 640 }}>
        <Skeleton variant="text" width={200} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={320} height={24} sx={{ mb: 4 }} />
        <Skeleton variant="rounded" height={360} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 640 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Pengaturan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Kelola pengaturan umum aplikasi.
      </Typography>

      {validationError && <Alert severity="error" sx={{ mb: 3 }}>{validationError}</Alert>}
      {saveMutation.isError && !validationError && (
        <Alert severity="error" sx={{ mb: 3 }}>Gagal menyimpan pengaturan.</Alert>
      )}
      {saveMutation.isSuccess && <Alert severity="success" sx={{ mb: 3 }}>Pengaturan berhasil disimpan</Alert>}

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField
              label="Nama Aplikasi"
              fullWidth
              required
              placeholder="STNK Jasa"
              value={form.app_name}
              onChange={(e) => setForm({ ...form, app_name: e.target.value })}
            />
            <TextField
              label="Email Support"
              fullWidth
              type="email"
              placeholder="support@example.com"
              value={form.support_email}
              onChange={(e) => setForm({ ...form, support_email: e.target.value })}
            />
            <TextField
              label="No. Telepon Support"
              fullWidth
              type="tel"
              placeholder="08123456789"
              value={form.support_phone}
              onChange={(e) => setForm({ ...form, support_phone: e.target.value })}
            />

            <Button disabled={saveMutation.isPending} variant="contained" type="submit" fullWidth>
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
