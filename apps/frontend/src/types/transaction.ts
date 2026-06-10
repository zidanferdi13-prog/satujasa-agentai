export type TransactionStatus =
  | 'received'
  | 'document_check'
  | 'needs_revision'
  | 'payment_pending'
  | 'processing'
  | 'at_samsat'
  | 'done'
  | 'cancelled';

export interface Transaction {
  id: string;
  customer_name: string;
  customer_phone: string;
  plate_number: string;
  vehicle_type: string;
  service_id: string;
  service_name: string;
  status: TransactionStatus;
  total_cost: number;
  additional_cost: number;
  notes: string;
  monitoring_token: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionStatusLog {
  id: string;
  status: TransactionStatus;
  notes: string;
  created_at: string;
}

export interface TransactionDetail extends Transaction {
  status_logs: TransactionStatusLog[];
}

export interface CreateTransactionPayload {
  customer: {
    name: string;
    phone: string;
    plate_number: string;
    vehicle_type: string;
  };
  service_id: string;
  total_cost: number;
  notes?: string;
}

export interface UpdateStatusPayload {
  status: TransactionStatus;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
