import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
        <div className="bg-primary-container p-12 md:p-20 rounded-[3rem] text-on-primary soft-shadow">
          <h2 className="font-headline-lg text-headline-lg md:text-[40px] mb-6">
            Siap digitalisasi operasional jasa STNK Anda?
          </h2>
          <p className="text-body-lg text-on-primary-container/80 mb-10 max-w-2xl mx-auto">
            Mulai rapikan transaksi, status dokumen, dan komunikasi pelanggan tanpa mengganti cara
            kerja tim secara drastis.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="bg-on-primary text-primary font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim"
            >
              Daftar Sekarang
            </Link>
            <Link href="/auth/help" className="bg-primary-fixed-dim/20 border border-on-primary/30 text-on-primary font-bold px-10 py-5 rounded-2xl hover:bg-on-primary/10 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed-dim">
              Bantuan Login
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent" />
      </div>
    </section>
  );
}
