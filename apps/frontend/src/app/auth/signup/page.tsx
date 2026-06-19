'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';
import apiClient from '@/lib/axios';

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: '',
    owner_name: '',
    email: '',
    phone: '',
    password: '',
  });

  function handleChange(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    if (!form.email.trim() || !form.phone.trim() || !form.company_name.trim() || !form.password.trim()) {
      setError('Harap isi semua field yang wajib');
      setIsPending(false);
      return;
    }

    if (form.password.trim().length < 8) {
      setError('Password minimal 8 karakter');
      setIsPending(false);
      return;
    }

    try {
      await apiClient.post('/auth/register', {
        email: form.email.trim(),
        company_name: form.company_name.trim(),
        phone: form.phone.trim(),
        owner_name: form.owner_name.trim(),
        password: form.password,
      });
      router.push('/auth/signin?registered=true');
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      const msg =
        apiError.response?.data?.error ??
        apiError.response?.data?.message ??
        apiError.message ??
        'Gagal mendaftar. Coba lagi.';
      setError(msg);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Pendaftaran"
      title="Mulai rapikan bisnis jasa STNK dari satu akun."
      description="Daftarkan bisnis Anda untuk menyiapkan akses owner, admin cabang, dashboard web based, dan mobile Android."
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ mb: 1, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}
        >
          Sign up
        </Typography>
        <Typography component="h2" variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5 }}>
          Daftar SatuJasa
        </Typography>
        <Typography sx={{ color: '#535768', lineHeight: 1.75 }}>
          Isi data awal bisnis untuk menyiapkan akun owner.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField
          label="Nama bisnis"
          required
          fullWidth
          autoComplete="organization"
          value={form.company_name}
          onChange={handleChange('company_name')}
        />
        <AuthTextField
          label="Nama pemilik"
          required
          fullWidth
          autoComplete="name"
          value={form.owner_name}
          onChange={handleChange('owner_name')}
        />
        <AuthTextField
          label="Email"
          type="email"
          required
          fullWidth
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
        />
        <AuthTextField
          label="Nomor WhatsApp"
          type="tel"
          required
          fullWidth
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange('phone')}
        />
        <AuthTextField
          label="Password"
          type="password"
          required
          fullWidth
          autoComplete="new-password"
          helperText="Minimal 8 karakter"
          value={form.password}
          onChange={handleChange('password')}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          fullWidth
          size="large"
          sx={{ py: 1.75, borderRadius: '12px' }}
        >
          {isPending && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} aria-hidden="true" />}
          {isPending ? 'Memproses…' : 'Daftar Sekarang'}
        </Button>
      </form>

      <Box
        sx={{ mt: 3, borderRadius: 3, p: 2.5, textAlign: 'center', fontSize: 14, bgcolor: '#f5f6f8', color: '#535768' }}
      >
        Sudah punya akun?{' '}
        <Link href="/auth/signin" style={{ fontWeight: 800, color: '#6161ff', textDecoration: 'none' }}>
          Masuk sekarang
        </Link>
      </Box>
    </AuthShell>
  );
}
