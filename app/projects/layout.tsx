import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Des projets réels : applications mobiles, plateformes web, systèmes IoT. Des problèmes concrets, des solutions qui fonctionnent en production.',
  openGraph: {
    title: 'Projets | Prince Aïneel ONILOU',
    description: 'Des problèmes réels. Des solutions concrètes. Découvrez mes réalisations.',
    url: '/projects',
    images: [{ url: '/profilBlanc.png', width: 1200, height: 630, alt: 'Projets — Prince Aïneel ONILOU' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projets | Prince Aïneel ONILOU',
    description: 'Des problèmes réels. Des solutions concrètes.',
    images: ['/profilBlanc.png'],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
