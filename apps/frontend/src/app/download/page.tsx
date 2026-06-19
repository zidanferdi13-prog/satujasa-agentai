import type { Metadata } from 'next';
import DownloadPageClient from '@/components/landing/DownloadPageClient';

export const metadata: Metadata = {
  title: 'Download Aplikasi',
  description: 'Akses STNK SatuJasa dari dashboard web untuk PC dan aplikasi Android saat tersedia.',
  alternates: {
    canonical: '/download',
  },
};

export default function DownloadPage() {
  return <DownloadPageClient />;
}
