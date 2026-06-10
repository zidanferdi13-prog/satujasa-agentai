import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { getStoredUser, getToken } from '@/lib/auth';
import type { User } from '@/types/auth';

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const storedUser = getStoredUser();
      if (storedUser) return storedUser;

      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    },
    enabled: !!getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
