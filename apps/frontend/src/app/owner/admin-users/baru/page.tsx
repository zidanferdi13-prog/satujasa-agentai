'use client';

import { useSearchParams } from 'next/navigation';
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
import Paper from '@mui/material/Paper';
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
  const searchParams = useSearchParams();
  const defaultTenantId = searchParams?.get('tenant_id') || '';

  const [form, setForm] = useState<CreateAdminUserPayload>({
    email: '',
    phone: '',
    password: '',
    tenant_id: defaultTenantId,
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
    <Box className="p-6 md:p-8" sx={{ maxWidth: 640 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Tambah Admin User
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            placeholder="admin@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="No. Telepon"
            fullWidth
            required
            placeholder="08123456789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <FormControl fullWidth required>
            <InputLabel>Tenant</InputLabel>
            <Select
              value={form.tenant_id}
              label="Tenant"
              onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
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
          />

          <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            <Button variant="outlined" onClick={() => router.back()} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Buat Admin User'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
