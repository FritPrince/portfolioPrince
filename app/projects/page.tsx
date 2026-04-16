'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import * as Icon from '@/components/ui/icons';
import { InlineLoader } from '@/components/ui/lottie-loader';

gsap.registerPlugin(ScrollTrigger);

/* ─── Category filter (counts computed from live data) ──────── */
const CATEGORY_LABELS = [
  { key: 'all',       label: 'Tous' },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'frontend',  label: 'Frontend' },
  { key: 'mobile',    label: 'Mobile' },
];
/* ─── Project card ──────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  onHover,
}: {
  project: Project;
  index: number;
  onHover: (p: Project | null) => void;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      className="relative group cursor-pointer overflow-hidden rounded-2xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, borderColor: 'var(--txt-muted)' }}
      onClick={handleClick}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

        {/* Featured badge */}
        {project.featured && (
          <div
            className="absolute top-3 left-3 label-sm px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: 'rgba(99,102,241,0.9)', color: '#fff', backdropFilter: 'blur(8px)' }}
          >
            <Icon.Star size={10} />Featured
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#080808' }}
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
          >
            <span className="flex items-center gap-1.5">Voir le projet <Icon.ArrowRight size={13} /></span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-space text-sm font-semibold transition-colors" style={{ color: 'var(--oc-80)' }}>
            {project.title}
          </h3>
          <span className="label-sm ml-2 flex-shrink-0 capitalize" style={{ color: 'var(--oc-20)' }}>
            {project.category}
          </span>
        </div>

        <p className="font-inter text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--oc-40)' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
          {project.technologies.length > 3 && (
            <span className="tag">+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-px"
        style={{ background: 'linear-gradient(90deg, #6366F1, transparent)' }}
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

/* ─── Cursor preview (desktop) ──────────────────────────────── */
function CursorPreview({ project }: { project: Project | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const fn = (e: MouseEvent) => {
      gsap.to(el, {
        x: e.clientX - 75,
        y: e.clientY - 50,
        duration: 0.5,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={ref}
          className="fixed z-[100] pointer-events-none hidden md:block"
          style={{ top: 0, left: 0, width: 150, height: 100 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="150px"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Stats strip ───────────────────────────────────────────── */
function StatsStrip({ projects }: { projects: Project[] }) {
  const stats = [
    { value: projects.length.toString(), label: 'projets réalisés' },
    { value: projects.filter(p => p.demoUrl).length.toString(), label: 'en ligne' },
    { value: projects.filter(p => p.featured).length.toString(), label: 'featured' },
    { value: '3+', label: "années d'expérience" },
  ];

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 border-t border-b"
      style={{ borderColor: 'var(--line)' }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="px-8 py-6 border-r last:border-r-0"
          style={{ borderColor: 'var(--line)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <p className="font-space text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--txt)' }}>{s.value}</p>
          <p className="label-sm" style={{ color: 'var(--oc-25)' }}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setAllProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: 'all',       label: 'Tous',       count: allProjects.length },
    { key: 'fullstack', label: 'Full Stack', count: allProjects.filter(p => p.category === 'fullstack').length },
    { key: 'frontend',  label: 'Frontend',   count: allProjects.filter(p => p.category === 'frontend').length },
    { key: 'mobile',    label: 'Mobile',     count: allProjects.filter(p => p.category === 'mobile').length },
  ];

  const filtered = activeCategory === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory);

  /* Stagger header text on mount */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    gsap.fromTo(
      header.querySelectorAll('.gsap-reveal'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <section
        ref={headerRef}
        className="on-media px-8 md:px-16 pt-28 pb-16 relative overflow-hidden min-h-[55vh] flex flex-col justify-end"
      >
        {/* Background — VR headset */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/techsavvy-traveler-vr-headset-urban-street-with-travel-router-overlay-symbolizing-vr-travel-p.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(4,4,8,0.97) 0%, rgba(4,4,8,0.85) 40%, rgba(99,102,241,0.08) 70%, rgba(4,4,8,0.75) 100%)',
            }}
          />
        </div>

        {/* Big number background */}
        <div
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-space font-bold pointer-events-none select-none z-[1]"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', color: 'rgba(99,102,241,0.06)', lineHeight: 1 }}
        >
          03
        </div>

        <div className="relative z-10">
          <div className="gsap-reveal flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-white/20" />
            <span className="label-sm text-white/30">Projets</span>
            <span className="label-sm text-white/15">·</span>
            <span className="label-sm" style={{ color: '#6366F1' }}>{allProjects.length} réalisations</span>
          </div>

          <h1
            className="gsap-reveal display-xl text-white leading-none mb-4"
            style={{ letterSpacing: '-0.03em', maxWidth: '16ch' }}
          >
            Des problèmes réels.
          </h1>
          <h1
            className="gsap-reveal display-xl leading-none mb-10"
            style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '-0.03em' }}
          >
            Des solutions concrètes.
          </h1>

          <p className="gsap-reveal font-inter text-white/35 text-base md:text-lg max-w-lg leading-relaxed">
            Chaque projet ici est né d'un besoin réel. Du code qui fonctionne en production, des interfaces que de vraies personnes utilisent.
          </p>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <StatsStrip projects={allProjects} />

      {/* ── Filters + Grid ──────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-16">

        {/* Category filters */}
        <motion.div
          className="flex items-center gap-2 mb-10 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300"
              style={{
                color: activeCategory === cat.key ? '#6366F1' : 'var(--oc-25)',
                background: activeCategory === cat.key ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: `1px solid ${activeCategory === cat.key ? 'rgba(99,102,241,0.3)' : 'var(--line)'}`,
              }}
            >
              {cat.label}
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                style={{
                  background: activeCategory === cat.key ? 'rgba(99,102,241,0.3)' : 'var(--line)',
                }}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <InlineLoader size="lg" className="py-24" />
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onHover={setHoveredProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ── Custom cursor preview ────────────────────────────────── */}
      <CursorPreview project={hoveredProject} />

      {/* ── Footer strip ────────────────────────────────────────── */}
      <div
        className="px-8 md:px-16 py-16 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <p className="display-md mb-2" style={{ color: 'var(--txt)' }}>Une idée en tête ?</p>
          <p className="font-inter text-sm" style={{ color: 'var(--oc-30)' }}>Construisons-la ensemble.</p>
        </div>
        <motion.a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
          style={{ background: '#6366F1', color: '#fff' }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
          whileTap={{ scale: 0.97 }}
        >
          Démarrer un projet
          <Icon.ArrowRight size={14} />
        </motion.a>
      </div>

    </main>
  );
}
