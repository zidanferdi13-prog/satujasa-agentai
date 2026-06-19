import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import RoleSection from '@/components/landing/RoleSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import LandingAnimations from '@/components/landing/LandingAnimations';

export const metadata: Metadata = {
  title: 'Ruang Kendali Biro Jasa STNK',
  description:
    'Kelola transaksi STNK, tracking pelanggan, update status berkas, dan laporan cabang dalam satu dashboard SatuJasa.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <LandingAnimations />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <WorkflowSection />
      <RoleSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
