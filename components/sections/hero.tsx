'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Sparkles, Zap } from 'lucide-react';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background animé avec dégradés */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 animate-gradient" />
      
      {/* Particules flottantes */}
      <div className="floating-particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      {/* Éléments de fond animés avec dégradés */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-30 animate-float"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            top: '10%',
            right: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-25 animate-float"
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            bottom: '15%',
            left: '15%',
            animationDelay: '2s',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            filter: 'blur(35px)',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-20 animate-float"
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            top: '50%',
            left: '50%',
            animationDelay: '4s',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            filter: 'blur(30px)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 animate-bounce-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Développeur Passionné
              </span>
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-6">
              <span className="text-gradient animate-gradient">
                Prince ONILOU
              </span>
            </h1>
            
            <div className="text-xl md:text-2xl lg:text-4xl text-gray-600 mb-8">
              <span className="typing-animation">Développeur Web Fullstack</span>
            </div>
          </div>

          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-scale">
            Je transforme vos idées en expériences web exceptionnelles avec une passion pour 
            l innovation et les technologies de pointe. Chaque ligne de code raconte une histoire.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up">
            <Button 
              onClick={scrollToContact}
              size="lg"
              className="btn-gradient text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl group"
            >
              <span className="flex items-center gap-2">
                Démarrer un Projet
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Button>
            
            <div className="flex gap-4">
              {[
                { icon: Github, color: 'from-gray-600 to-gray-800', delay: '0s' },
                { icon: Linkedin, color: 'from-blue-600 to-blue-800', delay: '0.1s' },
                { icon: Mail, color: 'from-red-500 to-pink-600', delay: '0.2s' }
              ].map(({ icon: Icon, color, delay }, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full hover-lift hover-glow glass border-2 border-white/20 group animate-bounce-in`}
                  style={{ animationDelay: delay }}
                >
                  <Icon className={`h-5 w-5 bg-gradient-to-r ${color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                </Button>
              ))}
            </div>
          </div>

          {/* Indicateur de scroll animé */}
          <div className="animate-bounce">
            <div className="inline-flex flex-col items-center gap-2 text-gray-400">
              <span className="text-sm font-medium">Découvrir</span>
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-bounce"></div>
              </div>
              <ArrowDown className="h-4 w-4 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Effet de lumière suivant la souris */}
      <div 
        className="absolute pointer-events-none opacity-30"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'all 0.1s ease-out',
        }}
      />
    </section>
  );
}