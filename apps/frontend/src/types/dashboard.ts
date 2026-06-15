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
  total_admin_users?: number;
  subscription_distribution?: SubscriptionDistribution;
  recent_activity?: ActivityItem[];
  platform_stats?: PlatformStats;
  system_health?: SystemHealthData;
}
