import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { clearStoredUser, getStoredUser, getToken, setStoredUser } from '@/lib/auth';
import { normalizeUser } from '@/types/auth';
import type { BackendUser, User } from '@/types/auth';

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['me'],
    initialData: getStoredUser() ?? undefined,
    queryFn: async () => {
      const { data } = await apiClient.get<BackendUser>('/auth/me');
      const user = normalizeUser(data);
      setStoredUser(user);
      return user;
    },
    enabled: !!getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    meta: {
      onError: () => clearStoredUser(),
    },
  });
}
