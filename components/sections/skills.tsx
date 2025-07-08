'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { skills } from '@/lib/data';
import { Code, Server, Database, Settings, Sparkles, Zap } from 'lucide-react';

export function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimateProgress(true), 500);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categoryIcons = {
    frontend: Code,
    backend: Server,
    database: Database,
    tools: Settings,
  };

  const categoryLabels = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Base de données',
    tools: 'Outils',
  };

  const categoryGradients = {
    frontend: 'from-blue-500 via-purple-500 to-pink-500',
    backend: 'from-green-500 via-teal-500 to-cyan-500',
    database: 'from-purple-500 via-violet-500 to-indigo-500',
    tools: 'from-orange-500 via-red-500 to-pink-500',
  };

  const categoryBgGradients = {
    frontend: 'from-blue-50 via-purple-50 to-pink-50',
    backend: 'from-green-50 via-teal-50 to-cyan-50',
    database: 'from-purple-50 via-violet-50 to-indigo-50',
    tools: 'from-orange-50 via-red-50 to-pink-50',
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background avec dégradé animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 animate-gradient" />
      
      {/* Éléments décoratifs flottants */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full animate-float blur-xl" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full animate-float blur-xl" style={{ animationDelay: '3s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-pulse-glow">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gradient">Technologies Maîtrisées</span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-gradient animate-gradient">Mes Compétences</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Technologies et outils que je maîtrise pour créer des solutions exceptionnelles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <Card 
                  key={category} 
                  className={`hover-lift hover-glow transition-all duration-500 bg-gradient-to-br ${categoryBgGradients[category as keyof typeof categoryBgGradients]} border-0 animate-bounce-in relative overflow-hidden`}
                  style={{ animationDelay: `${categoryIndex * 0.2}s` }}
                >
                  {/* Effet de shimmer */}
                  <div className="absolute inset-0 animate-shimmer opacity-50"></div>
                  
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${categoryGradients[category as keyof typeof categoryGradients]} text-white animate-pulse-glow`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-gradient">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    {categorySkills.map((skill, skillIndex) => (
                      <div 
                        key={skill.name} 
                        className="space-y-3 animate-fade-in-scale"
                        style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                          <span className="text-sm font-bold text-gradient">{skill.level}%</span>
                        </div>
                        
                        {/* Barre de progression personnalisée */}
                        <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${categoryGradients[category as keyof typeof categoryGradients]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                            style={{ 
                              width: animateProgress ? `${skill.level}%` : '0%',
                              transitionDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s`
                            }}
                          >
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Section certifications/badges */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              <span className="text-gradient">Certifications & Reconnaissances</span>
            </h3>
            
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'React Expert', color: 'from-blue-500 to-cyan-500' },
                { name: 'Node.js Certified', color: 'from-green-500 to-teal-500' },
                { name: 'AWS Solutions', color: 'from-orange-500 to-yellow-500' },
                { name: 'MongoDB Pro', color: 'from-green-600 to-green-800' }
              ].map((cert, index) => (
                <div 
                  key={cert.name}
                  className={`px-6 py-3 bg-gradient-to-r ${cert.color} text-white rounded-full font-semibold hover-lift animate-bounce-in cursor-pointer`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {cert.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}