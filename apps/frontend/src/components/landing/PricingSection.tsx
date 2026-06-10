const plans = [
  {
    name: 'Free',
    desc: 'Coba platform tanpa biaya',
    price: 'Gratis',
    period: '',
    features: [
      { text: 'Akses login & lihat menu', available: true },
      { text: '0 Tenant', available: true },
      { text: '0 Admin User', available: true },
      { text: 'Transaksi & laporan', available: false },
    ],
    cta: 'Daftar Gratis',
    highlight: false,
  },
  {
    name: 'Pro',
    desc: 'Untuk biro jasa 1 cabang',
    price: 'Hubungi Kami',
    period: '',
    features: [
      { text: '1 Tenant', available: true },
      { text: '1 Admin User', available: true },
      { text: 'Input & kelola transaksi', available: true },
      { text: 'Monitoring link pelanggan', available: true },
    ],
    cta: 'Pilih Pro',
    highlight: false,
  },
  {
    name: 'Plus',
    desc: 'Untuk biro jasa multi cabang',
    price: 'Hubungi Kami',
    period: '',
    features: [
      { text: '3 Tenant', available: true },
      { text: '3 Admin User (1/tenant)', available: true },
      { text: 'Semua fitur Pro', available: true },
      { text: 'Laporan per cabang', available: true },
    ],
    cta: 'Pilih Plus',
    highlight: true,
    badge: 'Populer',
  },
  {
    name: 'Expert',
    desc: 'Kustomisasi penuh untuk skala besar',
    price: 'Custom',
    period: '',
    features: [
      { text: 'Unlimited Tenant', available: true },
      { text: 'Unlimited Admin User', available: true },
      { text: 'Limit diset super admin', available: true },
      { text: 'Priority support', available: true },
    ],
    cta: 'Hubungi Kami',
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 bg-surface-container-lowest" id="pricing">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg">
            Pilih Paket Sesuai Kebutuhan Anda
          </h2>
          <p className="text-on-surface-variant mt-2">Transparan, tanpa biaya tersembunyi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? 'p-8 rounded-3xl bg-primary text-on-primary soft-shadow ring-4 ring-primary/20 relative z-10 flex flex-col'
                  : 'p-8 rounded-3xl border border-outline-variant hover:border-primary transition-all flex flex-col'
              }
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <h4 className="font-headline-md text-[20px] mb-2">{plan.name}</h4>
              <p
                className={`text-sm mb-6 ${plan.highlight ? 'text-on-primary/70' : 'text-on-surface-variant'}`}
              >
                {plan.desc}
              </p>

              <div className="mb-8">
                <span className="text-headline-lg font-bold">{plan.price}</span>
                {plan.period && (
                  <span
                    className={plan.highlight ? 'text-on-primary/70' : 'text-on-surface-variant'}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className={`flex items-center gap-2 text-sm ${!f.available ? 'opacity-50' : ''}`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        f.available
                          ? plan.highlight
                            ? 'text-on-primary'
                            : 'text-secondary'
                          : ''
                      }`}
                    >
                      {f.available ? 'check_circle' : 'cancel'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                className={
                  plan.highlight
                    ? 'w-full py-4 rounded-2xl bg-on-primary text-primary font-bold hover:bg-white/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim'
                    : plan.name === 'Expert'
                      ? 'w-full py-4 rounded-2xl border border-outline text-on-surface font-bold hover:bg-surface-container transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
                      : 'w-full py-4 rounded-2xl border border-primary text-primary font-bold hover:bg-primary/5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
