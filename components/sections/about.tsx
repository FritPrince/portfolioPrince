'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Code, Users, Award, Coffee, Sparkles, Zap, Heart, Star } from 'lucide-react';

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { 
      icon: Code, 
      label: 'Projets réalisés', 
      value: 50, 
      suffix: '+',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      icon: Users, 
      label: 'Clients satisfaits', 
      value: 25, 
      suffix: '+',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    { 
      icon: Award, 
      label: 'Années d\'expérience', 
      value: 5, 
      suffix: '+',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    },
    { 
      icon: Coffee, 
      label: 'Tasses de café', 
      value: 1000, 
      suffix: '+',
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50'
    },
  ];

  const technologies = [
    { name: 'React', color: 'from-blue-400 to-blue-600' },
    { name: 'Next.js', color: 'from-gray-700 to-gray-900' },
    { name: 'TypeScript', color: 'from-blue-600 to-blue-800' },
    { name: 'Node.js', color: 'from-green-500 to-green-700' },
    { name: 'MongoDB', color: 'from-green-600 to-green-800' },
    { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-600' }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background avec dégradé animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 animate-gradient" />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gradient">Passion & Expertise</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-gradient">À propos de moi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez mon parcours et ma passion pour le développement web
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <p className="text-lg text-gray-700 leading-relaxed pl-8">
                  Passionné par le développement web depuis plus de 5 ans, je me spécialise dans la création 
                  d'applications web modernes et performantes. Mon approche combine créativité technique et 
                  rigueur méthodologique pour livrer des solutions qui dépassent les attentes.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <p className="text-lg text-gray-700 leading-relaxed pl-8">
                  Expert en React, Next.js et Node.js, j'accompagne mes clients dans leur transformation 
                  digitale en créant des expériences utilisateur exceptionnelles. Chaque projet est une 
                  opportunité d'innover et de repousser les limites du possible.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-8 pl-8">
                {technologies.map((tech, index) => (
                  <span 
                    key={tech.name} 
                    className={`px-4 py-2 bg-gradient-to-r ${tech.color} text-white rounded-full text-sm font-medium hover-lift animate-shimmer cursor-pointer`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card 
                  key={index} 
                  className={`text-center p-6 hover-lift hover-glow transition-all duration-500 bg-gradient-to-br ${stat.bgGradient} border-0 animate-bounce-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-0">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl text-white mb-4 animate-pulse-glow`}>
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {isVisible && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section compétences avec barres animées */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gradient">Expertise Technique</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { skill: 'Frontend Development', level: 95, color: 'from-blue-500 to-cyan-500' },
                { skill: 'Backend Development', level: 88, color: 'from-green-500 to-teal-500' },
                { skill: 'UI/UX Design', level: 82, color: 'from-purple-500 to-pink-500' }
              ].map((item, index) => (
                <div key={index} className="text-center animate-fade-in-scale" style={{ animationDelay: `${index * 0.2}s` }}>
                  <h3 className="font-semibold text-gray-900 mb-4">{item.skill}</h3>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray={`${item.level}, 100`}
                        className="animate-pulse"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                          <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">{item.level}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}