import { Providers } from '@/components/providers/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fio Condutor - Ateliê de Costura',
  description: 'Sistema de gestão para ateliê de costura',
  icons: {
    icon: '/logo-optimized.webp',
    apple: '/logo-optimized.webp'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
