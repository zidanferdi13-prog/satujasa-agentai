'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Bagaimana sistem tracking bekerja?',
    answer:
      'Setiap transaksi akan mendapatkan QR Code unik. Pelanggan cukup scan atau masukkan nomor plat di halaman tracking publik untuk melihat status berkas mereka secara real-time.',
  },
  {
    question: 'Apakah data bisnis saya aman?',
    answer:
      'Kami menggunakan enkripsi tingkat perbankan dan backup rutin harian. Data Anda adalah milik Anda sepenuhnya dan tidak akan dibagikan ke pihak ketiga.',
  },
  {
    question: 'Bagaimana cara notifikasi WhatsApp terkirim?',
    answer:
      'SatuJasa terintegrasi dengan gateway WhatsApp resmi. Sistem akan mengirim pesan otomatis saat status berubah (misal: Selesai) atau saat ada tagihan baru.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-6">
      <button
        className="w-full flex justify-between items-center text-left font-bold"
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>
        <span
          className="material-symbols-outlined transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {open && <div className="mt-4 text-on-surface-variant">{answer}</div>}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-24 bg-surface-container" id="faq">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg">Pertanyaan Umum</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
