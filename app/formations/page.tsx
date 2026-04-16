'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Formation } from '@/types';
import * as Icon from '@/components/ui/icons';
import { InlineLoader } from '@/components/ui/lottie-loader';

gsap.registerPlugin(ScrollTrigger);

/* ─── Type badge ─────────────────────────────────────────────── */
const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  video: {
    label: 'VIDÉO',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
  pdf: {
    label: 'PDF',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  zip: {
    label: 'ZIP',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.12)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      </svg>
    ),
  },
};

/* ─── Formation card ─────────────────────────────────────────── */
function FormationCard({ formation, index }: { formation: Formation; index: number }) {
  const meta = TYPE_META[formation.type] ?? TYPE_META.pdf;

  const handleAccess = () => {
    if (formation.fileUrl) window.open(formation.fileUrl, '_blank');
  };

  return (
    <motion.div
      layout
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        {formation.image ? (
          <Image
            src={formation.image}
            alt={formation.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${meta.bg} 0%, var(--surface) 100%)` }}
          >
            <span style={{ color: meta.color, opacity: 0.3 }}>
              {React.cloneElement(meta.icon as React.ReactElement, { width: 48, height: 48 })}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: 'linear-gradient(0deg, rgba(4,4,8,0.85) 0%, rgba(4,4,8,0.2) 50%, transparent 100%)' }}
        />

        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest"
            style={{ color: meta.color, background: meta.bg, backdropFilter: 'blur(8px)', border: `1px solid ${meta.color}22` }}
          >
            {meta.icon}
            {meta.label}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4">
          <span
            className="font-space text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(4,4,8,0.75)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {formation.price === 0 ? 'Gratuit' : `${formation.price.toLocaleString('fr-FR')} FCFA`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex-1">
          <h3 className="font-space text-base font-semibold mb-2" style={{ color: 'var(--txt)' }}>
            {formation.title}
          </h3>
          <p className="font-inter text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--oc-35)' }}>
            {formation.description}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--line)' }}>
          <div>
            <p className="label-sm" style={{ color: 'var(--oc-25)' }}>Prix</p>
            <p className="font-space text-xl font-bold" style={{ color: formation.price === 0 ? '#10B981' : meta.color }}>
              {formation.price === 0 ? 'Gratuit' : `${formation.price.toLocaleString('fr-FR')} FCFA`}
            </p>
          </div>
          <motion.button
            onClick={handleAccess}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            style={{ background: meta.color, color: '#fff' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Accéder
            <Icon.ArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Hover accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 ease-out"
        style={{ background: meta.color }}
      />
    </motion.div>
  );
}

/* ─── Empty state ────────────────────────────────────────────── */
function EmptyFormations() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-32 gap-6">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="font-space text-base font-semibold" style={{ color: 'var(--oc-25)' }}>Aucune formation disponible</p>
        <p className="label-sm mt-1" style={{ color: 'var(--oc-15)' }}>Les formations seront bientôt disponibles.</p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
import React from 'react';

export default function FormationsPage() {
  const headerRef = useRef<HTMLElement>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<'all' | 'video' | 'pdf' | 'zip'>('all');

  useEffect(() => {
    fetch('/api/formations')
      .then(r => r.json())
      .then(d => setFormations(Array.isArray(d) ? d : []))
      .catch(() => setFormations([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current!.querySelectorAll('.gsap-reveal'), {
        y: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.2,
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  const filtered = filter === 'all' ? formations : formations.filter(f => f.type === filter);
  const counts = {
    all: formations.length,
    video: formations.filter(f => f.type === 'video').length,
    pdf: formations.filter(f => f.type === 'pdf').length,
    zip: formations.filter(f => f.type === 'zip').length,
  };

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <section
        ref={headerRef}
        className="px-8 md:px-16 pt-28 pb-16 relative overflow-hidden"
      >
        <div
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-space font-bold pointer-events-none select-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', color: 'rgba(245,158,11,0.04)', lineHeight: 1 }}
        >
          05
        </div>

        <div className="gsap-reveal flex items-center gap-3 mb-8">
          <div className="w-6 h-px" style={{ background: 'var(--oc-20)' }} />
          <span className="label-sm" style={{ color: 'var(--oc-30)' }}>Formations</span>
          <span className="label-sm" style={{ color: 'var(--oc-15)' }}>·</span>
          <span className="label-sm" style={{ color: '#F59E0B' }}>{formations.length} disponibles</span>
        </div>

        <h1 className="gsap-reveal display-xl leading-none mb-4" style={{ color: 'var(--txt)', letterSpacing: '-0.03em', maxWidth: '14ch' }}>
          Apprendre.
        </h1>
        <h1 className="gsap-reveal display-xl leading-none mb-10" style={{ color: 'var(--oc-15)', letterSpacing: '-0.03em' }}>
          Progresser. Livrer.
        </h1>

        <p className="gsap-reveal font-inter text-base md:text-lg max-w-lg leading-relaxed" style={{ color: 'var(--oc-35)' }}>
          Des formations conçues par un praticien, pour des praticiens. Vidéos, PDF, templates — tout ce qu'il faut pour passer à l'action.
        </p>
      </section>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 pb-6">
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {(['all', 'video', 'pdf', 'zip'] as const).map((key) => {
            const active = filter === key;
            const meta = key === 'all' ? null : TYPE_META[key];
            const accentColor = key === 'all' ? '#F59E0B' : meta!.color;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300"
                style={{
                  color: active ? accentColor : 'var(--oc-25)',
                  background: active ? `${accentColor}1a` : 'transparent',
                  border: `1px solid ${active ? `${accentColor}4d` : 'var(--line)'}`,
                }}
              >
                {key === 'all' ? 'Tous' : TYPE_META[key].label}
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                  style={{ background: active ? `${accentColor}33` : 'var(--line)' }}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-10">
        {loading ? (
          <InlineLoader size="lg" className="h-64" />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length === 0 ? (
                <EmptyFormations />
              ) : (
                filtered.map((f, i) => (
                  <FormationCard key={f.id} formation={f} index={i} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ── Footer strip ─────────────────────────────────────────── */}
      <div className="px-8 md:px-16 py-10 border-t flex items-center justify-between mt-10" style={{ borderColor: 'var(--line)' }}>
        <span className="font-space text-sm font-semibold" style={{ color: 'var(--oc-20)' }}>
          prince<span style={{ color: '#F59E0B' }}>.</span>
        </span>
        <span className="label-sm" style={{ color: 'var(--oc-15)' }}>
          © {new Date().getFullYear()} — Tous droits réservés
        </span>
      </div>
    </main>
  );
}
