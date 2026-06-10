const roles = [
  {
    icon: 'admin_panel_settings',
    title: 'Super Admin',
    desc: 'Akses penuh ke semua fitur dan konfigurasi sistem utama.',
  },
  {
    icon: 'store',
    title: 'Owner',
    desc: 'Melihat laporan semua cabang dan manajemen admin cabang.',
  },
  {
    icon: 'person',
    title: 'Admin Cabang',
    desc: 'Fokus pada operasional harian dan input data pelanggan.',
  },
];

export default function RoleSection() {
  return (
    <section className="py-24 bg-on-tertiary-fixed text-on-tertiary">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-6">
              Satu Sistem, Berbagai Peran
            </h2>
            <p className="text-on-tertiary/70 mb-10 text-body-lg">
              Berikan akses yang tepat untuk tim Anda. Lindungi data sensitif dengan
              Role-Based Access Control yang ketat.
            </p>
            <div className="space-y-6">
              {roles.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-4"
                >
                  <span className="material-symbols-outlined text-primary-fixed">{icon}</span>
                  <div>
                    <p className="font-bold text-primary-fixed">{title}</p>
                    <p className="text-sm text-on-tertiary/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Team collaboration"
              className="rounded-3xl soft-shadow grayscale hover:grayscale-0 transition-all duration-700 w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAnYb6OCMQJOj7BaONev5Hft-DfMOs8fbeh9w9dF4Bfp8BzrYiPnqUlKRiUfvzdDBOvNZxa4bOvplKqNxY5muKyjiGALvrjBQ_bVBjbZc8uj9NplA4Xy7xA9TysmGzueT4nMb2QLdKJYVJEytx5hPi-AxGyeWOsKpuHPLsuxenDx-WaukFOvLGtKgH5hMDydGLYPcGTPDdB3mbgBS5V9vz9d6CjBdavqcjE9JTAoJw7YRlbqBnH1nqzKHDDT0tXFeTV3u9aOKnNPlJ"
            />
            <div className="absolute -bottom-8 -right-8 p-8 bg-primary rounded-3xl text-on-primary soft-shadow hidden md:block">
              <p className="text-display-lg font-bold">100%</p>
              <p className="text-label-sm uppercase tracking-widest opacity-80">Data Control</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
