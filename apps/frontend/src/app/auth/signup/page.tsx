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

export default function SignUpPage() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    // Business logic placeholder — actual registration hook can be wired here
    setTimeout(() => {
      setIsPending(false);
    }, 2000);
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
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5 }}>
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
        <AuthTextField label="Nama bisnis" required fullWidth autoComplete="organization" />
        <AuthTextField label="Nama pemilik" required fullWidth autoComplete="name" />
        <AuthTextField label="Email" type="email" required fullWidth autoComplete="email" />
        <AuthTextField label="Nomor WhatsApp" type="tel" required fullWidth autoComplete="tel" />
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
          {isPending ? 'Memproses…' : 'Ajukan Pendaftaran'}
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
