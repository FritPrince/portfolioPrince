import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { FloatingNav } from '@/components/layout/floating-nav';
import { Cursor } from '@/components/ui/cursor';
import { SmoothScroll } from '@/components/ui/smooth-scroll';
import { Toaster } from '@/components/ui/toaster';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prince-aineel.dev';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Prince Aïneel ONILOU — Portfolio',
    template: '%s | Prince Aïneel ONILOU',
  },
  description: 'Développeur Fullstack · Designer UX/UI · Ingénieur IoT · Cybersécurité · Pianiste — Basé à Cotonou, Bénin.',
  keywords: ['développeur fullstack', 'designer UX/UI', 'IoT', 'cybersécurité', 'portfolio', 'Bénin', 'Cotonou', 'React', 'Next.js'],
  authors: [{ name: 'Prince Aïneel ONILOU' }],
  openGraph: {
    title: 'Prince Aïneel ONILOU — Portfolio',
    description: 'Développeur Fullstack · Designer UX/UI · Ingénieur IoT · Cybersécurité · Pianiste',
    type: 'website',
    url: BASE_URL,
    siteName: 'Prince Aïneel ONILOU',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prince Aïneel ONILOU — Portfolio',
    description: 'Développeur Fullstack · Designer UX/UI · IoT · Cybersécurité',
    images: ['/profilBlanc.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <SmoothScroll />
          <Cursor />
          <FloatingNav />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
