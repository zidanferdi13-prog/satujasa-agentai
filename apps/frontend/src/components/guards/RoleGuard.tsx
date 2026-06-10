'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getToken, removeToken } from '@/lib/auth';
import { getRoleRedirect } from '@/lib/redirectByRole';
import type { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = getToken();
    if (!token) {
      router.replace('/auth/signin');
      return;
    }

    if (!isLoading) {
      if (isError || !user) {
        removeToken();
        router.replace('/auth/signin');
        return;
      }
      if (user.role !== allowedRole) {
        router.replace(getRoleRedirect(user.role));
      }
    }
  }, [mounted, user, isLoading, isError, router, allowedRole]);

  if (!mounted || isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== allowedRole) return null;

  return <>{children}</>;
}
