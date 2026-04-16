'use client';

import dynamic from 'next/dynamic';

// Dynamic import — keeps lottie-react out of the initial bundle
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

import meditationData from '@/public/lottie/meditation.json';

/* ─────────────────────────────────────────────────────────────
   Full-screen overlay — used for page transitions
   Pass `visible` to control mount/unmount externally.
───────────────────────────────────────────────────────────── */
export function PageLoader({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center pointer-events-none"
      style={{ background: 'var(--bg)' }}
    >
      <Lottie
        animationData={meditationData}
        loop
        autoplay
        style={{ width: 220, height: 220 }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inline loader — used while fetching data
   sizes: 'sm' 64px | 'md' 96px (default) | 'lg' 160px
───────────────────────────────────────────────────────────── */
const SIZE_MAP = { sm: 64, md: 96, lg: 160 };

export function InlineLoader({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const px = SIZE_MAP[size];
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie
        animationData={meditationData}
        loop
        autoplay
        style={{ width: px, height: px }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      />
    </div>
  );
}
