export interface SubscriptionLog {
  id: string;
  owner_id: string;
  owner_email: string;
  tier: 'free' | 'pro' | 'plus' | 'expert';
  max_tenants: number;
  max_admin_users: number;
  price_per_month: number;
  duration_months: number;
  total_price: number;
  activated_at: string;
  expires_at: string | null;
  status: 'active' | 'expired';
}

export interface SubscriptionLogsResponse {
  logs: SubscriptionLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  summary: {
    total_subscriptions: number;
    by_tier: Record<string, number>;
    total_revenue: number;
    active_subscriptions: number;
    expired_subscriptions: number;
  };
}
