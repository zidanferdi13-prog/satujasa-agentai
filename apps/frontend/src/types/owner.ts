export interface Owner {
  id: string;
  email: string;
  phone: string;
  role: string;
  company_name: string | null;
  subscription_tier: string | null;
  total_tenants: number;
  total_admin_users: number;
  subscription_status: string | null;
  mrr: string;
  created_at: string;
}

export interface OwnersListResponse {
  data: Owner[];
  meta: {
    total: number;
  };
}

export interface OwnersKpi {
  total: number;
  active: number;
  free: number;
  paid: number;
  total_delta: string;
  active_delta: string;
  free_delta: string;
  paid_delta: string;
}
