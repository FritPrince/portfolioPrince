'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import meditationData from '@/public/lottie/meditation.json';

export default function Template({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(true);

  // Hide the loader after the curtain duration
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 950);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Lottie page-transition curtain ── */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="page-curtain"
            className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-none"
            style={{ background: 'var(--bg)' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
              <Lottie
                animationData={meditationData}
                loop
                autoplay
                style={{ width: 200, height: 200 }}
                rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content fades in ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
