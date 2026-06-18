'use client';

import { useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';
import apiClient from '@/lib/axios';

const helpOptions = [
  'Tidak bisa masuk meski password benar',
  'Email akun tidak ditemukan',
  'Akses role owner/admin belum sesuai',
];

export default function LoginHelpPage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    email: '',
    phone: '',
    detail: '',
  });

  function handleChange(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    if (!form.email.trim()) {
      setError('Masukkan email akun Anda');
      setIsPending(false);
      return;
    }

    try {
      await apiClient.post('/auth/forgot-password', { email: form.email.trim() });
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      const msg =
        apiError.response?.data?.error ??
        apiError.response?.data?.message ??
        apiError.message ??
        'Gagal mengirim permintaan. Coba lagi.';
      setError(msg);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Bantuan login"
      title="Saat akses bermasalah, operasional tetap harus jalan."
      description="Kirim detail kendala login agar tim SatuJasa dapat membantu pengecekan akun, role, atau akses dashboard."
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ mb: 1, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}
        >
          Hubungi bantuan
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5 }}>
          Kendala login
        </Typography>
        <Typography sx={{ color: '#535768', lineHeight: 1.75 }}>
          Jelaskan kendala agar proses pengecekan lebih cepat.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
          Permintaan bantuan telah dikirim. Tim SatuJasa akan menghubungi Anda.
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
        {helpOptions.map((option) => (
          <Card key={option} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#333333' }}>
                {option}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField
          label="Email akun"
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
          label="Detail kendala"
          required
          fullWidth
          multiline
          minRows={4}
          value={form.detail}
          onChange={handleChange('detail')}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          fullWidth
          size="large"
          sx={{ py: 1.75 }}
        >
          {isPending && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />}
          {isPending ? 'Mengirim…' : 'Kirim Kendala Login'}
        </Button>
      </form>

      <Box
        sx={{ mt: 3, borderRadius: 3, p: 2.5, textAlign: 'center', fontSize: 14, bgcolor: '#f5f6f8', color: '#535768' }}
      >
        Ingin mencoba masuk lagi?{' '}
        <Link href="/auth/signin" style={{ fontWeight: 800, color: '#6161ff', textDecoration: 'none' }}>
          Kembali ke sign in
        </Link>
      </Box>
    </AuthShell>
  );
}
