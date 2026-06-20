export interface MasterService {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface TenantService {
  id: string;
  service_id: string;
  tenant_id: string;
  code: string;
  name: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantServicesResponse {
  data?: TenantService[];
  error?: string;
}

export interface MasterServicesResponse {
  data?: MasterService[];
  error?: string;
}
