'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import * as Icon from '@/components/ui/icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Experience, Skill } from '@/types';

gsap.registerPlugin(ScrollTrigger);

/* ─── Chapter definitions ───────────────────────────────────── */
const CHAPTERS = [
  {
    id: 'dev',
    num: '01',
    title: 'Le Développeur',
    subtitle: 'Code as architecture',
    accent: '#3B82F6',
    tagline: 'Je ne fais pas que du code — je construis des systèmes qui durent.',
    body: "Depuis 2021, j'écris du code qui résout de vrais problèmes. Full-stack par nature, j'aime autant concevoir une API robuste que polir chaque micro-interaction d'une interface. React, Next.js, Laravel, Node.js — des outils, pas des étiquettes.",
    keywords: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Laravel', 'PostgreSQL'],
    visual: 'code',
  },
  {
    id: 'designer',
    num: '02',
    title: 'Le Designer',
    subtitle: 'Design as language',
    accent: '#F59E0B',
    tagline: "Un bon design, c'est invisible. Le mauvais design, lui, se remarque.",
    body: "Chez WAOUH MONDE, je traduis les idées en interfaces. Je crois que le design et le code ne sont pas deux disciplines séparées — ce sont deux façons de parler à l'utilisateur. Figma est mon carnet de pensées.",
    keywords: ['Figma', 'UX Research', 'Prototypage', 'Motion Design', 'Design System'],
    visual: 'design',
  },
  {
    id: 'iot',
    num: '03',
    title: "L'Ingénieur IoT",
    subtitle: 'Bits meet atoms',
    accent: '#10B981',
    tagline: 'Là où le logiciel touche le monde physique, quelque chose de magique se produit.',
    body: "Arduino, ESP32, capteurs, MQTT — je construis des ponts entre le digital et le réel. Systèmes embarqués, maisons intelligentes, automatisation. L'IoT, c'est du développement logiciel qui prend corps dans la matière.",
    keywords: ['Arduino', 'ESP32', 'C/C++', 'MQTT', 'Capteurs', 'Automatisation'],
    visual: 'iot',
  },
  {
    id: 'music',
    num: '04',
    title: 'Le Pianiste',
    subtitle: 'Music as thinking',
    accent: '#8B5CF6',
    tagline: "Le piano m'a appris ce que le code ne peut pas enseigner : la patience et l'oreille.",
    body: "La musique n'est pas un hobby — c'est une autre façon de penser. Jouer du piano, c'est composer en temps réel, écouter les silences, sentir le flux. Cette sensibilité, je l'emmène dans chaque projet que je crée.",
    keywords: ['Piano', 'Composition', 'Improvisation', 'Théorie musicale', 'Rythme'],
    visual: 'music',
  },
];

/* ─── Visual for each chapter ───────────────────────────────── */
function ChapterVisual({ type, accent }: { type: string; accent: string }) {
  if (type === 'code') return <CodeVisual accent={accent} />;
  if (type === 'design') return <DesignVisual accent={accent} />;
  if (type === 'iot') return <IotVisual accent={accent} />;
  if (type === 'music') return <MusicVisual accent={accent} />;
  return null;
}

function CodeVisual({ accent }: { accent: string }) {
  const lines = [
    { indent: 0, text: 'const prince = {', color: 'text-white/60' },
    { indent: 1, text: "role: 'Fullstack Dev',", color: 'text-white/40' },
    { indent: 1, text: 'stacks: [', color: 'text-white/40' },
    { indent: 2, text: "'React', 'Next.js',", color: '', accent: true },
    { indent: 2, text: "'Node.js', 'Laravel',", color: '', accent: true },
    { indent: 1, text: '],', color: 'text-white/40' },
    { indent: 1, text: 'available: true,', color: 'text-green-400/70' },
    { indent: 0, text: '};', color: 'text-white/60' },
    { indent: 0, text: '', color: '' },
    { indent: 0, text: 'prince.build(yourIdea);', color: 'text-white/30' },
  ];

  return (
    <div
      className="rounded-2xl p-6 font-mono text-sm leading-7 overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      {/* Dots */}
      <div className="flex gap-2 mb-5">
        {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
        ))}
      </div>
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="flex"
          style={{ paddingLeft: `${l.indent * 20}px` }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
        >
          <span
            className={l.accent ? 'font-medium' : l.color}
            style={l.accent ? { color: accent } : undefined}
          >
            {l.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function DesignVisual({ accent }: { accent: string }) {
  const cards = [
    { label: 'Wireframe', w: 80, h: 50 },
    { label: 'Prototype', w: 60, h: 40 },
    { label: 'Design final', w: 90, h: 60 },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Figma-style frame */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--line)', minHeight: 200 }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        {/* Floating shape cards */}
        {cards.map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-lg"
            style={{
              width: `${c.w}px`,
              height: `${c.h}px`,
              background: `${accent}10`,
              border: `1px solid ${accent}25`,
              top: `${20 + i * 35}px`,
              left: `${20 + i * 60}px`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="absolute bottom-1.5 left-2 text-[9px] text-white/20">{c.label}</span>
          </motion.div>
        ))}
        {/* Cursor */}
        <motion.div
          className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
          animate={{ x: [20, 120, 80, 160, 20], y: [20, 50, 120, 80, 20] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Tool pills */}
      <div className="flex gap-2 flex-wrap">
        {['Components', 'Auto Layout', 'Variables', 'Prototype'].map((t) => (
          <span
            key={t}
            className="text-[10px] px-2.5 py-1 rounded-full"
            style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}25` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function IotVisual({ accent }: { accent: string }) {
  const nodes = [
    { x: 50, y: 20, label: 'ESP32', main: true },
    { x: 15, y: 55, label: 'Temp.' },
    { x: 50, y: 75, label: 'Relay' },
    { x: 85, y: 55, label: 'Light' },
    { x: 30, y: 35, label: 'MQTT' },
    { x: 70, y: 35, label: 'WiFi' },
  ];

  return (
    <div
      className="rounded-2xl relative overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', height: 220 }}
    >
      <svg className="absolute inset-0 w-full h-full">
        {nodes.slice(1).map((n, i) => (
          <motion.line
            key={i}
            x1={`${nodes[0].x}%`} y1={`${nodes[0].y + 8}%`}
            x2={`${n.x}%`} y2={`${n.y}%`}
            stroke={accent} strokeWidth="1" strokeOpacity="0.25"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
            style={{
              width: n.main ? 56 : 40,
              height: n.main ? 32 : 24,
              background: n.main ? accent : `${accent}15`,
              border: `1px solid ${accent}${n.main ? '' : '40'}`,
              color: n.main ? '#000' : accent,
              fontSize: n.main ? 11 : 9,
            }}
          >
            {n.label}
          </div>
          {n.main && (
            <motion.div
              className="absolute -inset-2 rounded-xl pointer-events-none"
              style={{ border: `1px solid ${accent}30` }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      ))}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between">
        <span className="text-[9px] text-white/20 font-mono">MQTT broker: active</span>
        <span className="text-[9px] font-mono" style={{ color: accent }}>● connected</span>
      </div>
    </div>
  );
}

function MusicVisual({ accent }: { accent: string }) {
  const keys = Array.from({ length: 14 }, (_, i) => {
    const blackPattern = [1, 3, 6, 8, 10];
    const isBlack = blackPattern.includes(i % 12);
    return { isBlack, i };
  });

  const whiteKeys = keys.filter((k) => !k.isBlack);

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      {/* Sound wave */}
      <div className="mb-5 flex items-center gap-1 h-10">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{ background: `${accent}60` }}
            animate={{
              height: [`${Math.random() * 60 + 10}%`, `${Math.random() * 80 + 10}%`, `${Math.random() * 50 + 10}%`],
            }}
            transition={{
              duration: 0.4 + Math.random() * 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: i * 0.03,
            }}
          />
        ))}
      </div>

      {/* Piano keys */}
      <div className="relative flex h-20">
        {whiteKeys.map((k, wi) => (
          <motion.div
            key={k.i}
            className="flex-1 rounded-b-md mx-0.5"
            style={{
              background: '#e5e5e5',
              border: '1px solid #ccc',
            }}
            initial={{ scaleY: 0, originY: 1 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: wi * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ background: accent, transition: { duration: 0.1 } }}
          />
        ))}
        {/* Black keys overlay */}
        <div className="absolute inset-0 flex pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => {
            const skip = i % 7;
            if (skip === 2 || skip === 6) return null;
            return (
              <motion.div
                key={i}
                className="absolute rounded-b-sm"
                style={{
                  width: '6%',
                  height: '55%',
                  background: 'var(--surface)',
                  left: `${(i + 0.65) * (100 / 9)}%`,
                  top: 0,
                  zIndex: 1,
                }}
                initial={{ scaleY: 0, originY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] text-white/20 font-mono flex items-center gap-1"><Icon.MusicNote size={10} />Improvisation en do mineur</span>
        <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: accent }}><Icon.MusicNote size={10} />72 bpm</span>
      </div>
    </div>
  );
}

/* ─── Experience Timeline ───────────────────────────────────── */
function Timeline({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        className="absolute left-6 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, var(--line) 10%, var(--line) 90%, transparent)' }}
        initial={{ scaleY: 0, originY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="space-y-10">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            className="flex gap-8 relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Node */}
            <div className="flex-shrink-0 w-12 flex justify-center">
              <div
                className="w-3 h-3 rounded-full mt-1.5 relative z-10"
                style={{
                  background: exp.current ? '#10B981' : 'var(--line)',
                  border: `2px solid ${exp.current ? '#10B981' : 'var(--txt-muted)'}`,
                  boxShadow: exp.current ? '0 0 12px rgba(16,185,129,0.5)' : 'none',
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-3">
                  {exp.logoUrl && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0 border" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
                      <Image src={exp.logoUrl} alt={exp.company} fill className="object-contain p-1" sizes="32px" />
                    </div>
                  )}
                  <div>
                    <p className="font-space text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--oc-30)' }}>
                      {exp.company}
                    </p>
                    <h4 className="font-inter font-medium text-sm md:text-base" style={{ color: 'var(--oc-80)' }}>
                      {exp.role}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="label-sm" style={{ color: 'var(--oc-25)' }}>{exp.period}</p>
                  <p className="label-sm mt-0.5" style={{ color: 'var(--oc-15)' }}>{exp.location}</p>
                </div>
              </div>
              <p className="font-inter text-sm leading-relaxed mb-3" style={{ color: 'var(--oc-35)' }}>
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Skills Grid ───────────────────────────────────────────── */
const SKILL_CATEGORIES = [
  { key: 'frontend', label: 'Frontend', accent: '#3B82F6' },
  { key: 'backend',  label: 'Backend',  accent: '#10B981' },
  { key: 'mobile',   label: 'Mobile',   accent: '#F59E0B' },
  { key: 'design',   label: 'Design',   accent: '#EC4899' },
  { key: 'iot',      label: 'IoT',      accent: '#8B5CF6' },
  { key: 'tools',    label: 'Outils',   accent: '#6366F1' },
];

function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const current = SKILL_CATEGORIES.find((c) => c.key === activeCategory)!;
  const filtered = skills.filter((s) => s.category === activeCategory);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              color: activeCategory === cat.key ? cat.accent : 'var(--oc-25)',
              background: activeCategory === cat.key ? `${cat.accent}12` : 'transparent',
              border: `1px solid ${activeCategory === cat.key ? cat.accent + '40' : 'var(--line)'}`,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {filtered.map((skill, i) => (
          <motion.span
            key={skill.name}
            className="px-4 py-2 rounded-full text-sm"
            style={{
              color: current.accent,
              background: `${current.accent}10`,
              border: `1px solid ${current.accent}25`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─── Chapter section ───────────────────────────────────────── */
/* ─── Animated mesh background ──────────────────────────────── */
function MeshBackground({ colors }: { colors: string[] }) {
  const blobs = [
    { x: '10%',  y: '20%', w: 500, h: 400, delay: 0,   dur: 12 },
    { x: '60%',  y: '50%', w: 420, h: 500, delay: 3,   dur: 15 },
    { x: '30%',  y: '70%', w: 380, h: 350, delay: 6,   dur: 10 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x, top: b.y,
            width: b.w, height: b.h,
            background: colors[i % colors.length],
            filter: 'blur(90px)',
            opacity: 0.55,
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 20, -15, 0],
            scale: [1, 1.08, 0.95, 1.04, 1],
          }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function ChapterSection({ chapter, index }: { chapter: typeof CHAPTERS[0]; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id={`chapter-${chapter.id}`}
      className="min-h-screen flex items-center px-8 md:px-16 py-24 relative overflow-hidden"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      {/* Animated mesh blobs */}
      <MeshBackground colors={[
        `${chapter.accent}14`,
        `${chapter.accent}0a`,
        `${chapter.accent}0d`,
      ]} />

      {/* Chapter number — large background */}
      <div
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-space font-bold leading-none pointer-events-none select-none"
        style={{
          fontSize: 'clamp(6rem, 20vw, 16rem)',
          color: `${chapter.accent}07`,
          fontVariantNumeric: 'tabular-nums',
          zIndex: 1,
        }}
      >
        {chapter.num}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full max-w-6xl mx-auto relative z-10">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Chapter label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="label-sm" style={{ color: 'var(--oc-20)' }}>{chapter.num}</span>
            <div className="w-8 h-px" style={{ background: chapter.accent }} />
            <span className="label-sm" style={{ color: chapter.accent }}>
              {chapter.subtitle}
            </span>
          </div>

          <h2
            className="display-lg mb-6 leading-[1.05]"
            style={{ letterSpacing: '-0.02em', color: 'var(--txt)' }}
          >
            {chapter.title}
          </h2>

          <p
            className="font-inter text-base md:text-lg mb-6 leading-relaxed"
            style={{ color: `${chapter.accent}cc` }}
          >
            "{chapter.tagline}"
          </p>

          <p className="font-inter text-sm md:text-base leading-relaxed mb-8" style={{ color: 'var(--oc-45)' }}>
            {chapter.body}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {chapter.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-3 py-1.5 rounded-full font-mono"
                style={{
                  color: chapter.accent,
                  background: `${chapter.accent}10`,
                  border: `1px solid ${chapter.accent}20`,
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right — visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChapterVisual type={chapter.visual} accent={chapter.accent} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    fetch('/api/experiences').then(r => r.json()).then(d => setExperiences(Array.isArray(d) ? d : []));
    fetch('/api/skills').then(r => r.json()).then(d => setSkills(Array.isArray(d) ? d : []));
    fetch('/api/settings').then(r => r.json()).then(s => {
      if (s.profile_photo) setProfilePhoto(s.profile_photo);
      if (s.cv_url) setCvUrl(s.cv_url);
    });
  }, []);

  /* Cycle through the 4 chapter titles */
  useEffect(() => {
    const t = setInterval(() => {
      setCycleIndex(i => (i + 1) % CHAPTERS.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  /* Animate chapter number in hero */
  const [currentNum, setCurrentNum] = useState('01');

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(`chapter-${c.id}`));

    const observers = sections.map((section, i) => {
      if (!section) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrentNum(CHAPTERS[i].num);
        },
        { threshold: 0.3 }
      );
      observer.observe(section);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--txt)' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="on-media relative min-h-screen flex flex-col justify-between px-8 md:px-16 pt-28 pb-16 overflow-hidden"
      >
        {/* Background — developers at work */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/group-four-software-engineers-standing-by-desk-with-computer-monitor.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Heavy left-to-right gradient — text zone is fully dark, image bleeds right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(110deg, rgba(4,4,8,0.97) 0%, rgba(4,4,8,0.88) 40%, rgba(4,4,8,0.60) 70%, rgba(4,4,8,0.25) 100%)',
            }}
          />
        </div>
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 flex-1 flex flex-col justify-center">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-6 h-px bg-white/20" />
            <span className="label-sm text-white/30">À propos</span>
            <span className="label-sm text-white/15">·</span>
            <span className="label-sm" style={{ color: '#3B82F6' }}>01 — 04</span>
          </motion.div>

          {/* Headline */}
          <div className="mb-8">
            {/* Line 1 — cycling chapter titles */}
            <motion.div
              className="overflow-hidden mb-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={cycleIndex}
                  className="display-xl leading-none"
                  style={{
                    letterSpacing: '-0.03em',
                    color: CHAPTERS[cycleIndex].accent,
                  }}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {CHAPTERS[cycleIndex].title}.
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            {/* Line 2 — static */}
            <motion.h1
              className="display-xl leading-none"
              style={{ color: 'var(--oc-12)', letterSpacing: '-0.03em' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Une identité.
            </motion.h1>
          </div>

          {/* Profile photo + bio */}
          <motion.div
            className="flex items-start gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {profilePhoto && (
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden relative border border-white/10">
                <Image src={profilePhoto} alt="Prince Aïneel ONILOU" fill className="object-cover" sizes="80px" />
              </div>
            )}
            <p className="font-inter text-base md:text-lg text-white/40 max-w-xl leading-relaxed">
              Je m'appelle Prince Aïneel ONILOU. Développeur fullstack, designer UX, ingénieur IoT et pianiste — basé à Cotonou, Bénin. Ce n'est pas une liste de compétences, c'est qui je suis.
            </p>
          </motion.div>

          {/* Chapter navigation dots */}
          <motion.div
            className="relative z-10 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => document.getElementById(`chapter-${c.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 group"
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    width:   cycleIndex === i ? 20 : 6,
                    height:  6,
                    background: c.accent,
                    opacity: cycleIndex === i ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                <span
                  className="label-sm transition-all duration-300 overflow-hidden hidden md:block"
                  style={{
                    color: cycleIndex === i ? c.accent : 'var(--oc-20)',
                    maxWidth: cycleIndex === i ? 120 : 0,
                  }}
                >
                  {c.title}
                </span>
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating chapter counter */}
        <motion.div
          className="absolute z-10 right-8 md:right-16 bottom-16 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p className="label-sm text-white/15">Chapitre</p>
          <p
            className="font-space text-4xl font-bold text-white/05"
            style={{ lineHeight: 1 }}
          >
            {currentNum}
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span className="label-sm text-white/20">Scroll pour découvrir</span>
          <motion.div
            className="w-px h-10"
            style={{ background: 'linear-gradient(180deg, var(--oc-30), transparent)' }}
            animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </motion.div>

        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 50% at 10% 50%, rgba(59,130,246,0.04) 0%, transparent 60%)',
          }}
        />
      </section>

      {/* ── Chapters ────────────────────────────────────────────── */}
      {CHAPTERS.map((chapter, i) => (
        <ChapterSection key={chapter.id} chapter={chapter} index={i} />
      ))}

      {/* ── Experience ──────────────────────────────────────────── */}
      <section
        className="px-8 md:px-16 py-24 relative overflow-hidden"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <MeshBackground colors={['rgba(59,130,246,0.12)', 'rgba(99,102,241,0.09)', 'rgba(59,130,246,0.07)']} />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: 'var(--oc-20)' }} />
              <span className="label-sm" style={{ color: 'var(--oc-30)' }}>Parcours</span>
            </div>
            <h2 className="display-md" style={{ color: 'var(--txt)' }}>Expériences & Formation</h2>
          </motion.div>

          <Timeline experiences={experiences} />
        </div>
      </section>

      {/* ── Skills ──────────────────────────────────────────────── */}
      <section
        className="px-8 md:px-16 py-24 relative overflow-hidden"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <MeshBackground colors={['rgba(236,72,153,0.11)', 'rgba(139,92,246,0.09)', 'rgba(236,72,153,0.07)']} />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: 'var(--oc-20)' }} />
              <span className="label-sm" style={{ color: 'var(--oc-30)' }}>Compétences</span>
            </div>
            <h2 className="display-md" style={{ color: 'var(--txt)' }}>Stack technique</h2>
          </motion.div>

          <SkillsGrid skills={skills} />
        </div>
      </section>

      {/* ── CTA strip ───────────────────────────────────────────── */}
      <section
        className="px-8 md:px-16 py-20"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="display-md mb-2" style={{ color: 'var(--txt)' }}>Travaillons ensemble.</p>
            <p className="font-inter text-sm" style={{ color: 'var(--oc-35)' }}>
              Disponible pour projets freelance et collaborations.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
              style={{ background: '#3B82F6', color: '#fff' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              Me contacter
              <Icon.ArrowRight size={14} />
            </motion.a>
            {cvUrl && (
              <motion.a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
                style={{ background: 'transparent', color: 'var(--oc-50)', border: '1px solid var(--line)' }}
                whileHover={{ borderColor: '#3B82F6', color: '#3B82F6' }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Télécharger mon CV
              </motion.a>
            )}
            <motion.a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
              style={{ background: 'transparent', color: 'var(--oc-40)', border: '1px solid var(--line)' }}
              whileHover={{ borderColor: 'var(--txt-muted)', color: 'var(--oc-70)' }}
            >
              Voir mes projets
            </motion.a>
          </div>
        </div>
      </section>

    </main>
  );
}
