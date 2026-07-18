'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

/* ─── Transition « coup de surligneur » ───────────────────────
   À chaque navigation, deux panneaux inclinés balaient l'écran
   (safran puis encre) — le geste du marqueur, à l'échelle de la
   page. Une barre de progression safran suit le scroll. */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const wipe = {
    initial: { x: '0%' },
    animate: { x: '115%' },
  };

  return (
    <>
      {/* Barre de progression du scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9995] origin-left pointer-events-none"
        style={{ scaleX, height: 3, background: 'var(--accent-hi)' }}
        aria-hidden="true"
      />

      {/* Balayage — encre dessous, safran dessus, légèrement décalés */}
      {!reduce && (
        <>
          <motion.div
            className="fixed z-[9991] pointer-events-none"
            style={{ top: '-10%', bottom: '-10%', left: '-15%', width: '130%', background: 'var(--txt)', transform: 'skewX(-8deg)' }}
            initial={wipe.initial}
            animate={wipe.animate}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
          <motion.div
            className="fixed z-[9992] pointer-events-none"
            style={{ top: '-10%', bottom: '-10%', left: '-15%', width: '130%', background: 'var(--accent-hi)', transform: 'skewX(-8deg)' }}
            initial={wipe.initial}
            animate={wipe.animate}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Contenu — remonte doucement derrière le balayage */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
