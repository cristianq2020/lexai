import type { Metadata } from 'next';
import { Inter, Inter_Tight, Playfair_Display } from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-legal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'LexAI — Despacho Jurídico de Inteligencia Artificial',
    template: '%s | LexAI',
  },
  description:
    'El primer despacho digital premium donde la IA actúa como abogado especialista. Análisis, redacción y asesoramiento jurídico 24/7.',
  metadataBase: new URL(process.env['WEB_URL'] ?? 'http://localhost:3000'),
  openGraph: {
    title: 'LexAI — Despacho Jurídico IA',
    description: 'Asesoramiento jurídico premium con IA. 9 especialistas, 24/7.',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${interTight.variable} ${playfair.variable} min-h-screen`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lex-accent-gold focus:px-4 focus:py-2 focus:text-lex-bg-primary"
        >
          Saltar al contenido
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}