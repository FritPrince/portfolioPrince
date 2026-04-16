import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Disponible pour projets freelance et collaborations. Transformons votre idée en réalité — contactez Prince Aïneel ONILOU.',
  openGraph: {
    title: 'Contact | Prince Aïneel ONILOU',
    description: 'Disponible pour nouveaux projets. Transformons votre idée en réalité.',
    url: '/contact',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Contact — Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Prince Aïneel ONILOU',
    description: 'Disponible pour nouveaux projets.',
    images: ['/profilBlanc.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
