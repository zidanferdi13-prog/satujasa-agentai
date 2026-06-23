'use client';

import React, { useState } from 'react';
import { Building, CheckCircle, ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  avatarBg: string;
  avatarInitial: string;
  stats: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'H. Rahmat Hidayat',
    role: 'Owner & Pendiri',
    company: 'Biro Jasa Rahmat Sejahtera',
    location: 'Jakarta Selatan',
    quote: 'Sebelum pakai SatuJasa, kami pusing mengelola 5 cabang di Jabodetabek. Data sering bocor, admin sering salah hitung komisi, dan konsumen bolak-balik nelpon nanya progress STNK. Sekarang semua terpantau dalam satu layar, omset naik 35% karena sistem kerja jauh lebih efisien!',
    avatarBg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    avatarInitial: 'HR',
    stats: 'Mengelola 5 Cabang • 1.200+ Berkas/Bulan',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ibu Linda Wijaya',
    role: 'Operational Director',
    company: 'CV Sinar Abadi STNK',
    location: 'Surabaya',
    quote: 'Kemudahan fitur "Public Tracking" sangat meringankan admin kami. Konsumen tinggal cek resi di website kami tanpa perlu login, status berkas terupdate otomatis saat selesai di Samsat. Sangat profesional dan meningkatkan kepercayaan customer korporat kami!',
    avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    avatarInitial: 'LW',
    stats: 'Kemitraan Korporat • B2B Client Naik 40%',
    rating: 5,
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 100 : -100, opacity: 0 }),
  };

  return (
    <section className="border-b border-slate-200/60 bg-slate-50 py-20" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
            TESTIMONIAL SUKSES
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Dipercaya oleh Biro Jasa STNK Terkemuka
          </h2>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="flex min-h-[420px] items-center justify-center overflow-hidden md:min-h-[340px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-100 sm:p-10 md:p-12"
              >
                <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                  <div className="flex w-full flex-shrink-0 flex-col items-center text-center md:w-56 md:items-start md:text-left">
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${current.avatarBg} text-2xl font-bold text-white shadow-lg`}>
                      {current.avatarInitial}
                      <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-emerald-500 p-1">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <h4 className="mt-4 text-lg font-bold leading-tight text-slate-900">{current.name}</h4>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{current.role}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Building className="h-3.5 w-3.5 text-blue-600" />
                      {current.company}
                    </div>
                    <span className="mt-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {current.location}
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute -left-3 -top-6 text-slate-100">
                      <Quote className="h-16 w-16 rotate-180" />
                    </div>
                    <div className="relative z-10 mb-4 flex gap-1">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="relative z-10 font-medium italic leading-relaxed text-slate-750 md:text-lg">
                      &ldquo;{current.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">HASIL NYATA:</span>
                      <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {current.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-20 mt-8 flex items-center justify-center gap-3 md:justify-end">
            <button type="button" onClick={handlePrev} className="cursor-pointer rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition-colors hover:text-slate-800">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5 px-2 text-slate-300">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'}`}
                />
              ))}
            </div>
            <button type="button" onClick={handleNext} className="cursor-pointer rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition-colors hover:text-slate-800">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
