import { BranchTenant, StnkTransaction } from './types';

export const mockTenants: BranchTenant[] = [
  {
    id: 'T-01',
    name: 'SatuJasa - Cabang Depok Margonda',
    city: 'Depok',
    adminName: 'Rian Kurniawan',
    adminEmail: 'rian.depok@satujasastnk.com',
    activeOrders: 42,
    revenueThisMonth: 18450000,
    pricing: {
      perpanjangStnkMobil: 150000,
      perpanjangStnkMotor: 85000,
      balikNamaMobil: 350000,
      balikNamaMotor: 180000,
      mutasiKendaraan: 450000,
    }
  },
  {
    id: 'T-02',
    name: 'SatuJasa - Cabang Jakarta Selatan',
    city: 'Jakarta Selatan',
    adminName: 'Siti Rahma',
    adminEmail: 'siti.jaksel@satujasastnk.com',
    activeOrders: 78,
    revenueThisMonth: 34200000,
    pricing: {
      perpanjangStnkMobil: 175000,
      perpanjangStnkMotor: 95000,
      balikNamaMobil: 400000,
      balikNamaMotor: 200000,
      mutasiKendaraan: 500000,
    }
  },
  {
    id: 'T-03',
    name: 'SatuJasa - Cabang Bekasi Barat',
    city: 'Bekasi',
    adminName: 'Budi Hartono',
    adminEmail: 'budi.bekasi@satujasastnk.com',
    activeOrders: 29,
    revenueThisMonth: 12100000,
    pricing: {
      perpanjangStnkMobil: 140000,
      perpanjangStnkMotor: 80000,
      balikNamaMobil: 320000,
      balikNamaMotor: 160000,
      mutasiKendaraan: 420000,
    }
  }
];

export const mockTransactions: StnkTransaction[] = [
  {
    id: 'INV-2026-001',
    tenantName: 'SatuJasa - Cabang Depok Margonda',
    customerName: 'Ahmad Subarjo',
    vehiclePlate: 'B 3012 EFC',
    vehicleModel: 'Honda Vario 160 (2023)',
    serviceType: 'Perpanjang STNK Tahunan (Motor)',
    grandTotal: 185000, // Biaya jasa + estimasi PKB
    status: 'STNK Selesai',
    updatedAt: '12 Menit Lalu',
    progressHistory: [
      { status: 'Menerima Berkas', time: '21 Jun 2026, 09:12', description: 'Berkas diterima oleh Admin Rian di Cabang Margonda. Dokumen lengkap.', completed: true },
      { status: 'Cek Fisik', time: '21 Jun 2026, 11:30', description: 'Nomor mesin & nomor rangka berhasil dicek fisik dan digosok.', completed: true },
      { status: 'Proses Samsat', time: '22 Jun 2026, 08:30', description: 'Berkas masuk loket Samsat Depok untuk pencetakan STNK baru.', completed: true },
      { status: 'STNK Selesai', time: '22 Jun 2026, 14:00', description: 'STNK baru selesai dicetak, diserahkan ke biro jasa, siap diambil.', completed: true },
      { status: 'Diterima Customer', time: 'Pending', description: 'Menunggu kurir mengantar ke alamat customer atau diambil langsung.', completed: false }
    ]
  },
  {
    id: 'INV-2026-002',
    tenantName: 'SatuJasa - Cabang Jakarta Selatan',
    customerName: 'Diana Lestari',
    vehiclePlate: 'B 1988 SQA',
    vehicleModel: 'Toyota Avanza Veloz (2021)',
    serviceType: 'Balik Nama Kendaraan (Mobil)',
    grandTotal: 1250000,
    status: 'Proses Samsat',
    updatedAt: '45 Menit Lalu',
    progressHistory: [
      { status: 'Menerima Berkas', time: '20 Jun 2026, 14:20', description: 'KTP Asli, BPKB, & STNK diterima lengkap di cabang Jaksel.', completed: true },
      { status: 'Cek Fisik', time: '21 Jun 2026, 10:00', description: 'Cek fisik bantuan selesai diproses di Polda Metro Jaya.', completed: true },
      { status: 'Proses Samsat', time: '22 Jun 2026, 09:15', description: 'Diproses di bagian verifikasi faktur & balik nama BPKB/STNK.', completed: true },
      { status: 'STNK Selesai', time: 'Estimasi 24 Jun', description: 'Menunggu penerbitan lembar STNK baru & plat nomor baru.', completed: false },
      { status: 'Diterima Customer', time: 'Estimasi 25 Jun', description: 'Pengiriman via kurir premium SatuJasa.', completed: false }
    ]
  },
  {
    id: 'INV-2026-003',
    tenantName: 'SatuJasa - Cabang Bekasi Barat',
    customerName: 'Hendra Wijaya',
    vehiclePlate: 'B 6620 KGD',
    vehicleModel: 'Mitsubishi Pajero Sport',
    serviceType: 'Mutasi Kendaraan Keluar Kota',
    grandTotal: 1850000,
    status: 'Cek Fisik',
    updatedAt: '2 Jam Lalu',
    progressHistory: [
      { status: 'Menerima Berkas', time: '22 Jun 2026, 10:00', description: 'Berkas mutasi daerah asal Bekasi diserahkan ke kurir.', completed: true },
      { status: 'Cek Fisik', time: '22 Jun 2026, 15:40', description: 'Tahap pengesahan cek fisik kendaraan bermotor oleh Samsat.', completed: true },
      { status: 'Proses Samsat', time: 'Estimasi 26 Jun', description: 'Loket mutasi keluar / pencabutan berkas regional.', completed: false },
      { status: 'STNK Selesai', time: 'Estimasi 29 Jun', description: 'Penerbitan surat jalan sementara & berkas mutasi.', completed: false },
      { status: 'Diterima Customer', time: 'Estimasi 30 Jun', description: 'Berkas diserahkan ke owner untuk didaftarkan di Samsat tujuan.', completed: false }
    ]
  },
  {
    id: 'INV-2026-004',
    tenantName: 'SatuJasa - Cabang Depok Margonda',
    customerName: 'Kartika Sari',
    vehiclePlate: 'B 4110 SYD',
    vehicleModel: 'Mazda 2 Hatchback',
    serviceType: 'Perpanjang STNK 5 Tahunan + Plat',
    grandTotal: 840000,
    status: 'Terhambat',
    updatedAt: '3 Jam Lalu',
    progressHistory: [
      { status: 'Menerima Berkas', time: '19 Jun 2026, 13:00', description: 'STNK Lama, BPKB Fotokopi, dan KTP asli diserahkan.', completed: true },
      { status: 'Cek Fisik', time: '20 Jun 2026, 09:30', description: 'Gesek nomor mesin sukses.', completed: true },
      { status: 'Terhambat', time: '22 Jun 2026, 13:10', description: 'Terdapat kendala: KTP Asli tidak sesuai dengan BPKB (Butuh surat kuasa tambahan dari nama pemilik pertama).', completed: true },
      { status: 'Proses Samsat', time: 'Pending', description: 'Menunggu konfirmasi surat kuasa oleh customer.', completed: false },
      { status: 'STNK Selesai', time: 'Pending', description: 'Menunggu penyelesaian dokumen.', completed: false }
    ]
  }
];

export const publicFAQs = [
  {
    question: 'Apakah SatuJasa STNK bisa mengelola multi-cabang milik satu biro jasa?',
    answer: 'Ya, tentu saja! Platform ini didesain khusus untuk model bisnis multi-tenant. Sebagai Owner, Anda bisa menambahkan banyak cabang (tenant) dengan database operasional, admin, dan pricing yang terisolasi aman namun tetap terpantau dari satu dashboard pusat Anda.'
  },
  {
    question: 'Bagaimana cara membatasi hak akses admin cabang?',
    answer: 'Setiap admin cabang diberikan role "Admin Cabang" yang dikunci hanya untuk cabang tempat mereka ditugaskan. Mereka hanya bisa melihat dan memproses transaksi milik cabang mereka sendiri, sementara Anda sebagai Owner memiliki visibilitas 100% untuk seluruh cabang.'
  },
  {
    question: 'Berapa biaya transaksi yang dikenakan untuk berkas customer?',
    answer: 'Sebagai platform SaaS, SatuJasa tidak mengambil potongan atau komisi per berkas/transaksi yang Anda proses. Skema biaya adalah berlangganan paket bulanan (Subscription Plan) tetap sesuai kuota cabang yang Anda butuhkan tanpa ada biaya tak terduga.'
  },
  {
    question: 'Apakah customer biro jasa saya bisa tracking berkas secara mandiri?',
    answer: 'Ya! Kami menyediakan halaman Public Tracking independen. Cukup bagikan link monitoring atau berikan nomor resi (invoice) kepada customer. Mereka bisa memantau perkembangan berkas (mulai dari gesek fisik, entri Samsat, hingga STNK selesai dicetak) dari HP tanpa harus menanyakan status terus-menerus ke WhatsApp admin Anda.'
  },
  {
    question: 'Bisa menetapkan daftar harga (pricing) yang berbeda untuk masing-masing cabang?',
    answer: 'Sangat bisa. Kami paham bahwa biaya operasional di setiap cabang bergantung pada kedekatan dengan Samsat dan tingkat administrasi lokal. Owner dapat menyeting standard profit margin & Service Pricing khusus secara individual untuk masing-masing cabang.'
  },
  {
    question: 'Apakah sistem aman jika ada data tenant yang terhapus?',
    answer: 'SatuJasa STNK menggunakan teknologi cloud terisolasi. Seluruh log transaksi tercatat aman dengan audit trail lengkap. Tenant yang dinonaktifkan oleh owner atau superadmin tersimpan aman sesuai siklus retensi masa tenggang paket subscription.'
  },
  {
    question: 'Apakah platform ini mudah diakses dari smartphone atau tablet?',
    answer: '100% Responsif. Admin cabang yang sering mondar-mandir di lapangan (Samsat, cek fisik area, dll.) dapat mengupload bukti foto cek fisik dan mengubah status berkas langsung melalui browser HP mereka tanpa perlu mendownload aplikasi tambahan.'
  }
];
