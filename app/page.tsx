'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import * as Icon from '@/components/ui/icons';

gsap.registerPlugin(ScrollTrigger);

/* ─── Vanta Birds background ────────────────────────────────── */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      // Already injected — wait for it to actually finish loading
      if ((existing as HTMLScriptElement).dataset.loaded === 'true') { resolve(); return; }
      existing.addEventListener('load',  () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script') as HTMLScriptElement;
    s.src = src; s.async = true;
    s.onload  = () => { s.dataset.loaded = 'true'; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function VantaBirds({ isDark }: { isDark: boolean }) {
  const ref   = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vanta = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!ref.current) return;
      await loadScript('/three.r134.min.js');
      await loadScript('/vanta.birds.min.js');
      if (cancelled || !ref.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const VANTA = (window as any).VANTA;
      if (!VANTA?.BIRDS) return;

      if (vanta.current) vanta.current.destroy();

      vanta.current = VANTA.BIRDS({
        el:            ref.current,
        mouseControls: true,
        touchControls: true,
        gyroControls:  false,
        minHeight:     200,
        minWidth:      200,
        scale:         1.0,
        scaleMobile:   1.0,
        backgroundColor: isDark ? 0x04040a : 0xF7F6F3,
        color1:          0x3b82f6,
        color2:          0x6366f1,
        colorMode:       'lerp',
        birdSize:        1.2,
        wingSpan:        22,
        speedFactor:     0.8,
        quantity:        3,
        separation:      80,
        alignment:       50,
        cohesion:        50,
      });
    }

    init();
    return () => {
      cancelled = true;
      if (vanta.current) { vanta.current.destroy(); vanta.current = null; }
    };
  }, [isDark]);

  return <div ref={ref} className="absolute inset-0 z-0" />;
}

/* ─── Universe portals ──────────────────────────────────────── */
const universes = [
  {
    path: '/about',
    num: '01',
    label: 'À Propos',
    sub: 'Développeur · Designer · Pianiste',
    accent: '#3B82F6',
    desc: "L'homme derrière le code.",
  },
  {
    path: '/services',
    num: '02',
    label: 'Services',
    sub: 'Web · Mobile · IoT · Cybersec',
    accent: '#F59E0B',
    desc: 'Cinq univers. Une seule vision.',
  },
  {
    path: '/projects',
    num: '03',
    label: 'Projets',
    sub: '9 réalisations',
    accent: '#6366F1',
    desc: 'Des problèmes réels. Des solutions concrètes.',
  },
  {
    path: '/formations',
    num: '05',
    label: 'Formations',
    sub: 'Apprendre · Progresser',
    accent: '#F59E0B',
    desc: 'Des formations pour passer à l\'action.',
  },
  {
    path: '/ideas',
    num: '06',
    label: 'Idées',
    sub: 'Bibliothèque · Cahiers des charges',
    accent: '#10B981',
    desc: 'Des idées qui attendent ton exécution.',
  },
  {
    path: '/contact',
    num: '04',
    label: 'Contact',
    sub: 'Disponible',
    accent: '#10B981',
    desc: 'Transformons votre idée en réalité.',
  },
];

/* ─── Letter mask component ─────────────────────────────────── */
function RevealWord({
  text,
  delay = 0,
  className = '',
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter-mask"
          style={{ marginRight: char === ' ' ? '0.25em' : undefined }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── Roles list ────────────────────────────────────────────── */
const ROLES = [
  'Développeur Fullstack',
  'Designer UX/UI',
  'Ingénieur IoT',
  'Expert Cybersécurité',
  'Musicien Pianiste',
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  const router        = useRef(useRouter());
  const portalsRef    = useRef<HTMLDivElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  // Before mount resolvedTheme is undefined — default to dark (matches defaultTheme)
  const isDark     = !mounted ? true : resolvedTheme !== 'light';
  const profileSrc = isDark ? '/profilBlanc.png' : '/profilNoire.png';

  /* GSAP horizontal scroll for universe portals */
  useEffect(() => {
    const portals = portalsRef.current;
    const track   = trackRef.current;
    if (!portals || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: portals,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, portals);

    return () => ctx.revert();
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-between min-h-screen px-8 md:px-16 pt-28 pb-12 overflow-hidden">

        {/* Background Vanta Birds */}
        <VantaBirds isDark={isDark} />

        {/* ── Top label ─────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="label-sm" style={{ color: 'var(--oc-30)' }}>Portfolio</span>
          <span className="label-sm" style={{ color: 'var(--oc-15)' }}>·</span>
          <span className="label-sm" style={{ color: 'var(--oc-25)' }}>2026</span>
          <span className="label-sm" style={{ color: 'var(--oc-15)' }}>·</span>
          <span className="label-sm flex items-center gap-1" style={{ color: 'var(--oc-25)' }}><Icon.MapPin size={10} />Bénin</span>
        </motion.div>

        {/* ── Photo — absolue, bord droit, pleine hauteur ──────── */}
        <motion.div
          className="hidden md:block absolute right-0 top-0 bottom-0 z-[5]"
          style={{ width: '52%' }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Fondu gauche : intègre la photo au fond */}
          <div className="hero-fade-left absolute inset-0 z-10 pointer-events-none" />
          {/* Fondu bas */}
          <div className="hero-fade-bottom absolute inset-0 z-10 pointer-events-none" />
          {/* Animation flottante */}
          <motion.div
            className="relative w-full h-full"
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          >
            <Image
              src={profileSrc}
              alt="Prince Aïneel Onilou"
              fill
              priority
              className="object-cover object-top"
              sizes="52vw"
            />
          </motion.div>
        </motion.div>

        {/* ── Contenu principal : texte gauche ─────────────────── */}
        <div className="relative z-10 flex-1 flex items-center">

          {/* Texte */}
          <div className="flex flex-col">
            <h1
              className="display-xl leading-none mb-4"
              style={{ color: 'var(--txt)' }}
            >
              <RevealWord text="PRINCE" delay={0.3} className="block" />
              <span className="block">
                <RevealWord text="AÏNEEL" delay={0.5} />
                {' '}
                <motion.span
                  style={{ color: 'var(--oc-20)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <RevealWord text="ONILOU" delay={0.7} />
                </motion.span>
                <motion.span
                  style={{ color: '#3B82F6' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.05, duration: 0.4 }}
                >.</motion.span>
              </span>
            </h1>

            <motion.div
              className="h-px my-8"
              style={{ maxWidth: 420, background: 'var(--oc-10)' }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />

            <div className="flex flex-col gap-1.5">
              {ROLES.map((role, i) => (
                <motion.span
                  key={role}
                  className="font-inter text-sm md:text-base"
                  style={{ color: 'var(--oc-35)' }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.25 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {role}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="relative z-10 flex items-end justify-between">
          <motion.button
            onClick={() => document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3 group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <span className="label-sm transition-colors" style={{ color: 'var(--oc-40)' }}>
              Explorer mon univers
            </span>
            <motion.span
              style={{ color: 'var(--oc-30)' }}
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Icon.ArrowDown size={14} />
            </motion.span>
          </motion.button>

          <motion.div
            className="text-right hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <p className="label-sm" style={{ color: 'var(--oc-25)' }}>Disponible pour projets</p>
            <p className="label-sm mt-1 flex items-center gap-1.5 justify-end" style={{ color: '#10B981' }}>
              <Icon.Dot size={6} style={{ color: '#10B981' }} />Actif
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Universe portals (horizontal scroll) ─────────────── */}
      <div id="portals" ref={portalsRef} className="on-media overflow-hidden relative">
        {/* Video ambiance background */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <source src="/assets/video1.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, background: 'linear-gradient(180deg, rgba(4,4,8,0.85) 0%, rgba(4,4,8,0.7) 100%)' }}
        />

        {/* Section header */}
        <div className="relative z-10 px-8 md:px-16 py-16 border-t" style={{ borderColor: '#1e1e1e' }}>
          <motion.p
            className="label-sm text-white/25"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Mes univers — faites votre choix
          </motion.p>
        </div>

        {/* Horizontal track */}
        <div ref={trackRef} className="relative z-10 flex" style={{ willChange: 'transform' }}>
          {universes.map((u, i) => (
            <div
              key={u.path}
              className="h-scroll-panel flex-shrink-0 border-r flex flex-col justify-between px-10 md:px-16 py-16 group cursor-pointer relative overflow-hidden"
              style={{ borderColor: '#1e1e1e' }}
              onClick={() => router.current.push(u.path)}
            >
              {/* Accent hover fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"
                style={{ background: u.accent }}
              />

              {/* Top */}
              <div className="flex items-start justify-between">
                <span className="label-sm text-white/15">{u.num}</span>
                <span
                  className="label-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: u.accent }}
                >
                  <span className="flex items-center gap-1">Explorer <Icon.ArrowRight size={12} /></span>
                </span>
              </div>

              {/* Center — Big label */}
              <div>
                <p className="label-sm mb-4" style={{ color: u.accent }}>
                  {u.sub}
                </p>
                <h2
                  className="display-lg text-white/10 group-hover:text-white/80 transition-all duration-700"
                  style={{ lineHeight: '1' }}
                >
                  {u.label}
                </h2>
                <p className="font-inter text-sm text-white/25 mt-4 max-w-xs leading-relaxed">
                  {u.desc}
                </p>
              </div>

              {/* Bottom — accent line */}
              <div
                className="h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
                style={{ background: u.accent }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer strip ─────────────────────────────────────── */}
      <div
        className="px-8 md:px-16 py-10 border-t flex items-center justify-between"
        style={{ borderColor: '#1e1e1e' }}
      >
        <span className="font-space text-sm font-semibold text-white/20">
          prince<span style={{ color: '#3B82F6' }}>.</span>
        </span>
        <span className="label-sm text-white/15">
          © {new Date().getFullYear()} — Tous droits réservés
        </span>
      </div>
    </main>
  );
}
