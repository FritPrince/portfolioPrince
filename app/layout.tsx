import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prince ONILOU - Développeur Web Fullstack',
  description: 'Portfolio de Prince ONILOU, développeur web fullstack spécialisé en React, Next.js, Node.js et technologies modernes.',
  keywords: 'développeur web, fullstack, React, Next.js, Node.js, portfolio, freelance',
  authors: [{ name: 'Prince ONILOU' }],
  creator: 'Prince ONILOU',
  openGraph: {
    title: 'Prince ONILOU - Développeur Web Fullstack',
    description: 'Portfolio de Prince ONILOU, développeur web fullstack spécialisé en React, Next.js, Node.js et technologies modernes.',
    url: 'https://fritprince.github.io/MyPortfolio/',
    siteName: 'Prince ONILOU Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prince ONILOU - Développeur Web Fullstack',
    description: 'Portfolio de Prince ONILOU, développeur web fullstack spécialisé en React, Next.js, Node.js et technologies modernes.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}