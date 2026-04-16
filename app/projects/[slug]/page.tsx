'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { gsap } from 'gsap';
import Image from 'next/image';
import * as Icon from '@/components/ui/icons';
import { Project } from '@/types';
import { InlineLoader } from '@/components/ui/lottie-loader';

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 text-white/40 hover:text-white/80 transition-colors z-10"
        onClick={onClose}
      >
        <Icon.Close size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 label-sm text-white/30">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-6 text-white/40 hover:text-white/80 transition-colors z-10 p-2"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <Icon.ArrowLeft size={24} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={index}
        className="relative max-w-5xl w-full mx-16"
        style={{ maxHeight: '85vh', aspectRatio: '16/9' }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`Screenshot ${index + 1}`}
          fill
          className="object-contain rounded-xl"
          sizes="90vw"
        />
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-6 text-white/40 hover:text-white/80 transition-colors z-10 p-2"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <Icon.ArrowRight size={24} />
        </button>
      )}
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const params    = useParams();
  const router    = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const [project, setProject]   = useState<Project | null>(null);
  const [related,  setRelated]  = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    const id = params.slug as string;
    Promise.all([
      fetch(`/api/projects/${id}`).then(r => r.ok ? r.json() : null),
      fetch('/api/projects').then(r => r.json()),
    ]).then(([proj, all]) => {
      if (!proj) { router.replace('/projects'); return; }
      setProject(proj);
      setRelated(
        (Array.isArray(all) ? all : [])
          .filter((p: Project) => p.category === proj.category && p.id !== proj.id)
          .slice(0, 3)
      );
    }).finally(() => setLoading(false));
  }, [params.slug, router]);

  /* Header entrance once project is loaded */
  useEffect(() => {
    if (!project || !headerRef.current) return;
    gsap.fromTo(
      headerRef.current.querySelectorAll('.gsap-in'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.5 }
    );
  }, [project]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <InlineLoader size="lg" />
    </div>
  );

  if (!project) return null;

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Hero image ──────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: 'min(60vh, 600px)' }}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg) 30%, transparent) 0%, color-mix(in srgb, var(--bg) 90%, transparent) 80%, var(--bg) 100%)' }}
        />

        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          className="absolute top-6 left-8 md:left-16 flex items-center gap-2 label-sm text-white/40 hover:text-white/70 transition-colors"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          ← Retour aux projets
        </motion.button>
      </div>

      {/* ── Header ──────────────────────────────────────────────── */}
      <div ref={headerRef} className="px-8 md:px-16 -mt-20 relative z-10 mb-16">
        {/* Category + status */}
        <div className="gsap-in flex items-center gap-3 mb-5">
          <span
            className="label-sm px-2.5 py-1 rounded-full capitalize"
            style={{ color: '#6366F1', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            {project.category}
          </span>
          {project.featured && (
            <span className="label-sm px-2.5 py-1 rounded-full" style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Icon.Star size={11} className="inline-block mr-1" />Featured
            </span>
          )}
        </div>

        <h1 className="gsap-in display-lg text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
          {project.title}
        </h1>

        <p className="gsap-in font-inter text-white/45 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
          {project.description}
        </p>

        {/* Action links */}
        <div className="gsap-in flex items-center gap-3 flex-wrap">
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: '#6366F1', color: '#fff' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              Voir le site ↗
            </motion.a>
          )}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: 'transparent', color: 'var(--oc-50)', border: '1px solid var(--line)' }}
              whileHover={{ borderColor: 'var(--txt-muted)', color: 'var(--oc-80)' }}
            >
              GitHub →
            </motion.a>
          )}
        </div>
      </div>

      {/* ── Details grid ────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-10 border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">

          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="label-sm text-white/25 mb-4">Stack technique</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="label-sm text-white/25 mb-4">Type de projet</p>
            <p className="font-inter text-white/60 capitalize text-sm">{project.category}</p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="label-sm text-white/25 mb-4">Liens</p>
            <div className="flex flex-col gap-2">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-sm text-white/50 hover:text-white/80 transition-colors flex items-center gap-1.5"
                >
                  <Icon.Dot size={6} style={{ color: '#10B981' }} />
                  Production live
                </a>
              ) : (
                <span className="label-sm text-white/20">Pas encore en ligne</span>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-sm text-white/50 hover:text-white/80 transition-colors"
                >
                  Code source ↗
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────────────────────── */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-8 md:px-16 py-14 border-t" style={{ borderColor: 'var(--line)' }}>
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-6 h-px bg-white/20" />
            <span className="label-sm text-white/30">Captures d'écran</span>
            <span className="label-sm text-white/15">{project.gallery.length} images</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((img, i) => (
              <motion.div
                key={i}
                className="relative aspect-video overflow-hidden rounded-xl cursor-zoom-in group"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightbox({ open: true, index: i })}
              >
                <Image
                  src={img}
                  alt={`${project.title} — screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--oc-15)', backdropFilter: 'blur(8px)' }}>
                    <Icon.Eye size={16} style={{ color: '#fff' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox.open && project.gallery && (
          <Lightbox
            images={project.gallery}
            index={lightbox.index}
            onClose={() => setLightbox({ open: false, index: 0 })}
            onPrev={() => setLightbox(p => ({ ...p, index: (p.index - 1 + (project.gallery?.length ?? 1)) % (project.gallery?.length ?? 1) }))}
            onNext={() => setLightbox(p => ({ ...p, index: (p.index + 1) % (project.gallery?.length ?? 1) }))}
          />
        )}
      </AnimatePresence>

      {/* ── Related projects ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="px-8 md:px-16 py-16 border-t" style={{ borderColor: 'var(--line)' }}>
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-6 h-px bg-white/20" />
            <span className="label-sm text-white/30">Autres projets similaires</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p, i) => (
              <motion.div
                key={p.id}
                className="group cursor-pointer overflow-hidden rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/projects/${p.id}`)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-space text-sm font-semibold text-white/70 group-hover:text-white transition-colors mb-1.5">
                    {p.title}
                  </h3>
                  <p className="font-inter text-xs text-white/35 line-clamp-2">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <div
        className="px-8 md:px-16 py-16 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <p className="display-md text-white mb-2">Prêt à démarrer votre projet ?</p>
          <p className="font-inter text-white/30 text-sm">Parlons-en — c'est gratuit.</p>
        </div>
        <motion.a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
          style={{ background: '#6366F1', color: '#fff' }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
          whileTap={{ scale: 0.97 }}
        >
          Me contacter →
        </motion.a>
      </div>

    </main>
  );
}
