import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formations',
  description: 'Des formations pratiques en développement web, mobile et design. Vidéos, PDF, templates — conçues par un praticien, pour passer à l\'action.',
  openGraph: {
    title: 'Formations | Prince Aïneel ONILOU',
    description: 'Apprendre. Progresser. Livrer. Des formations conçues par un praticien.',
    url: '/formations',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Formations — Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formations | Prince Aïneel ONILOU',
    description: 'Apprendre. Progresser. Livrer.',
    images: ['/profilBlanc.png'],
  },
};

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
