import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos',
  description: 'Développeur Fullstack, Designer UX, Ingénieur IoT et Pianiste. Découvrez qui est Prince Aïneel ONILOU — basé à Cotonou, Bénin.',
  openGraph: {
    title: 'À Propos | Prince Aïneel ONILOU',
    description: 'Développeur · Designer · Pianiste — Une identité, quatre univers.',
    url: '/about',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À Propos | Prince Aïneel ONILOU',
    description: 'Développeur · Designer · Pianiste — Une identité, quatre univers.',
    images: ['/profilBlanc.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
