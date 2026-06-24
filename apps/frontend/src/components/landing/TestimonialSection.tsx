import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Building, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0); // -1 for left, 1 for right

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
    {
      id: 3,
      name: 'Pak Hendra Kurniawan',
      role: 'Owner',
      company: 'Biro Jasa Kilat Utama',
      location: 'Bandung',
      quote: 'Fitur "Dynamic Pricing per Cabang" membantu kami menentukan margin jasa yang fleksibel. Biaya administrasi Samsat Bandung kota dan Kabupaten tentu berbeda, tapi semua bisa diset dalam 1 klik saja oleh owner. SatuJasa benar-benar game changer bagi bisnis legalitas kendaraan.',
      avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      avatarInitial: 'HK',
      stats: '3 Cabang • Efisiensi Waktu Kerja 50%',
      rating: 5,
    },
    {
      id: 4,
      name: 'Ibu Shinta Devina',
      role: 'Finance & Compliance',
      company: 'PT Global Legalisasi Global',
      location: 'Medan',
      quote: 'Laporan keuangan lintas tenant yang biasanya memakan waktu berhari-hari sekarang sudah terkonsolidasi instan. Kita bisa mendeteksi cabang mana yang performanya lambat atau berkas yang terhambat Samsat dengan cepat. Keamanan datanya juga terjamin karena ada pembatasan role admin.',
      avatarBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
      avatarInitial: 'SD',
      stats: 'Integrasi Keuangan 100% Akurat',
      rating: 5,
    }
  ];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            TESTIMONIAL SUKSES
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            Dipercaya oleh Biro Jasa STNK Terkemuka di Seluruh Indonesia
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Dengarkan kisah sukses langsung dari para Owner biro jasa yang berhasil melipatgandakan efisiensi operasional dan profit operasional sejak bermigrasi ke SatuJasa.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          
          <div className="overflow-hidden min-h-[420px] md:min-h-[340px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-200/60 p-6 sm:p-10 md:p-12"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  
                  {/* Left Side: Avatar & Badge */}
                  <div className="flex flex-col items-center text-center md:text-left md:items-start flex-shrink-0 w-full md:w-56">
                    <div className={`w-20 h-20 rounded-2xl ${current.avatarBg} text-white flex items-center justify-center font-bold text-2xl shadow-lg relative`}>
                      {current.avatarInitial}
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    
                    <h4 className="mt-4 font-bold text-lg text-slate-900 leading-tight">
                      {current.name}
                    </h4>
                    
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      {current.role}
                    </p>
                    
                    <div className="mt-2 flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
                      <Building className="h-3.5 w-3.5 text-blue-600" />
                      {current.company}
                    </div>
                    
                    <span className="mt-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {current.location}
                    </span>
                  </div>

                  {/* Right Side: Quote content */}
                  <div className="flex-1 relative">
                    <div className="absolute -top-6 -left-3 text-slate-100 pointer-events-none">
                      <Quote className="h-16 w-16 rotate-180" />
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-750 text-base md:text-lg leading-relaxed italic relative z-10 font-medium">
                      &ldquo;{current.quote}&rdquo;
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                        HASIL NYATA:
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg font-bold">
                        {current.stats}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center md:justify-end items-center gap-3 mt-8 relative z-20">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
              id="testimonial-prev-btn"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-1.5 text-slate-300 px-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  id={`testimonial-dot-${idx}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
              id="testimonial-next-btn"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
