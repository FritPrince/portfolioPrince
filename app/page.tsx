'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import * as Icon from '@/components/ui/icons';
import { Magnetic } from '@/components/ui/magnetic';
import type { Project } from '@/types';

const WaveField = dynamic(() => import('@/components/ui/wave-field'), { ssr: false });

/* ═══ Données locales (fallback si l'API est vide) ═══════════ */
const FALLBACK_PROJECTS: Array<Pick<Project, 'id' | 'title' | 'description' | 'technologies' | 'category'> & { image?: string; demoUrl?: string }> = [
  {
    id: 'ct-construtech',
    title: 'CT ConstruTech',
    description: "Site d'un cabinet d'architecture et de construction — plus de 260 projets, visualisation 3D, rénovation.",
    technologies: ['Next.js', 'Three.js', 'Tailwind'],
    category: 'fullstack',
    demoUrl: 'https://ct-construtech.com',
  },
  {
    id: 'souw-travel',
    title: 'Souw Travel',
    description: "Agence de voyage — accompagnement visas, immigration et mobilité internationale.",
    technologies: ['Next.js', 'Node.js', 'MongoDB'],
    category: 'fullstack',
    demoUrl: 'https://souwtravel.com',
  },
  {
    id: 'donation-globe',
    title: 'Donation Globe',
    description: 'Visualisation géographique de dons sur un globe 3D interactif.',
    technologies: ['React', 'Three.js', 'TypeScript'],
    category: 'frontend',
    demoUrl: 'https://donation-omega-drab.vercel.app',
  },
  {
    id: 'ticketapp',
    title: 'TicketApp',
    description: 'Réservation en ligne avec QR code unique et alerte de passage.',
    technologies: ['Laravel', 'React', 'TypeScript'],
    category: 'fullstack',
  },
];

const ROLES = ['Développeur Fullstack', 'Designer UX/UI', 'Ingénieur IoT', 'Cybersécurité', 'Pianiste'];

const FACETTES = [
  { title: 'Le développeur', note: 'Depuis 2021, du code qui résout de vrais problèmes.' },
  { title: 'Le designer', note: 'Chez WAOUH MONDE, je traduis les idées en interfaces.' },
  { title: "L'ingénieur IoT", note: 'Là où le logiciel touche le monde physique.' },
  { title: 'Le pianiste', note: 'La musique, une autre façon de penser.' },
];

const SERVICES = [
  {
    id: 'web',
    title: 'Développement Web',
    desc: 'Sites vitrines, applications web, e-commerce, dashboards — du design à la mise en ligne.',
    tags: ['Next.js', 'React', 'Laravel', 'Node.js', 'TypeScript'],
  },
  {
    id: 'mobile',
    title: 'Développement Mobile',
    desc: 'Applications iOS & Android performantes, intuitives, pensées offline-first.',
    tags: ['React Native', 'Flutter', 'Expo'],
  },
  {
    id: 'design',
    title: 'Design UX/UI',
    desc: 'Interfaces belles, accessibles et centrées sur l’utilisateur. Du wireframe au prototype interactif.',
    tags: ['Figma', 'Design System', 'Prototypage'],
  },
  {
    id: 'iot',
    title: 'IoT & Systèmes embarqués',
    desc: 'Objets connectés, maisons intelligentes, automatisation — j’ai conçu la mienne, anti-vol et anti-incendie.',
    tags: ['Arduino', 'ESP32', 'MQTT', 'C/C++'],
  },
  {
    id: 'cyber',
    title: 'Cybersécurité',
    desc: 'Protection de sites web, reverse proxy, audit et prévention des vulnérabilités.',
    tags: ['Nginx', 'WAF', 'OWASP', 'TLS'],
  },
];

/* ═══ Heure locale à Cotonou ═════════════════════════════════ */
function CotonouTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Africa/Porto-Novo', hour: '2-digit', minute: '2-digit',
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time ? <>{time} — Cotonou</> : null;
}

/* ═══ Aperçu du site réel — le projet vivant dans la carte ═══ */
function SitePreview({ url, title }: { url: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ scale: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const scale = el.clientWidth / 1440;
      setDim({ scale, h: scale > 0 ? Math.ceil(el.clientHeight / scale) : 0 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Barre de navigateur */}
      <div
        className="flex items-center gap-1.5 px-4 flex-shrink-0"
        style={{ height: 36, background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}
      >
        {['#E8695A', '#F2B41B', '#3BA55D'].map(c => (
          <span key={c} className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />
        ))}
        <span className="label-sm ml-3 truncate" style={{ color: 'var(--txt-muted)' }}>{host}</span>
      </div>

      {/* Le site, rendu en vrai, à l'échelle */}
      <div ref={boxRef} className="relative flex-1 overflow-hidden">
        {dim.scale > 0 && (
          <iframe
            src={url}
            title={`Aperçu — ${title}`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute top-0 left-0 origin-top-left border-0 pointer-events-none"
            style={{ width: 1440, height: dim.h, transform: `scale(${dim.scale})` }}
          />
        )}
      </div>

      {/* Toute la zone est un lien vers le site */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/pv absolute inset-0 z-10"
        aria-label={`Visiter ${host}`}
      >
        <span
          className="label-sm absolute bottom-4 right-4 px-3 py-1.5 rounded-full opacity-0 group-hover/pv:opacity-100 transition-opacity duration-300"
          style={{ background: 'var(--accent-hi)', color: 'var(--ink)' }}
        >
          Visiter ↗
        </span>
      </a>
    </div>
  );
}

/* ═══ Reveal helper ══════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══ Page ═══════════════════════════════════════════════════ */
export default function HomePage() {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Array<any>>(FALLBACK_PROJECTS);
  const [openService, setOpenService] = useState<string | null>('web');

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted && resolvedTheme !== 'light';

  useEffect(() => {
    fetch('/api/projects')
      .then(r => (r.ok ? r.json() : []))
      .then((data: Project[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const featured = data.filter(p => p.featured);
        const picked = (featured.length >= 3 ? featured : data).slice(0, 4);
        if (picked.length) setProjects(picked);
      })
      .catch(() => {});
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col px-6 md:px-14 pt-8 pb-10 overflow-hidden">
        {/* L'onde — la nappe de particules qui répond au curseur */}
        {mounted && <WaveField isDark={isDark} />}

        {/* Brand row */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">prince<span style={{ color: 'var(--accent)' }}>.</span></span>
          <span className="label-sm hidden md:flex items-center gap-2 mr-44" style={{ color: 'var(--txt-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3BA55D' }} />
            Disponible pour projets
          </span>
        </div>

        {/* Statement */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl">
          <Reveal>
            <p className="label-sm mb-6" style={{ color: 'var(--txt-muted)' }}>
              Cotonou, Bénin — développeur indépendant
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="font-display font-semibold"
              style={{ fontSize: 'clamp(2.9rem, 8.2vw, 7rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }}
            >
              Je construis des produits <span className="marker">qui comptent</span>,
              <br className="hidden md:block" /> du web au monde physique.
            </h1>
          </Reveal>
          <Reveal delay={0.16} className="mt-8 max-w-2xl">
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
              Développeur fullstack, designer UX et ingénieur IoT — pianiste aussi, parce
              qu&apos;écrire du code et composer de la musique, c&apos;est le même geste :
              construire quelque chose de beau.
            </p>
          </Reveal>
          <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <button onClick={() => scrollTo('travaux')} className="btn-pill btn-ink">
                Voir mes travaux <Icon.ArrowDown size={14} />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => scrollTo('contact')} className="btn-pill">
                Me contacter
              </button>
            </Magnetic>
            <span className="flex items-center gap-3 ml-2">
              <span className="relative w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: 'var(--line)', transform: 'rotate(-4deg)' }}>
                <Image src="/profilNoire.png" alt="Prince Aïneel Onilou" fill className="object-cover object-top" sizes="40px" />
              </span>
              <span className="text-sm" style={{ color: 'var(--txt-muted)' }}>Prince Aïneel Onilou</span>
            </span>
          </Reveal>
        </div>

        {/* Bottom row */}
        <div className="relative z-10 flex items-end justify-between">
          <span className="label-sm" style={{ color: 'var(--txt-dim)' }}>Faites défiler</span>
          <span className="label-sm" style={{ color: 'var(--txt-muted)' }}><CotonouTime /></span>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════ */}
      <div className="marquee py-5" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }} aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map(dup => (
            <span key={dup} className="inline-flex items-center gap-10">
              {ROLES.map(r => (
                <span key={r} className="inline-flex items-center gap-10">
                  <span className="font-display font-medium text-2xl md:text-3xl whitespace-nowrap">{r}</span>
                  <span style={{ color: 'var(--accent-hi)', fontSize: '1.4rem' }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══ TRAVAUX — cartes empilées ═════════════════════════ */}
      <section id="travaux" className="px-6 md:px-14 pt-24 pb-32">
        <div className="flex items-end justify-between mb-14">
          <Reveal>
            <h2 className="font-display font-semibold" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', letterSpacing: '-0.015em' }}>
              Travaux <span className="marker">sélectionnés</span>
            </h2>
          </Reveal>
          <Link href="/projects" className="label-sm hidden md:flex items-center gap-2 pb-2 hover:opacity-70 transition-opacity" style={{ color: 'var(--txt-muted)' }}>
            Tout voir <Icon.ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className="stack-card"
              style={{ ['--stack-i' as string]: i }}
            >
              <div className="grid md:grid-cols-2 min-h-[420px]">
                {/* Texte */}
                <div className="flex flex-col justify-between p-8 md:p-12 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="label-sm" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="label-sm" style={{ color: 'var(--txt-dim)' }}>{p.category}</span>
                    </div>
                    <h3 className="font-display font-semibold mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', letterSpacing: '-0.01em' }}>
                      {p.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: 'var(--txt-muted)' }}>
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                      {(p.technologies ?? []).slice(0, 4).map((t: string) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${p.id}`}
                      className="btn-pill text-sm"
                      style={{ padding: '0.6rem 1.2rem' }}
                    >
                      Découvrir <Icon.ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
                {/* Le projet, montré en vrai : site live (hôte embeddable) > capture > numéro.
                    Les sites derrière une protection anti-bot (LWS…) refusent l'iframe :
                    pour eux, une capture uploadée via l'admin prend le relais. */}
                <div className="relative hidden md:block" style={{ background: 'var(--surface-2)' }}>
                  {p.demoUrl && /\.vercel\.app/.test(p.demoUrl) ? (
                    <SitePreview url={p.demoUrl} title={p.title} />
                  ) : p.image ? (
                    <Image src={p.image} alt={p.title} fill className="object-cover" sizes="50vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display font-semibold text-8xl select-none" style={{ color: 'var(--line)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 md:hidden">
          <Link href="/projects" className="btn-pill w-full justify-center">Tous les projets <Icon.ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* ══ À PROPOS ══════════════════════════════════════════ */}
      <section id="moi" className="px-6 md:px-14 py-28" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="grid md:grid-cols-5 gap-14 max-w-7xl mx-auto">
          <div className="md:col-span-3">
            <Reveal>
              <p className="label-sm mb-8" style={{ color: 'var(--txt-muted)' }}>Qui je suis</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-display font-medium leading-snug" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.4rem)', letterSpacing: '-0.01em' }}>
                Passionné d&apos;informatique depuis l&apos;adolescence, je crois que la technologie
                peut résoudre <span className="marker">n&apos;importe quel problème humain</span>.
                Du web au mobile, du design à l&apos;IoT — tant que l&apos;informatique peut apporter
                une solution, je suis là.
              </p>
            </Reveal>

            <div className="mt-14 flex flex-col">
              {FACETTES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.06}>
                  <Link href="/about" className="acc-row group flex items-center justify-between py-5 px-2">
                    <span className="font-display font-medium text-xl md:text-2xl">{f.title}</span>
                    <span className="text-sm hidden md:block text-right" style={{ color: 'var(--txt-muted)' }}>{f.note}</span>
                    <Icon.ArrowRight size={16} className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-10">
              <Link href="/about" className="btn-pill">Mon histoire complète <Icon.ArrowRight size={14} /></Link>
            </Reveal>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center gap-5">
            <div className="photo-tilt relative w-full max-w-sm aspect-[4/5]" style={{ background: 'var(--accent-hi)' }}>
              <Image src="/profil.png" alt="Prince Aïneel Onilou" fill className="object-cover object-top" sizes="(max-width: 768px) 90vw, 34vw" />
            </div>
            <span className="hand-note" style={{ color: 'var(--accent)' }}>en train de composer, probablement</span>
          </div>
        </div>
      </section>

      {/* ══ SERVICES — accordéon ══════════════════════════════ */}
      <section id="services" className="px-6 md:px-14 py-28 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <Reveal className="md:col-span-2">
            <h2 className="font-display font-semibold" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', letterSpacing: '-0.015em' }}>
              Ce que je peux <span className="marker">faire pour vous</span>
            </h2>
          </Reveal>
          <p className="self-end text-sm leading-relaxed" style={{ color: 'var(--txt-muted)' }}>
            Cinq domaines, une seule exigence : livrer quelque chose qui fonctionne, en production.
          </p>
        </div>

        <div>
          {SERVICES.map((s, i) => {
            const open = openService === s.id;
            return (
              <div key={s.id} className="acc-row">
                <button
                  onClick={() => setOpenService(open ? null : s.id)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between py-7 px-2 text-left gap-6"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="label-sm" style={{ color: open ? 'var(--accent)' : 'var(--txt-dim)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display font-medium" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)' }}>
                      {s.title}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xl leading-none"
                    style={{ borderColor: open ? 'var(--accent)' : 'var(--line)', color: open ? 'var(--accent)' : 'var(--txt-muted)' }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 px-2 md:pl-16 flex flex-col md:flex-row md:items-center gap-5 justify-between">
                        <p className="text-sm md:text-base max-w-xl leading-relaxed" style={{ color: 'var(--txt-muted)' }}>{s.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.tags.map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <Link href="/services" className="btn-pill">Explorer les services en détail <Icon.ArrowRight size={14} /></Link>
        </Reveal>
      </section>

      {/* ══ TRANSMISSION ══════════════════════════════════════ */}
      <section id="transmission" className="px-6 md:px-14 pb-28 max-w-7xl mx-auto">
        <Reveal>
          <p className="label-sm mb-10" style={{ color: 'var(--txt-muted)' }}>Transmission — pour la génération qui arrive</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <Link
              href="/formations"
              className="group flex flex-col justify-between gap-16 p-10 rounded-3xl border transition-transform duration-300 hover:-translate-y-1"
              style={{ borderColor: 'var(--line)', background: 'var(--surface)', minHeight: 280 }}
            >
              <div>
                <h3 className="font-display font-semibold text-3xl md:text-4xl mb-3">Formations</h3>
                <p className="text-sm md:text-base max-w-sm" style={{ color: 'var(--txt-muted)' }}>
                  Apprendre, progresser, livrer — des formations conçues par un praticien, pour des praticiens.
                </p>
              </div>
              <span className="label-sm flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                Voir les formations <Icon.ArrowRight size={12} />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/ideas"
              className="group flex flex-col justify-between gap-16 p-10 rounded-3xl transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--accent-hi)', color: 'var(--ink)', minHeight: 280 }}
            >
              <div>
                <h3 className="font-display font-semibold text-3xl md:text-4xl mb-3">Idées libres</h3>
                <p className="text-sm md:text-base max-w-sm" style={{ color: 'rgba(25,23,19,0.7)' }}>
                  Des idées d&apos;applications complètes, offertes avec leur cahier des charges.
                  Prends-en une — elle est à toi.
                </p>
              </div>
              <span className="label-sm flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                Ouvrir la bibliothèque <Icon.ArrowRight size={12} />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ CONTACT — footer géant inversé ════════════════════ */}
      <footer id="contact" className="px-6 md:px-14 pt-28 pb-10 flex flex-col justify-between min-h-[85vh]" style={{ background: 'var(--txt)', color: 'var(--bg)' }}>
        <div className="max-w-6xl">
          <Reveal>
            <p className="label-sm mb-8" style={{ opacity: 0.5 }}>Une idée, un projet, une question ?</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display font-semibold" style={{ fontSize: 'clamp(2.8rem, 9vw, 7.5rem)', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
              Travaillons<br />
              <span className="marker">ensemble</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.16} className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.25}>
              <a href="mailto:princeonilou@gmail.com" className="btn-pill btn-pill-solid text-base" style={{ padding: '1rem 1.9rem' }}>
                princeonilou@gmail.com
              </a>
            </Magnetic>
            <Link href="/contact" className="btn-pill" style={{ borderColor: 'rgba(239,237,230,0.25)', color: 'var(--bg)' }}>
              Formulaire de contact <Icon.ArrowRight size={14} />
            </Link>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <p className="text-sm" style={{ opacity: 0.55 }}>
              Réponse sous 24h — c&apos;est moi qui lis, pas un robot.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ borderTop: '1px solid rgba(239,237,230,0.15)' }}>
          <div className="flex items-center gap-6">
            <a href="https://github.com/FritPrince" target="_blank" rel="noopener noreferrer" className="label-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--bg)' }}>GitHub</a>
            <Link href="/contact" className="label-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--bg)' }}>LinkedIn</Link>
            <Link href="/contact" className="label-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--bg)' }}>WhatsApp</Link>
          </div>
          <span className="label-sm" style={{ opacity: 0.45 }}>
            © {new Date().getFullYear()} Prince Aïneel Onilou — composé à Cotonou · <CotonouTime />
          </span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })} className="label-sm flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: 'var(--bg)' }}>
            Retour en haut ↑
          </button>
        </div>
      </footer>
    </main>
  );
}
