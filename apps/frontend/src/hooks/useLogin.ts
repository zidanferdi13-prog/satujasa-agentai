'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { setToken, removeToken } from '@/lib/auth';
import { getRoleRedirect } from '@/lib/redirectByRole';
import { toFrontendRole } from '@/types/auth';
import type { LoginPayload, LoginResponse, User, BackendRole } from '@/types/auth';

interface BackendUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: BackendRole;
  tenant_id?: string | null;
  owner_id?: string | null;
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
      return data;
    },
    onSuccess: async (data) => {
      setToken(data.accessToken);
      try {
        const response = await apiClient.get('/auth/me');
        const backendUser = response.data as BackendUser;
        const frontendUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name || backendUser.email,
          role: toFrontendRole(backendUser.role),
        };
        queryClient.setQueryData(['me'], frontendUser);
        router.push(getRoleRedirect(frontendUser.role));
      } catch {
        removeToken();
        queryClient.clear();
      }
    },
  });
}
