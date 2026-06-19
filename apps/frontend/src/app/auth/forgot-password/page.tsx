'use client';

import { useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';
import apiClient from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Masukkan email yang terdaftar');
      setIsPending(false);
      return;
    }

    try {
      await apiClient.post('/auth/forgot-password', { email: email.trim() });
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
      eyebrow="Reset akses"
      title="Pulihkan akses tanpa mengganggu operasional."
      description="Masukkan email akun Anda. Tim SatuJasa dapat membantu proses reset password sesuai data yang terdaftar."
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ mb: 1, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}
        >
          Lupa password
        </Typography>
        <Typography component="h2" variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5 }}>
          Reset password
        </Typography>
        <Typography sx={{ color: '#535768', lineHeight: 1.75 }}>
          Masukkan email akun yang terdaftar untuk proses bantuan reset.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
          Permintaan reset telah dikirim. Tim SatuJasa akan menghubungi email Anda dalam 1×24 jam.
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField
          label="Email terdaftar"
          type="email"
          required
          fullWidth
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {isPending ? 'Memproses…' : 'Minta Bantuan Reset'}
        </Button>
      </form>

      <Box sx={{ mt: 3, display: 'grid', gap: 1.5, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', fontSize: 14 }}>
        <Link
          href="/auth/signin"
          style={{
            borderRadius: 12, padding: 16, textAlign: 'center', fontWeight: 700,
            color: '#6161ff', textDecoration: 'none', backgroundColor: '#f5f6f8', display: 'block',
          }}
        >
          Kembali masuk
        </Link>
        <Link
          href="/auth/help"
          style={{
            borderRadius: 12, padding: 16, textAlign: 'center', fontWeight: 700,
            color: '#535768', textDecoration: 'none', backgroundColor: '#f5f6f8', display: 'block',
          }}
        >
          Hubungi bantuan
        </Link>
      </Box>
    </AuthShell>
  );
}
