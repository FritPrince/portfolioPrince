'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import * as Icon from '@/components/ui/icons';
import { Project } from '@/types';

/* ─── Phone mockup shell ─────────────────────────────────────── */
function PhoneShell({
  project,
  scale = 1,
  opacity = 1,
  onClick,
  isActive,
}: {
  project: Project;
  scale?: number;
  opacity?: number;
  onClick?: () => void;
  isActive?: boolean;
}) {
  const isVideo = project.image?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div
      onClick={onClick}
      className="relative select-none"
      style={{
        width: 200,
        height: 420,
        flexShrink: 0,
        transform: `scale(${scale})`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
        cursor: isActive ? 'pointer' : 'pointer',
        transformOrigin: 'center bottom',
      }}
    >
      {/* Frame */}
      <div
        className="absolute inset-0 rounded-[36px]"
        style={{
          background: '#1c1c1e',
          border: isActive ? '2px solid rgba(255,255,255,0.15)' : '2px solid rgba(255,255,255,0.06)',
          boxShadow: isActive
            ? '0 50px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)'
            : '0 20px 50px rgba(0,0,0,0.6)',
          transition: 'border-color 0.4s, box-shadow 0.4s',
        }}
      />

      {/* Side buttons */}
      <div className="absolute -right-[3px] top-24 w-[3px] h-10 rounded-r-full" style={{ background: '#2a2a2a' }} />
      <div className="absolute -left-[3px] top-20 w-[3px] h-7 rounded-l-full" style={{ background: '#2a2a2a' }} />
      <div className="absolute -left-[3px] top-32 w-[3px] h-7 rounded-l-full" style={{ background: '#2a2a2a' }} />

      {/* Screen */}
      <div
        className="absolute overflow-hidden"
        style={{
          inset: 8,
          borderRadius: 28,
          background: 'var(--bg)',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full"
          style={{ width: 72, height: 20, background: '#1c1c1e' }}
        />

        {/* Media */}
        {project.image ? (
          isVideo ? (
            <video
              src={project.image}
              className="absolute inset-0 w-full h-full object-cover"
              muted loop autoPlay playsInline
            />
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="200px"
            />
          )
        ) : (
          /* Placeholder */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), var(--surface))' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              <Icon.Phone size={24} style={{ color: '#6366F1' }} />
            </div>
            <p className="label-sm text-white/30 text-center px-4">{project.title}</p>
          </div>
        )}

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}
        />

        {/* App name badge */}
        {isActive && (
          <motion.div
            className="absolute bottom-5 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span
              className="label-sm px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {project.title}
            </span>
          </motion.div>
        )}
      </div>

      {/* Home bar */}
      <div
        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full"
        style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.15)' }}
      />
    </div>
  );
}

/* ─── Detail modal ──────────────────────────────────────────── */
function AppDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const screens = [
    ...(project.image ? [project.image] : []),
    ...(project.gallery ?? []),
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  setActive(i => (i - 1 + screens.length) % screens.length);
      if (e.key === 'ArrowRight') setActive(i => (i + 1) % screens.length);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, screens.length]);

  const src     = screens[active] ?? '';
  const isVideo = src.match(/\.(mp4|webm|ogg)$/i) !== null;

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-3xl flex flex-col md:flex-row overflow-hidden rounded-3xl border"
        style={{ background: '#111', borderColor: 'var(--line)', maxHeight: '90vh' }}
        initial={{ scale: 0.88, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 40, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left — phone */}
        <div
          className="flex flex-col items-center justify-center p-8 gap-6 flex-shrink-0"
          style={{ background: 'var(--surface)', borderRight: '1px solid var(--line)', minWidth: 260 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative" style={{ width: 180, height: 380 }}>
                <div
                  className="absolute inset-0 rounded-[32px]"
                  style={{ background: '#1c1c1e', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
                />
                <div className="absolute overflow-hidden" style={{ inset: 8, borderRadius: 24, background: 'var(--bg)' }}>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 rounded-full" style={{ width: 60, height: 16, background: '#1c1c1e' }} />
                  {screens.length > 0 ? (
                    isVideo ? (
                      <video src={src} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <Image src={src} alt="capture" fill className="object-cover" sizes="180px" />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon.Phone size={28} style={{ color: 'rgba(255,255,255,0.1)' }} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.12)' }} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {screens.length > 1 && (
            <div className="flex items-center gap-1.5">
              {screens.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: active === i ? 18 : 6, height: 6, background: active === i ? '#6366F1' : '#2a2a2a' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — info */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-7 border-b" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="label-sm px-2.5 py-1 rounded-full capitalize" style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>Mobile</span>
                  {project.featured && (
                    <span className="label-sm px-2.5 py-1 rounded-full" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>Featured</span>
                  )}
                </div>
                <h3 className="display-sm text-white">{project.title}</h3>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1 mt-1">
                <Icon.Close size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-7 space-y-6">
            <p className="font-inter text-white/55 leading-relaxed text-sm">{project.description}</p>
            <div>
              <p className="label-sm text-white/20 mb-3">Stack technique</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            {screens.length > 1 && (
              <div>
                <p className="label-sm text-white/20 mb-3">{screens.length} captures</p>
                <div className="grid grid-cols-4 gap-2">
                  {screens.map((s, i) => (
                    <button key={i} onClick={() => setActive(i)}
                      className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all"
                      style={{ borderColor: active === i ? '#6366F1' : 'transparent', background: 'var(--surface)' }}>
                      {s.match(/\.(mp4|webm)$/i)
                        ? <video src={s} className="w-full h-full object-cover" muted />
                        : <Image src={s} alt="" fill className="object-cover" sizes="60px" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-7 pt-0 flex gap-3 flex-wrap">
            {project.demoUrl && (
              <motion.a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: '#6366F1', color: '#fff' }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                Voir le projet <Icon.ExternalLink size={13} />
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid var(--line)' }}
                whileHover={{ borderColor: '#3a3a3a', color: 'rgba(255,255,255,0.7)' }}>
                GitHub <Icon.ArrowRight size={13} />
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main carousel ──────────────────────────────────────────── */
export function PhoneLibrary() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [current,  setCurrent]  = useState(0);
  const [modal,    setModal]    = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects?category=mobile')
      .then(r => r.json())
      .then(d => { const arr = Array.isArray(d) ? d : []; setProjects(arr); })
      .finally(() => setLoading(false));
  }, []);

  const prev = useCallback(() => setCurrent(i => (i - 1 + projects.length) % projects.length), [projects.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % projects.length), [projects.length]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (modal) return;
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [prev, next, modal]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Icon.Spinner size={20} style={{ color: '#F59E0B' }} />
      </motion.div>
    </div>
  );

  if (projects.length === 0) return (
    <div className="text-center py-16">
      <p className="label-sm text-white/20">Aucune application mobile disponible</p>
    </div>
  );

  const active = projects[current];
  const prevP  = projects[(current - 1 + projects.length) % projects.length];
  const nextP  = projects[(current + 1) % projects.length];

  return (
    <div className="w-full">

      {/* ── Carousel ─────────────────────────────────────────── */}
      <div className="relative flex items-end justify-center gap-0 py-8" style={{ minHeight: 480, perspective: '1200px' }}>

        {/* Prev phone */}
        {projects.length > 1 && (
          <motion.div
            className="absolute"
            style={{ left: 'calc(50% - 270px)', bottom: 20, zIndex: 1 }}
            initial={false}
            animate={{ opacity: 1 }}
          >
            <PhoneShell
              project={prevP}
              scale={0.68}
              opacity={0.35}
              onClick={prev}
            />
          </motion.div>
        )}

        {/* Active phone — center */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneShell
              project={active}
              isActive
              onClick={() => setModal(active)}
            />
            {/* Tap hint */}
            <motion.div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="label-sm text-white/25">Appuyez pour explorer</span>
              <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Next phone */}
        {projects.length > 1 && (
          <motion.div
            className="absolute"
            style={{ right: 'calc(50% - 270px)', bottom: 20, zIndex: 1 }}
          >
            <PhoneShell
              project={nextP}
              scale={0.68}
              opacity={0.35}
              onClick={next}
            />
          </motion.div>
        )}
      </div>

      {/* ── App info + nav ───────────────────────────────────── */}
      <div className="mt-14 flex flex-col items-center gap-6">

        {/* Info block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + '-info'}
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className="label-sm px-2.5 py-1 rounded-full"
                style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                Mobile
              </span>
              {active.featured && (
                <span className="label-sm px-2.5 py-1 rounded-full" style={{ color: '#6366F1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  Featured
                </span>
              )}
            </div>
            <h3 className="font-space text-xl font-semibold text-white mb-2">{active.title}</h3>
            <p className="font-inter text-sm text-white/35 leading-relaxed line-clamp-2">{active.description}</p>

            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {active.technologies.slice(0, 3).map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
              {active.technologies.length > 3 && (
                <span className="tag">+{active.technologies.length - 3}</span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation row */}
        <div className="flex items-center gap-5">
          {/* Prev */}
          <motion.button
            onClick={prev}
            disabled={projects.length <= 1}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'rgba(255,255,255,0.4)' }}
            whileHover={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}
            whileTap={{ scale: 0.93 }}
          >
            <Icon.ArrowLeft size={16} />
          </motion.button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-400"
                style={{
                  width:      current === i ? 24 : 6,
                  height:     6,
                  background: current === i ? '#F59E0B' : '#2a2a2a',
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <motion.button
            onClick={next}
            disabled={projects.length <= 1}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', color: 'rgba(255,255,255,0.4)' }}
            whileHover={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}
            whileTap={{ scale: 0.93 }}
          >
            <Icon.ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Counter */}
        <p className="label-sm text-white/20">
          {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </p>
      </div>

      {/* ── Detail modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {modal && <AppDetail project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
