import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { getStoredUser, getToken } from '@/lib/auth';
import { toFrontendRole } from '@/types/auth';
import type { BackendRole, User } from '@/types/auth';

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const storedUser = getStoredUser();
      if (storedUser) return storedUser;

      const { data } = await apiClient.get<User & { role: BackendRole | User['role']; name?: string | null }>('/auth/me');
      const role = data.role as string;
      return {
        id: data.id,
        email: data.email,
        name: data.name || data.email,
        role: role === 'super-admin' || role === 'owner' || role === 'admin-user'
          ? toFrontendRole(role as BackendRole)
          : data.role as User['role'],
      };
    },
    enabled: !!getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
