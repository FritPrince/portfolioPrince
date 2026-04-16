import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Développement mobile, web, design UX/UI, IoT et cybersécurité. Cinq univers d\'expertise au service de vos projets.',
  openGraph: {
    title: 'Services | Prince Aïneel ONILOU',
    description: 'Mobile · Web · Design · IoT · Cybersécurité — Cinq univers, une seule vision.',
    url: '/services',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Services — Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Prince Aïneel ONILOU',
    description: 'Mobile · Web · Design · IoT · Cybersécurité',
    images: ['/profilBlanc.png'],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
