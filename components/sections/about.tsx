'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Code2, Briefcase, Layers, Music } from 'lucide-react';

export function About() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Code2, value: 9, suffix: '+', label: t('about.stats.projects'), color: 'text-blue-500' },
    { icon: Briefcase, value: 2, suffix: '+', label: t('about.stats.experience'), color: 'text-blue-400' },
    { icon: Layers, value: 5, suffix: '', label: t('about.stats.domains'), color: 'text-blue-300' },
    { icon: Music, value: 1, suffix: '', label: t('about.stats.musician'), color: 'text-blue-500' },
  ];

  const passions = [
    'Web & Mobile', 'UX/UI Design', 'IoT', 'Cybersécurité',
    'React Native', 'Next.js', 'Arduino', 'Piano 🎹',
  ];

  return (
    <section id="about" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-blue-dim opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <p className="font-inter text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
            {t('about.label')}
          </p>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-foreground">
            {t('about.title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — text */}
          <div
            className={`space-y-6 section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.15s' }}
          >
            <div className="space-y-5">
              <p className="font-inter text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('about.p1')}
              </p>
              <p className="font-inter text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('about.p2')}
              </p>
            </div>

            {/* Passion tags */}
            <div className="pt-4">
              <p className="font-inter text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Domaines
              </p>
              <div className="flex flex-wrap gap-2">
                {passions.map((p) => (
                  <span
                    key={p}
                    className="skill-badge px-3 py-1.5 rounded-full border border-border bg-secondary text-sm font-inter font-medium text-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Accent line */}
            <div className="w-16 h-0.5 bg-blue-500 rounded-full mt-2" />
          </div>

          {/* Right — stats */}
          <div
            className={`section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-border bg-card hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="font-space text-4xl font-bold text-foreground mb-1">
                    {visible ? (
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    ) : (
                      <span>0</span>
                    )}
                  </div>
                  <p className="font-inter text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quote card */}
            <div className="mt-4 p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <p className="font-space text-sm font-medium text-blue-500 dark:text-blue-400 leading-relaxed italic">
                "Tant que l'informatique peut apporter une solution, je suis là."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
