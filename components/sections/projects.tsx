'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { projects } from '@/lib/data';
import { Github, ExternalLink, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';

type Filter = 'all' | 'fullstack' | 'frontend' | 'backend';

export function Projects() {
  const { t, lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('projects.all') },
    { key: 'fullstack', label: t('projects.fullstack') },
    { key: 'frontend', label: t('projects.frontend') },
    { key: 'backend', label: t('projects.backend') },
  ];

  return (
    <section id="projects" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] orb-blue-dim opacity-15 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-12 section-hidden ${visible ? 'section-visible' : ''}`}>
          <p className="font-inter text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
            {t('projects.label')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-space text-4xl md:text-5xl font-bold text-foreground mb-2">
                {t('projects.title')}
              </h2>
              <p className="font-inter text-muted-foreground max-w-xl">
                {t('projects.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div
          className={`flex flex-wrap gap-2 mb-10 section-hidden ${visible ? 'section-visible' : ''}`}
          style={{ transitionDelay: '0.15s' }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-inter transition-all duration-200 border ${
                filter === f.key
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 section-hidden ${visible ? 'section-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.07}s` }}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-44">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4 transition-all duration-300 ${hovered === project.id ? 'opacity-100' : 'opacity-0'}`}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:text-blue-500 hover:border-blue-500/50 transition-all duration-200"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border text-xs font-semibold font-inter text-foreground">
                    <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
                    {t('projects.featured')}
                  </div>
                )}

                {/* Category */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border text-xs font-medium font-inter text-muted-foreground capitalize">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-space font-semibold text-base text-foreground mb-2 group-hover:text-blue-500 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {lang === 'fr' ? project.description : (project.descriptionEn ?? project.description)}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-3 border-t border-border">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium font-inter text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <Github className="w-3.5 h-3.5" />
                      {t('projects.code')}
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium font-inter text-blue-500 hover:text-blue-400 transition-colors duration-200 ml-auto"
                    >
                      {t('projects.demo')}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center section-hidden ${visible ? 'section-visible' : ''}`}
          style={{ transitionDelay: '0.5s' }}
        >
          <p className="font-space text-xl font-semibold text-foreground mb-4">
            {t('projects.cta')}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold font-inter text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
          >
            {t('projects.cta_btn')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
