'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import * as Icon from '@/components/ui/icons';
import { Magnetic } from '@/components/ui/magnetic';
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
      style={{ background: 'rgba(15,13,10,0.94)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/40 hover:text-white/80 transition-colors z-10"
        onClick={onClose}
        aria-label="Fermer"
      >
        <Icon.Close size={24} />
      </button>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 label-sm text-white/40">
        {index + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button
          className="absolute left-6 text-white/40 hover:text-white/80 transition-colors z-10 p-2"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Image précédente"
        >
          <Icon.ArrowLeft size={24} />
        </button>
      )}

      <motion.div
        key={index}
        className="relative max-w-5xl w-full mx-16"
        style={{ maxHeight: '85vh', aspectRatio: '16/9' }}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`Capture ${index + 1}`}
          fill
          className="object-contain rounded-xl"
          sizes="90vw"
        />
      </motion.div>

      {images.length > 1 && (
        <button
          className="absolute right-6 text-white/40 hover:text-white/80 transition-colors z-10 p-2"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Image suivante"
        >
          <Icon.ArrowRight size={24} />
        </button>
      )}
    </motion.div>
  );
}

/* ─── Image de galerie — se révèle au scroll, pleine largeur ── */
function GalleryImage({ src, alt, index, onOpen }: { src: string; alt: string; index: number; onOpen: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      onClick={onOpen}
      className="relative w-full overflow-hidden cursor-zoom-in block"
      style={{ aspectRatio: '16/9', borderRadius: '1.5rem', background: 'var(--surface-2)' }}
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(10% 5% 10% 5% round 1.5rem)', opacity: 0.4 }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', opacity: 1 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 80vw"
      />
      <span className="label-sm absolute bottom-4 left-5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(15,13,10,0.55)', color: 'rgba(239,237,230,0.8)', backdropFilter: 'blur(6px)' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.button>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [next, setNext] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    const id = params.slug as string;
    setLoading(true);
    Promise.all([
      fetch(`/api/projects/${id}`).then(r => (r.ok ? r.json() : null)),
      fetch('/api/projects').then(r => r.json()),
    ]).then(([proj, all]) => {
      if (!proj) { router.replace('/projects'); return; }
      setProject(proj);
      const list: Project[] = Array.isArray(all) ? all : [];
      const idx = list.findIndex(p => p.id === proj.id);
      setNext(list.length > 1 ? list[(idx + 1) % list.length] : null);
    }).finally(() => setLoading(false));
  }, [params.slug, router]);

  /* Parallax du hero — l'image recule pendant que le titre avance */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-60%']);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <InlineLoader size="lg" />
    </div>
  );

  if (!project) return null;

  const gallery = project.gallery ?? [];

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ══ Hero cinématique — parallax au scroll ═════════════ */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: '88vh' }}>
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,13,10,0.25) 0%, rgba(15,13,10,0.05) 40%, rgba(15,13,10,0.82) 100%)' }}
        />

        {/* Fil d'Ariane */}
        <motion.div
          className="absolute top-8 left-6 md:left-14 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Link href="/projects" className="label-sm flex items-center gap-2 transition-opacity hover:opacity-70" style={{ color: 'rgba(239,237,230,0.75)' }}>
            <Icon.ArrowLeft size={12} /> Tous les projets
          </Link>
        </motion.div>

        {/* Titre géant posé sur l'image */}
        <motion.div className="absolute inset-x-0 bottom-0 px-6 md:px-14 pb-12 z-10" style={{ y: titleY }}>
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <span className="label-sm px-2.5 py-1 rounded-full capitalize" style={{ background: 'var(--accent-hi)', color: 'var(--ink)' }}>
              {project.category}
            </span>
            {project.featured && (
              <span className="label-sm" style={{ color: 'rgba(239,237,230,0.7)' }}>
                <Icon.Star size={11} className="inline-block mr-1" />Sélectionné
              </span>
            )}
          </motion.div>
          <motion.h1
            className="font-display font-semibold"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', lineHeight: 0.98, letterSpacing: '-0.02em', color: '#EFEDE6' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.title}
          </motion.h1>
        </motion.div>
      </div>

      {/* ══ Barre méta ════════════════════════════════════════ */}
      <div
        className="px-6 md:px-14 py-5 flex flex-wrap items-center justify-between gap-4"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <div className="flex items-center gap-5 flex-wrap">
          <span className="label-sm flex items-center gap-1.5" style={{ color: project.demoUrl ? 'var(--accent)' : 'var(--txt-dim)' }}>
            <Icon.Dot size={6} />{project.demoUrl ? 'En production' : 'En développement'}
          </span>
          <span className="label-sm" style={{ color: 'var(--txt-muted)' }}>{project.technologies.length} technologies</span>
        </div>
        <div className="flex items-center gap-3">
          {project.demoUrl && (
            <Magnetic strength={0.25}>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-solid text-sm" style={{ padding: '0.6rem 1.3rem' }}>
                Voir le site ↗
              </a>
            </Magnetic>
          )}
          {project.githubUrl && (
            <Magnetic strength={0.25}>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-pill text-sm" style={{ padding: '0.6rem 1.3rem' }}>
                Code source
              </a>
            </Magnetic>
          )}
        </div>
      </div>

      {/* ══ Corps — rail sticky + récit ═══════════════════════ */}
      <section className="px-6 md:px-14 py-20">
        <div className="grid md:grid-cols-12 gap-12">

          {/* Rail sticky */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-28 flex flex-col gap-10">
              <div>
                <p className="label-sm mb-4" style={{ color: 'var(--txt-muted)' }}>Stack technique</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-sm mb-3" style={{ color: 'var(--txt-muted)' }}>Type</p>
                <p className="font-inter text-sm capitalize">{project.category}</p>
              </div>
              <div>
                <p className="label-sm mb-3" style={{ color: 'var(--txt-muted)' }}>Statut</p>
                <p className="font-inter text-sm">{project.demoUrl ? 'En ligne, utilisé en production' : 'En cours de développement'}</p>
              </div>
            </div>
          </aside>

          {/* Récit */}
          <div className="md:col-span-8 lg:col-span-9">
            <motion.p
              className="font-display font-medium leading-snug mb-16"
              style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)', letterSpacing: '-0.01em', maxWidth: '28ch' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {project.description}
            </motion.p>

            {/* Galerie — chaque capture est un moment pleine largeur */}
            {gallery.length > 0 && (
              <div className="flex flex-col gap-10">
                {gallery.map((img, i) => (
                  <GalleryImage
                    key={i}
                    src={img}
                    alt={`${project.title} — capture ${i + 1}`}
                    index={i}
                    onOpen={() => setLightbox({ open: true, index: i })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ Lightbox ══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox.open && gallery.length > 0 && (
          <Lightbox
            images={gallery}
            index={lightbox.index}
            onClose={() => setLightbox({ open: false, index: 0 })}
            onPrev={() => setLightbox(p => ({ ...p, index: (p.index - 1 + gallery.length) % gallery.length }))}
            onNext={() => setLightbox(p => ({ ...p, index: (p.index + 1) % gallery.length }))}
          />
        )}
      </AnimatePresence>

      {/* ══ Projet suivant — porte plein écran ════════════════ */}
      {next && (
        <Link
          href={`/projects/${next.id}`}
          className="group relative block overflow-hidden"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          <div className="relative flex flex-col items-start justify-end px-6 md:px-14 py-20 min-h-[52vh]">
            {/* Aperçu qui s'anime au survol */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <Image
                src={next.image}
                alt={next.title}
                fill
                className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                sizes="100vw"
              />
              <div className="absolute inset-0" style={{ background: 'rgba(15,13,10,0.72)' }} />
            </div>

            <div className="relative z-10">
              <p className="label-sm mb-6 transition-colors" style={{ color: 'var(--txt-muted)' }}>
                <span className="group-hover:hidden">Projet suivant</span>
                <span className="hidden group-hover:inline" style={{ color: 'var(--accent-hi)' }}>Projet suivant</span>
              </p>
              <p
                className="font-display font-semibold transition-colors duration-500 group-hover:text-[#EFEDE6]"
                style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                {next.title}
                <span className="inline-block ml-4 transition-transform duration-500 group-hover:translate-x-3" style={{ color: 'var(--accent-hi)' }}>→</span>
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <div
        className="px-6 md:px-14 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <div>
          <p className="display-md mb-2">Un projet du même genre en tête ?</p>
          <p className="font-inter text-sm" style={{ color: 'var(--txt-muted)' }}>Parlons-en — c&apos;est gratuit.</p>
        </div>
        <Magnetic>
          <Link href="/contact" className="btn-pill btn-pill-solid">
            Me contacter →
          </Link>
        </Magnetic>
      </div>

    </main>
  );
}
