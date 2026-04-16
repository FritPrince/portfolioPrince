'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Github, Linkedin, Mail, ArrowDown, Download } from 'lucide-react';

export function Hero() {
  const { t, lang } = useLanguage();
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const rolesFr = [
    'Développeur Fullstack',
    'Creative Developer',
    'Designer UX/UI',
    'Ingénieur IoT',
    'Expert Cybersécurité',
  ];
  const rolesEn = [
    'Fullstack Developer',
    'Creative Developer',
    'UX/UI Designer',
    'IoT Engineer',
    'Cybersecurity Expert',
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % 5);
        setRoleVisible(true);
      }, 380);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${-x * 0.7}px, ${-y * 0.7}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background dot-grid" />

      {/* Orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-[10%] right-[8%] w-[480px] h-[480px] orb-blue opacity-40 dark:opacity-30 transition-transform duration-700 ease-out pointer-events-none"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-[8%] left-[5%] w-[380px] h-[380px] orb-blue-dim opacity-30 dark:opacity-20 transition-transform duration-700 ease-out pointer-events-none"
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
        <div className={`max-w-4xl mx-auto text-center ${mounted ? 'animate-reveal-up' : 'opacity-0'}`}>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-500 dark:text-blue-400 text-sm font-inter font-medium mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t('hero.badge')}
          </div>

          {/* Name */}
          <h1
            className="font-space font-bold leading-[0.95] mb-6 animate-reveal-up"
            style={{ animationDelay: '0.15s' }}
          >
            <span className="block text-[clamp(3.5rem,10vw,7.5rem)] text-foreground">
              PRINCE AÏNEEL
            </span>
            <span className="block text-[clamp(3.5rem,10vw,7.5rem)] text-gradient-blue">
              ONILOU.
            </span>
          </h1>

          {/* Rotating role */}
          <div
            className="h-10 flex items-center justify-center mb-8 overflow-hidden animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <span
              className={`font-inter text-lg md:text-xl text-blue-500 dark:text-blue-400 font-medium transition-all duration-380 ${
                roleVisible ? 'animate-role-in' : 'animate-role-out opacity-0'
              }`}
            >
              — {(lang === 'fr' ? rolesFr : rolesEn)[roleIndex]}
            </span>
          </div>

          {/* Tagline */}
          <p
            className="font-inter text-base md:text-lg text-muted-foreground italic mb-12 max-w-xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            "{t('hero.tagline')}"
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-reveal-up"
            style={{ animationDelay: '0.5s' }}
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary-glow w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold font-inter text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              {t('hero.cta_projects')}
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-border hover:border-blue-500/50 text-foreground hover:text-blue-500 font-semibold font-inter text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              {t('hero.cta_contact')}
            </button>
            <a
              href="/cv-prince-aineel-onilou.pdf"
              download
              className="flex items-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full border border-dashed border-border hover:border-blue-500/50 text-muted-foreground hover:text-blue-500 font-semibold font-inter text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              {t('hero.download_cv')}
            </a>
          </div>

          {/* Social links */}
          <div
            className="flex items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            {[
              { href: 'https://github.com/FritPrince', icon: Github, label: 'GitHub' },
              { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
              { href: 'mailto:aprinceaineel@gmail.com', icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-float">
        <span className="font-inter text-xs tracking-widest uppercase">{t('hero.scroll')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-blue-500/60 to-transparent" />
        <ArrowDown className="w-3 h-3" />
      </div>
    </section>
  );
}
