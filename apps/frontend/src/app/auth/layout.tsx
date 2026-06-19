import type { Metadata } from 'next';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'Akses Akun',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return children;
}
