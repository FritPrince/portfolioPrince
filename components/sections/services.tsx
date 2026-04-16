'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { services } from '@/lib/data';

export function Services() {
  const { t, lang } = useLanguage();
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

  return (
    <section id="services" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30 dark:bg-secondary/10" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] orb-blue-dim opacity-15 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <p className="font-inter text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
            {t('services.label')}
          </p>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="font-inter text-muted-foreground max-w-xl">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`group p-6 rounded-2xl border border-border bg-card hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 section-hidden ${visible ? 'section-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 text-2xl group-hover:bg-blue-500/20 transition-colors duration-300">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="font-space font-semibold text-lg text-foreground mb-2 group-hover:text-blue-500 transition-colors duration-300">
                {lang === 'fr' ? service.title : service.titleEn}
              </h3>

              {/* Description */}
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-5">
                {lang === 'fr' ? service.description : service.descriptionEn}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Bottom accent line */}
              <div className="w-0 group-hover:w-full h-0.5 bg-blue-500 rounded-full mt-5 transition-all duration-400 ease-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
