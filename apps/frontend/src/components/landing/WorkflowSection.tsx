const steps = [
  { icon: 'person_add', label: 'Customer Order', sublabel: 'Input data awal' },
  { icon: 'edit_note', label: 'Draft', sublabel: 'Pengecekan berkas' },
  { icon: 'hourglass_empty', label: 'On Process', sublabel: 'Proses di Samsat' },
  { icon: 'task', label: 'Ready', sublabel: 'Siap diambil' },
  { icon: 'verified', label: 'Completed', sublabel: 'Selesai & Lunas', done: true },
];

export default function WorkflowSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg">Alur Kerja Digital yang Mulus</h2>
          <p className="text-on-surface-variant mt-2">
            Transparansi penuh untuk Anda dan pelanggan
          </p>
        </div>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 px-8">
          {/* Progress line (desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-outline-variant/30 -z-10" />

          {steps.map(({ icon, label, sublabel, done }) => (
            <div key={label} className="flex flex-col items-center group">
              <div
                className={
                  done
                    ? 'w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-surface shadow-md'
                    : 'w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center border-4 border-surface shadow-md group-hover:bg-primary transition-colors'
                }
              >
                <span
                  className={`material-symbols-outlined text-3xl ${done ? 'text-white' : 'group-hover:text-white'}`}
                >
                  {icon}
                </span>
              </div>
              <div className="mt-4 text-center">
                <p className="font-bold text-label-md">{label}</p>
                <p className="text-[10px] text-on-surface-variant">{sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
