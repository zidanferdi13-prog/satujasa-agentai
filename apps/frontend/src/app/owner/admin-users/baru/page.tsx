'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import apiClient from '@/lib/axios';

interface Tenant {
  id: string;
  name: string;
}

interface CreateAdminUserPayload {
  email: string;
  phone: string;
  password: string;
  tenant_id: string;
}

export default function AdminUserBaruPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateAdminUserPayload>({
    email: '',
    phone: '',
    password: '',
    tenant_id: '',
  });
  const [error, setError] = useState('');

  const { data: tenants } = useQuery<{ data: Tenant[] }>({
    queryKey: ['owner-tenants'],
    queryFn: () => apiClient.get('/owner/tenants').then((r) => r.data),
  });

  const { mutate: createAdminUser, isPending } = useMutation({
    mutationFn: (payload: CreateAdminUserPayload) =>
      apiClient.post('/owner/admin-users', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-admin-users'] });
      router.push('/owner/admin-users');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message ?? 'Gagal membuat admin user');
    },
  });

  function validate(): string | null {
    if (!form.email.trim()) return 'Email wajib diisi';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email tidak valid';
    if (!form.phone.trim()) return 'Nomor HP wajib diisi';
    if (!form.password) return 'Password wajib diisi';
    if (form.password.length < 6) return 'Password minimal 6 karakter';
    if (!form.tenant_id) return 'Pilih tenant';
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
    createAdminUser(form);
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
          Tambah Admin User 👥
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
          Daftarkan admin user baru untuk tenant Anda.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

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
            Data Admin User
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
            Isi informasi lengkap admin user baru
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            placeholder="admin@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f8f9fc', '&:hover': { backgroundColor: '#ffffff' }, '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' } },
            }}
          />
          <TextField
            label="No. Telepon"
            fullWidth
            required
            placeholder="08123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#f8f9fc', '&:hover': { backgroundColor: '#ffffff' }, '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5', boxShadow: '0 0 0 3px rgba(79,70,229,0.10)' } },
            }}
          />

          <FormControl fullWidth required>
            <InputLabel>Tenant</InputLabel>
            <Select
              value={form.tenant_id}
              label="Tenant"
              onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
              sx={{ borderRadius: '12px', backgroundColor: '#f8f9fc', '&:hover': { backgroundColor: '#ffffff' }, '&.Mui-focused': { backgroundColor: '#ffffff', borderColor: '#4f46e5' } }}
            >
              {tenants?.data?.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            helperText="Minimal 6 karakter"
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
              disabled={isPending}
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
              {isPending ? 'Menyimpan...' : 'Buat Admin User'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
