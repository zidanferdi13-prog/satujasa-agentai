const steps = [
  { icon: 'person_add', label: 'Order masuk', sublabel: 'Admin input data pelanggan', tone: 'slate' },
  { icon: 'fact_check', label: 'Berkas dicek', sublabel: 'Kelengkapan dokumen dipastikan', tone: 'blue' },
  { icon: 'hourglass_empty', label: 'Diproses', sublabel: 'Proses berjalan di Samsat', tone: 'violet' },
  { icon: 'outgoing_mail', label: 'Siap ambil', sublabel: 'Pelanggan mendapat kabar', tone: 'folder' },
  { icon: 'verified', label: 'Selesai', sublabel: 'Lunas, selesai, dan tercatat', tone: 'green' },
];

const toneClasses: Record<string, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  violet: 'bg-[#eeefff] text-[#6161ff] border-[#d6d9fc]',
  folder: 'bg-[#fff3bf] text-[#8a5a00] border-[#ffe08a]',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function WorkflowSection() {
  return (
    <section className="py-20 md:py-28 overflow-hidden bg-white" id="workflow">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-primary font-bold tracking-[0.18em] text-xs uppercase">
            Alur berkas
          </span>
          <h2 className="mt-4 text-[32px] md:text-[52px] leading-[0.98] tracking-[-0.045em] font-black text-[var(--landing-ink)]">
            Satu berkas, satu jejak proses.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg leading-8 text-[var(--landing-muted)]">
            Admin mengubah status sekali. Owner membaca progresnya. Pelanggan mendapat kabar tanpa chat berulang.
          </p>
        </div>

        <div className="relative rounded-[36px] border border-[rgba(208,212,228,0.72)] bg-[#f8faff] p-4 md:p-6 shadow-[0_24px_70px_rgba(43,50,91,0.1)]">
          <div className="hidden md:block absolute left-10 right-10 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white shadow-inner" />
          <div className="hidden md:block absolute left-10 right-10 top-1/2 h-2 w-[82%] -translate-y-1/2 rounded-full bg-gradient-to-r from-[#6161ff] via-[#0d63d8] via-60% to-[#10b981]" />

          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-5">
            {steps.map(({ icon, label, sublabel, tone }, index) => (
              <div
                key={label}
                className="relative rounded-[28px] border border-white bg-white p-5 shadow-[0_16px_42px_rgba(43,50,91,0.08)]"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClasses[tone]}`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                  </div>
                  <span className="rounded-full bg-[#f5f6f8] px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-[var(--landing-muted)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-lg font-black tracking-[-0.03em] text-[var(--landing-ink)]">{label}</p>
                <p className="mt-2 text-xs leading-6 text-[var(--landing-muted)]">{sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
