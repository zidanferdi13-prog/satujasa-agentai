import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "STNK SatuJasa - Kelola Bisnis Jasa STNK Lebih Cepat & Terukur",
  description: "Platform SaaS all-in-one untuk manajemen transaksi, notifikasi WhatsApp otomatis, dan laporan pendapatan real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <QueryProvider>{children}</QueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
