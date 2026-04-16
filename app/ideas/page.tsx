'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Idea } from '@/types';
import * as Icon from '@/components/ui/icons';
import { InlineLoader } from '@/components/ui/lottie-loader';

/* ─── Three.js scene — loaded client-only ────────────────────── */
const LibraryScene = dynamic(() => import('./library-scene'), { ssr: false });

/* ─── Category colors ────────────────────────────────────────── */
const PALETTE = [
  '#3B82F6', '#6366F1', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4',
];

function getColor(index: number, category?: string) {
  const catMap: Record<string, string> = {
    web:      '#3B82F6',
    mobile:   '#6366F1',
    iot:      '#10B981',
    ia:       '#F59E0B',
    design:   '#EC4899',
    business: '#06B6D4',
  };
  if (category && catMap[category.toLowerCase()]) return catMap[category.toLowerCase()];
  return PALETTE[index % PALETTE.length];
}

/* ─── Detail panel ───────────────────────────────────────────── */
function IdeaPanel({ idea, onClose }: { idea: Idea; onClose: () => void }) {
  const color = getColor(0, idea.category);

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-full md:w-[440px] z-[400] flex flex-col overflow-hidden"
      style={{ background: 'var(--bg)', borderLeft: '1px solid var(--line)' }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: 'var(--line)' }}>
        <span className="label-sm" style={{ color: 'var(--oc-30)' }}>Idée de projet</span>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--surface)', color: 'var(--oc-40)' }}
        >
          <Icon.Close size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Image */}
        {idea.image && (
          <div className="relative w-full" style={{ height: 240 }}>
            <Image src={idea.image} alt={idea.title} fill className="object-cover" sizes="440px" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, var(--bg) 100%)' }} />
          </div>
        )}

        <div className="px-6 py-8 space-y-6">
          {/* Category + title */}
          {idea.category && (
            <span
              className="inline-flex text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ color, background: `${color}18`, border: `1px solid ${color}33` }}
            >
              {idea.category}
            </span>
          )}

          <h2 className="font-space text-2xl font-bold leading-tight" style={{ color: 'var(--txt)' }}>
            {idea.title}
          </h2>

          <p className="font-inter text-sm leading-relaxed" style={{ color: 'var(--oc-45)' }}>
            {idea.description}
          </p>

          {/* Accent divider */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, ${color}40 0%, transparent 100%)` }} />

          {/* PDF download */}
          {idea.pdfUrl ? (
            <a
              href={idea.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group"
              style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, color }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="12" x2="12" y2="18"/><polyline points="9 15 12 18 15 15"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-space text-sm font-semibold" style={{ color: 'var(--txt)' }}>Cahier des charges</p>
                <p className="label-sm mt-0.5" style={{ color: 'var(--oc-25)' }}>Télécharger le PDF complet</p>
              </div>
              <Icon.ArrowRight size={16} style={{ color, flexShrink: 0 }} />
            </a>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="label-sm" style={{ color: 'var(--oc-20)' }}>Cahier des charges non disponible</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function IdeasPage() {
  const { resolvedTheme }      = useTheme();
  const isDark                 = resolvedTheme !== 'light';
  const [ideas,    setIdeas]    = useState<Idea[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Idea | null>(null);

  useEffect(() => {
    fetch('/api/ideas')
      .then(r => r.json())
      .then(d => setIdeas(Array.isArray(d) ? d : []))
      .catch(() => setIdeas([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = useCallback((idea: Idea | null) => setSelected(idea), []);
  const handleClose  = useCallback(() => setSelected(null), []);

  /* keyboard close */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const ideasWithColors = ideas.map((idea, i) => ({ ...idea, color: getColor(i, idea.category) }));

  return (
    <main className="relative" style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 pt-28 pb-10 relative overflow-hidden">
        <div
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-space font-bold pointer-events-none select-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', color: 'rgba(16,185,129,0.04)', lineHeight: 1 }}
        >
          06
        </div>

        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-6 h-px" style={{ background: 'var(--oc-20)' }} />
          <span className="label-sm" style={{ color: 'var(--oc-30)' }}>Bibliothèque d'idées</span>
          <span className="label-sm" style={{ color: 'var(--oc-15)' }}>·</span>
          <span className="label-sm" style={{ color: '#10B981' }}>{ideas.length} idées</span>
        </motion.div>

        <motion.h1
          className="display-xl leading-none mb-4"
          style={{ color: 'var(--txt)', letterSpacing: '-0.03em', maxWidth: '14ch' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Des idées qui attendent.
        </motion.h1>
        <motion.h1
          className="display-xl leading-none mb-10"
          style={{ color: 'var(--oc-15)', letterSpacing: '-0.03em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          Prends la tienne.
        </motion.h1>

        <motion.p
          className="font-inter text-base md:text-lg max-w-lg leading-relaxed"
          style={{ color: 'var(--oc-35)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Chaque idée est livrée avec son cahier des charges. Clique sur un livre pour en savoir plus.
        </motion.p>
      </section>

      {/* ── 3D Library ──────────────────────────────────────────── */}
      <section className="relative w-full" style={{ height: loading ? 300 : 520 }}>
        {loading ? (
          <InlineLoader size="lg" className="h-full" />
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
              </svg>
            </div>
            <p className="font-space text-sm font-semibold" style={{ color: 'var(--oc-25)' }}>Aucune idée disponible</p>
          </div>
        ) : (
          <LibraryScene ideas={ideasWithColors} onSelect={handleSelect} selectedId={selected?.id ?? null} isDark={isDark} />
        )}
      </section>

      {/* ── List fallback (below canvas) ─────────────────────────── */}
      {!loading && ideas.length > 0 && (
        <section className="px-8 md:px-16 py-10">
          <p className="label-sm mb-6" style={{ color: 'var(--oc-20)' }}>Ou choisissez depuis la liste</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea, i) => {
              const color = getColor(i, idea.category);
              return (
                <motion.button
                  key={idea.id}
                  onClick={() => handleSelect(idea)}
                  className="text-left p-5 rounded-2xl transition-all duration-300 group"
                  style={{ background: 'var(--surface)', border: `1px solid var(--line)` }}
                  whileHover={{ y: -2 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-space text-xs font-bold"
                      style={{ background: `${color}18`, color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-sm font-semibold mb-1 truncate" style={{ color: 'var(--txt)' }}>{idea.title}</p>
                      <p className="label-sm line-clamp-2" style={{ color: 'var(--oc-30)' }}>{idea.description}</p>
                    </div>
                  </div>
                  {idea.category && (
                    <span
                      className="inline-flex mt-3 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ color, background: `${color}18` }}
                    >
                      {idea.category}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-10 border-t flex items-center justify-between mt-10" style={{ borderColor: 'var(--line)' }}>
        <span className="font-space text-sm font-semibold" style={{ color: 'var(--oc-20)' }}>
          prince<span style={{ color: '#10B981' }}>.</span>
        </span>
        <span className="label-sm" style={{ color: 'var(--oc-15)' }}>
          © {new Date().getFullYear()} — Tous droits réservés
        </span>
      </div>

      {/* ── Panel overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[390]"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <IdeaPanel idea={selected} onClose={handleClose} />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
