import React, { useState } from 'react';
import { Menu, X, FileCheck, Layers, ChevronRight } from 'lucide-react';
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1 leading-none">
              SatuJasa <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 uppercase tracking-wider">STNK</span>
            </div>
            <span className="text-[9px] text-slate-400 font-medium tracking-wide">Multi-Tenant Platform</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors pointer-events-auto cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleLinkClick('tracking-sandbox')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Lacak Resi Demo
          </button>
          <button
            onClick={() => onOpenDemo('Pro')}
            className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs px-4 py-2.5 shadow-md shadow-blue-500/10 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                  className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => handleLinkClick('tracking-sandbox')}
                  className="block w-full text-center rounded-lg border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Uji Coba Lacak Berkas
                </button>
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
