export type DocumentStatus = 'Menerima Berkas' | 'Cek Fisik' | 'Proses Samsat' | 'STNK Selesai' | 'Diterima Customer' | 'Terhambat';

export interface BranchTenant {
  id: string;
  name: string;
  city: string;
  adminName: string;
  adminEmail: string;
  activeOrders: number;
  revenueThisMonth: number;
  pricing: {
    perpanjangStnkMobil: number;
    perpanjangStnkMotor: number;
    balikNamaMobil: number;
    balikNamaMotor: number;
    mutasiKendaraan: number;
  };
}

export interface StnkTransaction {
  id: string;
  tenantName: string;
  customerName: string;
  vehiclePlate: string;
  vehicleModel: string;
  serviceType: string;
  grandTotal: number;
  status: DocumentStatus;
  updatedAt: string;
  progressHistory: {
    status: DocumentStatus;
    time: string;
    description: string;
    completed: boolean;
  }[];
}

export interface DemoRequest {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  branchCount: number;
  selectedPlan: string;
  hasExperience: boolean;
}

export type PlatformRole = 'tenant_owner' | 'admin_cabang';
