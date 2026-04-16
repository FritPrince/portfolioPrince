import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idées',
  description: 'Une bibliothèque d\'idées de projets avec cahiers des charges. Des idées qui attendent votre exécution — choisissez la vôtre.',
  openGraph: {
    title: 'Idées | Prince Aïneel ONILOU',
    description: 'Des idées qui attendent ton exécution. Bibliothèque de projets avec cahiers des charges.',
    url: '/ideas',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Bibliothèque d\'idées — Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Idées | Prince Aïneel ONILOU',
    description: 'Des idées qui attendent ton exécution.',
    images: ['/profilBlanc.png'],
  },
};

export default function IdeasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
