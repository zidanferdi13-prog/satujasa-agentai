'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { visuallyHidden } from '@mui/utils';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { clearAuthStorage, getToken } from '@/lib/auth';
import { getRoleRedirect } from '@/lib/redirectByRole';
import type { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

function LoadingFallback() {
  return (
    <Box role="status" aria-live="polite" className="flex items-center justify-center min-h-screen">
      <CircularProgress aria-hidden="true" />
      <Box component="span" sx={visuallyHidden}>
        Memuat dashboard...
      </Box>
    </Box>
  );
}

function RoleGuardInner({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user, isLoading, isError } = useCurrentUser();
  const hasToken = getToken();

  useEffect(() => {
    if (!hasToken) {
      const params = new URLSearchParams(searchParams?.toString() || '');
      const current = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
      if (pathname && pathname !== '/auth/signin') {
        params.set('redirect', current);
      }
      router.replace(params.toString() ? `/auth/signin?${params.toString()}` : '/auth/signin');
      return;
    }

    if (!isLoading) {
      if (isError || !user) {
        clearAuthStorage();
        router.replace('/auth/signin');
        return;
      }
      if (user.role !== allowedRole) {
        router.replace(getRoleRedirect(user.role));
      }
    }
  }, [hasToken, user, isLoading, isError, router, allowedRole, pathname, searchParams]);

  if (!hasToken || isLoading) {
    return <LoadingFallback />;
  }

  if (!user || user.role !== allowedRole) return null;

  return <>{children}</>;
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RoleGuardInner allowedRole={allowedRole}>
        {children}
      </RoleGuardInner>
    </Suspense>
  );
}
