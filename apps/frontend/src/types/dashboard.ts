export interface ActivityItem {
  id: string;
  type: 'owner_registered' | 'tenant_created' | 'admin_added' | 'owner_updated' | 'system_updated';
  description: string;
  detail: string;
  created_at: string;
  relative_time: string;
}

export interface SubscriptionDistribution {
  free: number;
  pro: number;
  plus: number;
  expert: number;
}

export interface PlatformStats {
  storage_used_gb: number;
  storage_total_gb: number;
  db_used_mb: number;
  db_total_mb: number;
  active_users_30d: number;
  total_users_30d: number;
  active_tenants: number;
  total_tenant_slots: number;
}

export interface SystemHealthData {
  server: 'operational' | 'degraded' | 'down';
  database: 'operational' | 'degraded' | 'down';
  backup: 'operational' | 'degraded' | 'down';
}

export interface DashboardResponse {
  total_owners: number;
  active_owners: number;
  total_tenants: number;
  total_transactions: number;
  total_revenue: string;
  total_subscription_revenue?: string;
  total_admin_users?: number;
  subscription_distribution?: SubscriptionDistribution;
  recent_activity?: ActivityItem[];
  platform_stats?: PlatformStats;
  system_health?: SystemHealthData;
  monthly_revenue?: Array<{ month: string; revenue: number }>;
}

// ── Owner Dashboard Response ──
export interface OwnerDashboardResponse {
  kpi: {
    total_tenants: number;
    total_admin_users: number;
    total_transactions: number;
    active_transactions: number;
    total_revenue: string;
    trends: {
      tenants: string;
      admin_users: string;
      transactions: string;
      revenue: string;
    };
  };
  tenants: Array<{
    id: string;
    name: string;
    admin_user_count: number;
    active_transactions: number;
    last_activity: string | null;
    plan_tier: string;
  }>;
  chart_30d: Array<{ date: string; count: number }>;
  activity: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
  }>;
  subscription: {
    tier: string;
    display_name: string;
    max_tenants: number;
    max_admin_users: number;
    current_tenants: number;
    current_admin_users: number;
    activated_at: string | null;
    expires_at: string | null;
  };
  health: {
    server: string;
    database: string;
    backup: string;
    api: string;
    security: string;
  };
}

// ── Admin User Dashboard Response ──
export interface AdminUserDashboardResponse {
  kpi: {
    transactions_today: { value: number; trend: number };
    pending: { value: number; trend: number };
    done: { value: number; trend: number };
    sla: { value: number; trend: number };
  };
  chart_30d: Array<{ date: string; count: number }>;
  activity: Array<{ id: string; tenant_name: string; action: string; time_ago: string }>;
  recent_transactions: Array<{ id: string; trx_number: string; tenant_name: string; service_name: string; status: string; created_at: string }>;
  team_performance: { done_count: number; processing_count: number; pending_count: number; done_pct: number; processing_pct: number; pending_pct: number };
  requests_summary: { total: number; pending: number; approved: number; rejected: number };
}
