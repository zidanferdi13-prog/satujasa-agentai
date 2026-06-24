import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { publicFAQs } from '@/data';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-slate-50 py-20 border-b border-slate-100" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Pusat Informasi FAQ</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 sm:text-4xl">
            Pertanyaan yang Sering Diajukan Owner
          </h2>
          <p className="mt-4 text-sm text-slate-500">
            Temukan jawaban cepat atas pertanyaan yang paling sering diajukan pimpinan biro jasa sebelum mendaftarkan sistem cabang mereka.
          </p>
        </div>

        {/* Accordions list */}
        <div className="space-y-4">
          {publicFAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-150 bg-white shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  id={`faq-btn-${idx}`}
                >
                  <span className="text-sm flex items-center gap-2.5 text-slate-900 font-bold">
                    <HelpCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-normal bg-slate-50/50 border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Small contact support widget block */}
        <div className="mt-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-105 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Punya pertanyaan teknis custom tambahan?</h4>
              <p className="text-[11px] text-slate-500">Tim technical support kami siap menjawab lewat obrolan interaktif WhatsApp.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%2520SatuJasa%2520STNK%2520saya%2520ingin%2520tanya%2520fitur%2520custom..."
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-blue-200 bg-white hover:bg-blue-50 px-4 py-2 font-bold text-slate-700 text-xs transition-colors shadow-xs"
          >
            Hubungi Staf Ahli Kami
          </a>
        </div>

      </div>
    </section>
  );
}
