import { Providers } from '@/components/providers/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ateliê Ponto a Ponto - Escola de Corte e Costura',
  description: 'Sistema de gestão para escola de corte e costura',
  icons: {
    icon: '/logo-no-background.webp',
    apple: '/logo-no-background.webp'
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
