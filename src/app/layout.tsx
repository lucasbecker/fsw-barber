import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FSW Barber',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body className={nunito.className}>
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
