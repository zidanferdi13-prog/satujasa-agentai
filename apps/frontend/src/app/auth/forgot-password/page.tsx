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

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    // Business logic placeholder — actual reset flow can be wired here
    setTimeout(() => {
      setIsPending(false);
      setSuccess(true);
    }, 2000);
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
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5 }}>
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
        <AuthTextField label="Email terdaftar" type="email" required fullWidth autoComplete="email" />
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
          {isPending ? 'Memproses…' : 'Minta Bantuan Reset'}
        </Button>
      </form>

      <Box sx={{ mt: 3, display: 'grid', gap: 1.5, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', fontSize: 14 }}>
        <Link
          href="/auth/signin"
          style={{
            borderRadius: 24, padding: 16, textAlign: 'center', fontWeight: 700,
            color: '#6161ff', textDecoration: 'none', backgroundColor: '#f5f6f8', display: 'block',
          }}
        >
          Kembali masuk
        </Link>
        <Link
          href="/auth/help"
          style={{
            borderRadius: 24, padding: 16, textAlign: 'center', fontWeight: 700,
            color: '#535768', textDecoration: 'none', backgroundColor: '#f5f6f8', display: 'block',
          }}
        >
          Hubungi bantuan
        </Link>
      </Box>
    </AuthShell>
  );
}
