'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import PainPoints from '@/components/landing/PainPoints';
import FeatureGrid from '@/components/landing/FeatureGrid';
import WorkflowSimulator from '@/components/landing/WorkflowSimulator';
import RolePreviewer from '@/components/landing/RolePreviewer';
import PublicTracker from '@/components/landing/PublicTracker';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import SupportWidget from '@/components/landing/SupportWidget';
import DemoModal from '@/components/landing/DemoModal';
import { Award, ArrowUpRight } from 'lucide-react';

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [preselectedPlan, setPreselectedPlan] = useState<string>('Pro');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenDemoModal = (planName: string) => {
    setPreselectedPlan(planName);
    setIsDemoModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0c1a30] selection:bg-blue-600 selection:text-white" id="main-landing-app">
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-100/50 z-[9999]">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 transition-all duration-100 ease-out shadow-[0_1px_4px_rgba(37,99,235,0.4)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar onOpenDemo={handleOpenDemoModal} onScrollToSection={handleScrollToSection} />
      <Hero onOpenDemo={handleOpenDemoModal} />

      <div className="relative bg-slate-900 border-t border-slate-800 py-10" id="trust-strip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div><span className="block text-3xl font-extrabold text-blue-400">34+</span><span className="text-[11px] text-slate-400">Biro Jasa Terbantu</span></div>
            <div><span className="block text-3xl font-extrabold text-blue-400">15.000+</span><span className="text-[11px] text-slate-400">Berkas Diproses</span></div>
            <div><span className="block text-3xl font-extrabold text-blue-400">99.8%</span><span className="text-[11px] text-slate-400">Akurasi Tracking</span></div>
            <div><span className="block text-3xl font-extrabold text-blue-400">70%</span><span className="text-[11px] text-slate-400">Efisiensi Admin</span></div>
          </div>
        </div>
      </div>

      <PainPoints />
      <FeatureGrid />
      <WorkflowSimulator />
      <RolePreviewer />
      <div id="tracking-sandbox">
        <PublicTracker />
      </div>
      <TestimonialSection />
      <div id="pricing">
        <PricingSection onOpenDemo={handleOpenDemoModal} />
      </div>
      <div id="faq">
        <FAQSection />
      </div>

      <section className="relative bg-gradient-to-br from-blue-900 to-indigo-950 py-16 text-center text-white" id="final-cta">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Award className="h-10 w-10 mx-auto text-sky-400 mb-4 animate-pulse" />
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">Siap Merapikan Operasional Biro Jasa Anda?</h3>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button onClick={() => handleOpenDemoModal('Plus')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 px-6 rounded-xl">
              Minta Demo Gratis <ArrowUpRight className="h-4 w-4 inline" />
            </button>
            <button onClick={() => handleScrollToSection('tracking-sandbox')} className="bg-slate-800 border border-slate-700 text-white font-bold text-xs py-3.5 px-6 rounded-xl">
              Coba Lacak Berkas
            </button>
          </div>
        </div>
      </section>

      <SupportWidget onOpenDemo={handleOpenDemoModal} />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} initialPlan={preselectedPlan} />
    </div>
  );
}
