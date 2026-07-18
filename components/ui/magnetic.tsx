'use client';

import { useRef, ReactNode } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

/* Enveloppe magnétique : l'élément est attiré par le curseur,
   puis revient à sa place avec un ressort. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 160, damping: 14, mass: 0.12 });
  const y = useSpring(0, { stiffness: 160, damping: 14, mass: 0.12 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}
