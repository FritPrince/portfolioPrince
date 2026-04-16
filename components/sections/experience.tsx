'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { experiences } from '@/lib/data';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';

export function Experience() {
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

  const workExp = experiences.filter((e) => e.type === 'work');
  const eduExp = experiences.filter((e) => e.type === 'education');

  return (
    <section id="experience" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30 dark:bg-secondary/10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <p className="font-inter text-sm font-medium text-blue-500 uppercase tracking-widest mb-3">
            {t('experience.label')}
          </p>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('experience.title')}
          </h2>
          <p className="font-inter text-muted-foreground max-w-xl">
            {t('experience.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Work experience */}
          <div
            className={`section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.15s' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-space font-semibold text-foreground">
                {t('experience.work')}
              </h3>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/60 via-blue-500/30 to-transparent transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`} />

              <div className="space-y-8">
                {workExp.map((exp, i) => (
                  <div
                    key={exp.id}
                    className="relative pl-8"
                    style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
                  >
                    {/* Dot */}
                    <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      exp.current
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-border bg-background'
                    }`}>
                      {exp.current && (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>

                    {/* Card */}
                    <div className="group p-5 rounded-2xl border border-border bg-card hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="font-space font-semibold text-foreground group-hover:text-blue-500 transition-colors duration-200">
                            {lang === 'fr' ? exp.role : exp.roleEn}
                          </h4>
                          <p className="font-inter text-sm font-medium text-blue-500 dark:text-blue-400">
                            {exp.company}
                          </p>
                        </div>
                        {exp.current && (
                          <span className="shrink-0 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-semibold font-inter border border-blue-500/20">
                            {t('experience.present')}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground font-inter">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4">
                        {lang === 'fr' ? exp.description : (exp.descriptionEn ?? exp.description)}
                      </p>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div
            className={`section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-space font-semibold text-foreground">
                {t('experience.education')}
              </h3>
            </div>

            <div className="relative">
              <div className={`absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/60 via-blue-500/30 to-transparent transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`} />

              <div className="space-y-8">
                {eduExp.map((exp, i) => (
                  <div
                    key={exp.id}
                    className="relative pl-8"
                    style={{ transitionDelay: `${0.4 + i * 0.15}s` }}
                  >
                    <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 border-border bg-background flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                    </div>

                    <div className="group p-5 rounded-2xl border border-border bg-card hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
                      <h4 className="font-space font-semibold text-foreground group-hover:text-blue-500 transition-colors duration-200 mb-1">
                        {lang === 'fr' ? exp.role : exp.roleEn}
                      </h4>
                      <p className="font-inter text-sm font-medium text-blue-500 dark:text-blue-400 mb-3">
                        {exp.company}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-3 text-xs text-muted-foreground font-inter">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>

                      <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4">
                        {lang === 'fr' ? exp.description : (exp.descriptionEn ?? exp.description)}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote/bonus card */}
            <div className="mt-8 p-5 rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/5">
              <p className="font-inter text-sm text-muted-foreground mb-2">
                🎹 En dehors du code...
              </p>
              <p className="font-space text-sm font-semibold text-foreground">
                Musicien pianiste — la composition musicale et le développement logiciel partagent la même logique créatrice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
