'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { PhoneLibrary } from '@/components/sections/phone-library';
import Link from 'next/link';
import * as Icon from '@/components/ui/icons';

gsap.registerPlugin(ScrollTrigger);

/* ─── Universe config ───────────────────────────────────────── */
const UNIVERSES = [
  { id: 'mobile',  num: '01', label: 'Mobile',      accent: '#F59E0B' },
  { id: 'web',     num: '02', label: 'Web',          accent: '#3B82F6' },
  { id: 'design',  num: '03', label: 'Design',       accent: '#8B5CF6' },
  { id: 'iot',     num: '04', label: 'IoT',          accent: '#10B981' },
  { id: 'cyber',   num: '05', label: 'Cybersécurité',accent: '#F43F5E' },
];

/* ─── Universe sidebar nav ──────────────────────────────────── */
function UniverseNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-5">
      {UNIVERSES.map(u => (
        <button
          key={u.id}
          onClick={() => onChange(u.id)}
          className="group flex items-center gap-3"
        >
          <motion.div
            className="rounded-full"
            style={{ background: u.accent }}
            animate={{
              width: active === u.id ? 28 : 6,
              height: 6,
              opacity: active === u.id ? 1 : 0.3,
            }}
            transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
          />
          <span
            className="label-sm transition-all duration-300 overflow-hidden"
            style={{
              color: active === u.id ? u.accent : 'rgba(255,255,255,0.35)',
              maxWidth: active === u.id ? 120 : 0,
            }}
          >
            {u.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

/* ─── Section: Mobile ───────────────────────────────────────── */
function MobileUniverse() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
        >
          <p className="label-sm mb-4" style={{ color: '#F59E0B' }}>01 — Développement Mobile</p>
          <h2 className="display-lg mb-3" style={{ color: 'var(--txt)' }}>
            Vos idées.<br />
            <span style={{ color: '#F59E0B' }}>Vos apps.</span>
          </h2>
          <p className="font-inter max-w-md mb-16 text-base leading-relaxed" style={{ color: 'var(--oc-40)' }}>
            iOS, Android, natif ou cross-platform — je construis des applications mobiles
            qui résolvent de vrais problèmes. Chaque téléphone ci-dessous en est la preuve.
          </p>
        </motion.div>

        {/* The phone library */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16,1,0.3,1] }}
        >
          <PhoneLibrary />
        </motion.div>

        {/* Tech stack */}
        <motion.div
          className="mt-16 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {['React Native', 'Flutter', 'Expo', 'TypeScript', 'Push Notifs', 'Offline-first'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Section: Web ──────────────────────────────────────────── */
function WebUniverse() {
  const browserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = browserRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      }
    );
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 py-20"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="label-sm mb-4" style={{ color: '#3B82F6' }}>02 — Développement Web</p>
          <h2 className="display-lg mb-6" style={{ color: 'var(--txt)' }}>
            Du concept<br />
            <span style={{ color: '#3B82F6' }}>au live.</span>
          </h2>
          <p className="font-inter mb-8 text-base leading-relaxed max-w-md" style={{ color: 'var(--oc-40)' }}>
            Sites vitrines, plateformes SaaS, e-commerce, dashboards — je couvre l'ensemble
            du cycle de développement, du design system au déploiement.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {['Next.js', 'React', 'Laravel', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'PostgreSQL'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 font-inter text-sm" style={{ color: '#3B82F6' }}>
            Voir les projets web <Icon.ArrowRight size={14} />
          </Link>
        </div>

        {/* Browser mockup */}
        <div ref={browserRef}>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="flex-1 mx-4 rounded-full px-3 py-1 text-xs font-inter text-white/20" style={{ background: 'var(--surface-2)' }}>
                prince-aineel.dev
              </div>
            </div>
            {/* Browser content */}
            <div className="p-6 space-y-3" style={{ minHeight: 220 }}>
              <div className="h-6 rounded" style={{ background: 'var(--surface-2)', width: '60%' }} />
              <div className="h-3 rounded" style={{ background: '#161616', width: '80%' }} />
              <div className="h-3 rounded" style={{ background: '#161616', width: '65%' }} />
              <div className="grid grid-cols-3 gap-3 mt-6">
                {['#3B82F6', '#6366F1', '#10B981'].map((c, i) => (
                  <div key={i} className="rounded-lg h-20" style={{ background: c + '15', border: `1px solid ${c}20` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section: Design ───────────────────────────────────────── */
function DesignUniverse() {
  const cards = [
    { label: 'Wireframing',  icon: <Icon.Layout size={18} /> },
    { label: 'Prototypage',  icon: <Icon.Layers size={18} /> },
    { label: 'Design System',icon: <Icon.Grid size={18} /> },
    { label: 'UI Responsive',icon: <Icon.Monitor size={18} /> },
    { label: 'UX Research',  icon: <Icon.Eye size={18} /> },
    { label: 'Handoff Dev',  icon: <Icon.Share size={18} /> },
  ];

  return (
    <div
      className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 py-20"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="label-sm mb-4" style={{ color: '#8B5CF6' }}>03 — Design UX/UI</p>
          <h2 className="display-lg mb-6" style={{ color: 'var(--txt)' }}>
            Interfaces qui<br />
            <span style={{ color: '#8B5CF6' }}>parlent d'elles-mêmes.</span>
          </h2>
          <p className="font-inter max-w-md text-base leading-relaxed" style={{ color: 'var(--oc-40)' }}>
            Chaque pixel a une raison d'être. Je conçois des interfaces centrées sur l'utilisateur —
            belles, accessibles et cohérentes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              className="p-6 rounded-2xl border group hover:-translate-y-1 transition-transform duration-300"
              style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <span className="group-hover:text-[#8B5CF6] transition-colors duration-300 block mb-4" style={{ color: 'var(--oc-20)' }}>
                {c.icon}
              </span>
              <p className="font-space text-sm font-semibold transition-colors" style={{ color: 'var(--oc-50)' }}>
                {c.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Figma', 'Photoshop', 'Adobe XD', 'Prototypage interactif'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section: IoT ──────────────────────────────────────────── */
function IotUniverse() {
  const [active, setActive] = useState<string | null>(null);
  const nodes = [
    { id: 'light',   label: 'Éclairage',     icon: <Icon.Bulb size={18} />,        x: '20%', y: '20%' },
    { id: 'lock',    label: 'Sécurité',       icon: <Icon.Lock size={18} />,        x: '70%', y: '15%' },
    { id: 'temp',    label: 'Température',    icon: <Icon.Thermometer size={18} />, x: '80%', y: '60%' },
    { id: 'camera',  label: 'Caméra',         icon: <Icon.Camera size={18} />,      x: '15%', y: '70%' },
    { id: 'energy',  label: 'Énergie',        icon: <Icon.Zap size={18} />,         x: '50%', y: '50%' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 py-20"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="label-sm mb-4" style={{ color: '#10B981' }}>04 — IoT & Systèmes embarqués</p>
          <h2 className="display-lg mb-6" style={{ color: 'var(--txt)' }}>
            Le monde physique,<br />
            <span style={{ color: '#10B981' }}>connecté.</span>
          </h2>
          <p className="font-inter mb-8 text-base leading-relaxed max-w-md" style={{ color: 'var(--oc-40)' }}>
            J'ai conçu une maison intelligente contrôlable à distance, avec des systèmes de sécurité
            anti-vol et anti-incendie. L'IoT, c'est rendre l'environnement intelligent.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Arduino', 'ESP32', 'C/C++', 'MQTT', 'Capteurs', 'Raspberry Pi'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Interactive smart home diagram */}
        <div
          className="relative rounded-3xl border"
          style={{ height: 340, borderColor: 'var(--line)', background: 'var(--surface)' }}
        >
          <p className="absolute top-4 left-4 label-sm" style={{ color: '#10B981' }}>
            Maison intelligente — vue schématique
          </p>
          {nodes.map(node => (
            <motion.button
              key={node.id}
              className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setActive(node.id)}
              onHoverEnd={() => setActive(null)}
            >
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  background: active === node.id ? '#10B98120' : 'var(--surface)',
                  borderColor: active === node.id ? '#10B981' : 'var(--line)',
                  boxShadow: active === node.id ? '0 0 20px #10B98130' : 'none',
                  color: active === node.id ? '#10B981' : 'var(--oc-30)',
                }}
                animate={{ borderColor: active === node.id ? '#10B981' : 'var(--line)' }}
              >
                {node.icon}
              </motion.div>
              {active === node.id && (
                <motion.span
                  className="label-sm"
                  style={{ color: '#10B981' }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {node.label}
                </motion.span>
              )}
            </motion.button>
          ))}
          {/* Connection lines (static SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
            <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="70%" y1="15%" x2="50%" y2="50%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="80%" y1="60%" x2="50%" y2="50%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="15%" y1="70%" x2="50%" y2="50%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Section: Cybersecurity ────────────────────────────────── */
function CyberUniverse() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const lines = [
      '> Initialisation du reverse proxy...',
      '> Analyse des requêtes entrantes [OK]',
      '> Détection XSS — Bloqué ⛔',
      '> WAF activé — Règles OWASP chargées',
      '> Injection SQL tentée — Bloquée ⛔',
      '> Rate limiting: 429 renvoyé',
      '> Certificat TLS renouvelé [OK]',
      '> Audit de sécurité terminé — Score: A+',
      '> Système protégé ✓',
    ];
    let i = 0;
    setLogs([]);
    const interval = setInterval(() => {
      if (i < lines.length) {
        setLogs(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => { clearInterval(interval); setLogs([]); };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-center px-8 md:px-24 lg:px-32 py-20"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="label-sm mb-4" style={{ color: '#F43F5E' }}>05 — Cybersécurité</p>
          <h2 className="display-lg mb-6" style={{ color: 'var(--txt)' }}>
            Votre site.<br />
            <span style={{ color: '#F43F5E' }}>Blindé.</span>
          </h2>
          <p className="font-inter mb-8 text-base leading-relaxed max-w-md" style={{ color: 'var(--oc-40)' }}>
            Mon prochain projet : une application de protection web via reverse proxy intelligent,
            capable de bloquer les attaques XSS, injections SQL, et DDoS — en temps réel.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Nginx', 'Reverse Proxy', 'WAF', 'OWASP', 'TLS/SSL', 'Rate limiting'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div
          className="rounded-2xl overflow-hidden border font-mono text-sm"
          style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F43F5E' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
            <span className="ml-2 text-xs" style={{ color: 'var(--oc-20)' }}>security-shield.log</span>
          </div>
          <div className="p-5 space-y-2 min-h-[240px]">
            {logs.filter(Boolean).map((line, i) => (
              <motion.p
                key={i}
                className="text-xs leading-relaxed"
                style={{
                  color: line.includes('⛔') ? '#F43F5E' :
                         line.includes('[OK]') || line.includes('✓') || line.includes('A+') ? '#10B981' :
                         'var(--oc-35)'
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {line}
              </motion.p>
            ))}
            {logs.length < 9 && (
              <span className="text-xs cursor-blink" style={{ color: '#F43F5E' }}>█</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ServicesPage() {
  const [activeUniverse, setActiveUniverse] = useState('mobile');
  const sectionsRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger to update active universe
  useEffect(() => {
    const ctx = gsap.context(() => {
      UNIVERSES.forEach(u => {
        ScrollTrigger.create({
          trigger: `#universe-${u.id}`,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveUniverse(u.id),
          onEnterBack: () => setActiveUniverse(u.id),
        });
      });
    }, sectionsRef);

    return () => ctx.revert();
  }, []);

  const scrollToUniverse = (id: string) => {
    document.getElementById(`universe-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const current = UNIVERSES.find(u => u.id === activeUniverse)!;

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>
      {/* ── Page hero with background ────────────────────────── */}
      <div className="on-media relative px-8 md:px-16 pt-28 pb-16 border-b overflow-hidden" style={{ borderColor: '#1e1e1e' }}>
        {/* Robot/AI background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/robot-arm-controls-humanity-like-puppets-neural-networks-ai-superiority-singularity-information.jpg"
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(4,4,8,0.94) 0%, rgba(4,4,8,0.78) 55%, rgba(4,4,8,0.55) 100%)' }}
          />
        </div>
        <div className="relative z-10">
        <p className="label-sm text-white/25 mb-3">Services</p>
        <h1 className="display-md text-white mb-2">
          Cinq univers.{' '}
          <motion.span
            key={activeUniverse}
            style={{ color: current.accent }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Une expertise.
          </motion.span>
        </h1>
        <p className="font-inter text-white/30 text-sm max-w-xl">
          Chaque domaine est une histoire à part entière. Explorez-les.
        </p>

        {/* Universe tabs */}
        <div className="flex flex-wrap gap-2 mt-8">
          {UNIVERSES.map(u => (
            <button
              key={u.id}
              onClick={() => scrollToUniverse(u.id)}
              className="px-4 py-2 rounded-full label-sm transition-all duration-300 border"
              style={{
                color: activeUniverse === u.id ? u.accent : 'rgba(255,255,255,0.55)',
                borderColor: activeUniverse === u.id ? u.accent + '40' : 'rgba(255,255,255,0.18)',
                background: activeUniverse === u.id ? u.accent + '10' : 'rgba(255,255,255,0.04)',
              }}
            >
              {u.num} {u.label}
            </button>
          ))}
        </div>
        </div>{/* end z-10 wrapper */}
      </div>

      {/* Universe sidebar (desktop) */}
      <UniverseNav active={activeUniverse} onChange={scrollToUniverse} />

      {/* Sections */}
      <div ref={sectionsRef}>
        <div id="universe-mobile"><MobileUniverse /></div>
        <div id="universe-web"><WebUniverse /></div>
        <div id="universe-design"><DesignUniverse /></div>
        <div id="universe-iot"><IotUniverse /></div>
        <div id="universe-cyber"><CyberUniverse /></div>
      </div>

      {/* Footer strip */}
      <div className="px-8 md:px-16 py-10 border-t flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
        <Link href="/projects" className="font-inter text-sm transition-colors flex items-center gap-2" style={{ color: 'var(--oc-30)' }}>
          Voir les projets <Icon.ArrowRight size={14} />
        </Link>
        <span className="label-sm" style={{ color: 'var(--oc-15)' }}>prince.</span>
      </div>
    </main>
  );
}
