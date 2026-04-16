'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const universes = [
  { path: '/',            label: 'Accueil',    accent: '#6366F1', num: '00' },
  { path: '/about',       label: 'À propos',   accent: '#3B82F6', num: '01' },
  { path: '/services',    label: 'Services',   accent: '#F59E0B', num: '02' },
  { path: '/projects',    label: 'Projets',    accent: '#6366F1', num: '03' },
  { path: '/contact',     label: 'Contact',    accent: '#10B981', num: '04' },
  { path: '/formations',  label: 'Formations', accent: '#F59E0B', num: '05' },
  { path: '/ideas',       label: 'Idées',      accent: '#10B981', num: '06' },
];

export function FloatingNav() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = universes.find(u => u.path === pathname) ?? universes[0];
  const isLight = resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  /* ── Pill styles — clear contrast in both themes */
  const pillBg    = isLight
    ? 'rgba(255,255,255,0.92)'
    : 'rgba(12,12,12,0.85)';
  const pillBorder = isLight ? '#D4D0C8' : '#2a2a2a';
  const pillShadow = isLight
    ? '0 2px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)'
    : '0 2px 16px rgba(0,0,0,0.5)';

  return (
    <>
      {/* ── Top-right corner group ───────────────────────────────── */}
      <motion.div
        className="fixed top-6 right-6 z-[200] flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Theme toggle — always visible */}
        {mounted && (
          <motion.button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-full"
            style={{
              background: pillBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${pillBorder}`,
              boxShadow: pillShadow,
              color: isLight ? '#18171B' : 'rgba(255,255,255,0.6)',
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            title={resolvedTheme === 'dark' ? 'Thème clair' : 'Thème sombre'}
          >
            {resolvedTheme === 'dark'
              ? <Sun  className="w-3.5 h-3.5" />
              : <Moon className="w-3.5 h-3.5" />
            }
            <span
              className="text-[10px] font-semibold tracking-widest uppercase hidden sm:block"
              style={{ color: isLight ? '#18171B' : 'rgba(255,255,255,0.55)' }}
            >
              {resolvedTheme === 'dark' ? 'Clair' : 'Sombre'}
            </span>
          </motion.button>
        )}

        {/* Nav pill */}
        <motion.button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full"
          style={{
            background: pillBg,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${pillBorder}`,
            boxShadow: pillShadow,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: current.accent, boxShadow: `0 0 6px ${current.accent}` }}
          />
          <span
            className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: isLight ? '#18171B' : '#d4d4d4' }}
          >
            {current.label}
          </span>
          {/* Hamburger lines */}
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none"
            style={{ opacity: isLight ? 0.4 : 0.35, color: isLight ? '#18171B' : '#fff' }}
          >
            <line x1="0" y1="2" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="0" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.button>
      </motion.div>

      {/* ── Full-screen nav overlay ───────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col"
            style={{ background: isLight ? '#F7F6F3' : '#080808' }}
            initial={{ opacity: 0, clipPath: 'circle(0% at 95% 4%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 95% 4%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* ── Top bar */}
            <div
              className="flex items-center justify-between px-8 py-6 border-b"
              style={{ borderColor: isLight ? '#E4E1DB' : '#1e1e1e' }}
            >
              <span
                className="text-[11px] tracking-[0.2em] uppercase font-medium"
                style={{ color: isLight ? '#7A7570' : 'rgba(255,255,255,0.3)' }}
              >
                Navigation
              </span>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors"
                style={{ color: isLight ? '#7A7570' : 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = isLight ? '#18171B' : '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = isLight ? '#7A7570' : 'rgba(255,255,255,0.4)')}
              >
                Fermer
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* ── Universe links */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-center px-8 md:px-16 gap-0" style={{ scrollbarWidth: 'thin', scrollbarColor: isLight ? '#D4D0C8 transparent' : '#2a2a2a transparent' }}>
              {universes.map((u, i) => {
                const isActive = u.path === pathname;
                const inactiveColor  = isLight ? '#7A7570'               : 'rgba(255,255,255,0.18)';
                const hoverColor     = isLight ? '#18171B'               : '#ffffff';
                const numberInactive = isLight ? '#B5B0A8'               : 'rgba(255,255,255,0.22)';
                return (
                  <motion.button
                    key={u.path}
                    onClick={() => navigate(u.path)}
                    className="group relative flex items-center gap-6 py-5 border-b text-left w-full overflow-hidden"
                    style={{ borderColor: isLight ? '#E4E1DB' : '#1a1a1a' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={e => {
                      if (isActive) return;
                      const label = e.currentTarget.querySelector<HTMLElement>('[data-label]');
                      const num   = e.currentTarget.querySelector<HTMLElement>('[data-num]');
                      if (label) label.style.color = hoverColor;
                      if (num)   num.style.color   = hoverColor;
                    }}
                    onMouseLeave={e => {
                      if (isActive) return;
                      const label = e.currentTarget.querySelector<HTMLElement>('[data-label]');
                      const num   = e.currentTarget.querySelector<HTMLElement>('[data-num]');
                      if (label) label.style.color = inactiveColor;
                      if (num)   num.style.color   = numberInactive;
                    }}
                  >
                    {/* Number */}
                    <span
                      data-num
                      className="label-sm w-6 flex-shrink-0 transition-colors duration-300"
                      style={{ color: isActive ? u.accent : numberInactive }}
                    >
                      {u.num}
                    </span>

                    {/* Label */}
                    <span
                      data-label
                      className="display-md transition-all duration-300 group-hover:translate-x-1"
                      style={{ color: isActive ? u.accent : inactiveColor }}
                    >
                      {u.label}
                    </span>

                    {/* Arrow hint */}
                    <span
                      className="ml-auto text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0 font-medium"
                      style={{ color: u.accent }}
                    >
                      →
                    </span>

                    {/* Hover fill */}
                    <motion.span
                      className="absolute left-0 top-0 bottom-0 pointer-events-none w-full"
                      style={{ background: u.accent, originX: 0 }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: isLight ? 0.05 : 0.07 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* ── Footer: info + theme toggle */}
            <div
              className="px-8 py-5 border-t flex items-center justify-between"
              style={{ borderColor: isLight ? '#E4E1DB' : '#1e1e1e' }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="label-sm"
                  style={{ color: isLight ? '#B5B0A8' : 'rgba(255,255,255,0.2)' }}
                >
                  Prince Aïneel ONILOU
                </span>
                <span
                  className="label-sm"
                  style={{ color: isLight ? '#D5D0C8' : 'rgba(255,255,255,0.1)' }}
                >
                  ·
                </span>
                <span
                  className="label-sm"
                  style={{ color: isLight ? '#B5B0A8' : 'rgba(255,255,255,0.2)' }}
                >
                  Bénin
                </span>
              </div>

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200"
                  style={{
                    background: isLight ? 'rgba(24,23,27,0.06)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isLight ? '#D4D0C8' : '#2a2a2a'}`,
                    color: isLight ? '#18171B' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {resolvedTheme === 'dark'
                    ? <Sun  className="w-3.5 h-3.5" />
                    : <Moon className="w-3.5 h-3.5" />
                  }
                  <span className="text-[10px] font-semibold tracking-widest uppercase">
                    {resolvedTheme === 'dark' ? 'Clair' : 'Sombre'}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
