import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { clearPostLoginRedirect, getPostLoginRedirect, removeToken, setStoredUser, setToken } from '@/lib/auth';
import { getRoleRedirect } from '@/lib/redirectByRole';
import { normalizeUser } from '@/types/auth';
import type { LoginPayload, LoginResponse } from '@/types/auth';

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
        const frontendUser = data.user
          ? normalizeUser(data.user)
          : normalizeUser((await apiClient.get('/auth/me')).data);

        setStoredUser(frontendUser);
        queryClient.setQueryData(['me'], frontendUser);

        const redirect = getPostLoginRedirect();
        clearPostLoginRedirect();
        router.push(redirect || getRoleRedirect(frontendUser.role));
      } catch (error) {
        removeToken();
        queryClient.clear();
        throw error;
      }
    },
  });
}
