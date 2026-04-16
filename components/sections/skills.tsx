'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { skills } from '@/lib/data';

type Category = 'frontend' | 'backend' | 'mobile' | 'design' | 'iot' | 'tools';

const categoryColors: Record<Category, { bg: string; text: string; border: string }> = {
  frontend: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  backend:  { bg: 'bg-green-500/10', text: 'text-green-500 dark:text-green-400', border: 'border-green-500/30' },
  mobile:   { bg: 'bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400', border: 'border-purple-500/30' },
  design:   { bg: 'bg-pink-500/10', text: 'text-pink-500 dark:text-pink-400', border: 'border-pink-500/30' },
  iot:      { bg: 'bg-orange-500/10', text: 'text-orange-500 dark:text-orange-400', border: 'border-orange-500/30' },
  tools:    { bg: 'bg-cyan-500/10', text: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-500/30' },
};

export function Skills() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<Category>('frontend');
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const categories: Category[] = ['frontend', 'backend', 'mobile', 'design', 'iot', 'tools'];

  const getCategoryLabel = (cat: Category) => {
    const map: Record<Category, string> = {
      frontend: t('skills.categories.frontend'),
      backend:  t('skills.categories.backend'),
      mobile:   t('skills.categories.mobile'),
      design:   t('skills.categories.design'),
      iot:      t('skills.categories.iot'),
      tools:    t('skills.categories.tools'),
    };
    return map[cat];
  };

  const filtered = skills.filter((s) => s.category === activeTab);
  const color = categoryColors[activeTab];

  return (
    <section id="skills" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <p className="font-inter text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
            {t('skills.label')}
          </p>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('skills.title')}
          </h2>
          <p className="font-inter text-muted-foreground max-w-xl">
            {t('skills.subtitle')}
          </p>
        </div>

        {/* Category tabs */}
        <div
          className={`flex flex-wrap gap-2 mb-10 section-hidden ${visible ? 'section-visible' : ''}`}
          style={{ transitionDelay: '0.15s' }}
        >
          {categories.map((cat) => {
            const c = categoryColors[cat];
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold font-inter transition-all duration-200 border ${
                  isActive
                    ? `${c.bg} ${c.text} ${c.border}`
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {/* Skills grid */}
        <div
          className={`section-hidden ${visible ? 'section-visible' : ''}`}
          style={{ transitionDelay: '0.25s' }}
        >
          <div className={`p-8 rounded-2xl border ${color.border} ${color.bg} bg-opacity-5`}>
            <div className="flex flex-wrap gap-3">
              {filtered.map((skill, i) => (
                <span
                  key={skill.name}
                  className={`skill-badge px-4 py-2.5 rounded-xl border ${color.border} ${color.bg} ${color.text} font-inter font-medium text-sm cursor-default`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {skill.name}
                </span>
              ))}
            </div>

            {/* Category description */}
            <div className={`mt-6 pt-6 border-t ${color.border} flex items-center gap-3`}>
              <div className={`w-2 h-2 rounded-full ${color.bg} border ${color.border} ${color.text}`} style={{ background: 'currentColor' }} />
              <p className="font-inter text-sm text-muted-foreground">
                {filtered.length} {filtered.length > 1 ? 'technologies' : 'technologie'} · {getCategoryLabel(activeTab)}
              </p>
            </div>
          </div>
        </div>

        {/* All-skills mini view */}
        <div
          className={`mt-10 section-hidden ${visible ? 'section-visible' : ''}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <p className="font-inter text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Vue d'ensemble
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const c = categoryColors[skill.category as Category];
              return (
                <span
                  key={skill.name}
                  onClick={() => setActiveTab(skill.category as Category)}
                  className={`skill-badge px-3 py-1 rounded-full text-xs font-medium font-inter border cursor-pointer transition-all duration-200 ${
                    activeTab === skill.category
                      ? `${c.bg} ${c.text} ${c.border}`
                      : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {skill.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
