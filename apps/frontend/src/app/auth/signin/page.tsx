'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AuthShell from '@/components/auth/AuthShell';
import AuthTextField from '@/components/auth/AuthTextField';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLogin } from '@/hooks/useLogin';
import { getPostLoginRedirect, getToken } from '@/lib/auth';
import { getRoleRedirect } from '@/lib/redirectByRole';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: user, isLoading: isCheckingSession } = useCurrentUser();
  const { mutate: login, isPending, isError, error } = useLogin();

  useEffect(() => {
    if (!getToken() || isCheckingSession || !user) return;
    router.replace(getPostLoginRedirect() || getRoleRedirect(user.role));
  }, [isCheckingSession, router, user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <AuthShell
      eyebrow="Masuk dashboard"
      title="Lanjutkan operasional tanpa data tercecer."
      description="Masuk ke ruang kerja SatuJasa untuk mengelola transaksi, status dokumen, dan cabang dari web based maupun mobile Android."
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ mb: 1, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff' }}
        >
          Sign in
        </Typography>
        <Typography component="h2" variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 0.5 }}>
          Masuk dashboard
        </Typography>
        <Typography sx={{ color: '#535768', lineHeight: 1.75 }}>
          Gunakan email dan password yang terdaftar.
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {(error as Error)?.message ?? 'Login gagal. Periksa email dan password Anda.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoComplete="email"
          autoFocus
        />
        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          autoComplete="current-password"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, fontSize: 14 }}>
          <Link href="/auth/forgot-password" style={{ fontWeight: 700, color: '#6161ff', textDecoration: 'none' }}>
            Lupa password?
          </Link>
          <Link href="/auth/help" style={{ fontWeight: 700, color: '#535768', textDecoration: 'none' }}>
            Kendala login
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          fullWidth
          size="large"
          sx={{ py: 1.75, borderRadius: 2 }}
        >
          {isPending && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} aria-hidden="true" />}
          {isPending ? 'Memproses…' : 'Masuk Dashboard'}
        </Button>
      </form>

      <Box
        sx={{ mt: 3, borderRadius: 2, p: 2.5, textAlign: 'center', fontSize: 14, bgcolor: '#f5f6f8', color: '#535768' }}
      >
        Belum punya akun?{' '}
        <Link href="/auth/signup" style={{ fontWeight: 800, color: '#6161ff', textDecoration: 'none' }}>
          Daftar SatuJasa
        </Link>
      </Box>
    </AuthShell>
  );
}
