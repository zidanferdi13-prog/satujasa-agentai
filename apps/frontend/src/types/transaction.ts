export type TransactionStatus =
  | 'received'
  | 'document_check'
  | 'needs_revision'
  | 'payment_pending'
  | 'processing'
  | 'at_samsat'
  | 'done'
  | 'cancelled';

export interface FeeDetail {
  component_code: string;
  component_name?: string;
  amount: number;
  is_editable?: boolean;
  source?: string;
}

export interface FeeRequirement {
  componentCode: string;
  componentName: string;
  defaultAmount: string;
  amount: string;
  isEditable: boolean;
  source: string;
  sortOrder: number;
}

export interface DocRequirement {
  documentCode: string;
  documentName: string;
  isRequired: boolean;
  sortOrder: number;
}

export interface DocumentChecklist {
  id?: string;
  document_code: string;
  document_name: string;
  is_required?: boolean;
  is_checked?: boolean;
}

export interface Transaction {
  id: string;
  customer_name: string;
  customer_phone: string;
  plate_number?: string;
  vehicle_plate?: string;
  vehicle_type?: string;
  service_id: string;
  service_name: string;
  status: TransactionStatus;
  total_cost?: number;
  additional_cost: number;
  notes: string;
  monitoring_token: string;
  fee_details?: FeeDetail[];
  document_checklists?: DocumentChecklist[];
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
  customer_name: string;
  customer_phone: string;
  vehicle_plate: string;
  vehicle_type_code: string;
  service_id: string;
  province_code: string;
  city_code?: string;
  city_name?: string;
  tax_due_date?: string;
  notes?: string;
  fee_details: FeeDetail[];
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
