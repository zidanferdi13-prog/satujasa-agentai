import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronRight, Download, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenDemo: (plan: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export default function Navbar({ onOpenDemo, onScrollToSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Fitur', id: 'features' },
    { label: 'Alur Kerja', id: 'workflow' },
    { label: 'Hak Role', id: 'roles' },
    { label: 'Lacak Berkas', id: 'tracking-sandbox' },
    { label: 'Harga', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onScrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-slate-200/80 bg-white shadow-sm">
            <Image
              src="/logo.png"
              alt="Logo SatuJasa STNK"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1 leading-none">
              SatuJasa <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 uppercase tracking-wider">STNK</span>
            </div>
            <span className="text-[9px] text-slate-400 font-medium tracking-wide">Multi-Tenant Platform</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className="text-[15px] font-semibold text-slate-600 hover:text-blue-600 transition-colors pointer-events-auto cursor-pointer tracking-tight"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3.5 pl-6">
          <Link
            href="/download"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download App
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            Masuk
          </Link>
          <button
            onClick={() => onOpenDemo('Pro')}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
          >
            Minta Demo
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 bg-white"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className="block w-full text-left rounded-lg px-3 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <Link
                  href="/download"
                  className="block w-full text-center rounded-lg border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Download Aplikasi
                </Link>
                <Link
                  href="/auth/signin"
                  className="block w-full text-center rounded-lg border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Masuk ke Akun
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenDemo('Pro');
                  }}
                  className="block w-full text-center rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 cursor-pointer"
                >
                  Minta Demo Eksklusif
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
