'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/lib/data';
import { Github, ExternalLink, Star, Sparkles, Eye, Heart } from 'lucide-react';
import Image from 'next/image';

export function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
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

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const categories = [
    { value: 'all', label: 'Tous', gradient: 'from-gray-600 to-gray-800' },
    { value: 'fullstack', label: 'Fullstack', gradient: 'from-blue-500 to-purple-600' },
    { value: 'frontend', label: 'Frontend', gradient: 'from-green-500 to-teal-600' },
    { value: 'backend', label: 'Backend', gradient: 'from-orange-500 to-red-600' },
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background avec dégradé animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 animate-gradient" />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full animate-float blur-2xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full animate-float blur-2xl" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-pulse-glow">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gradient">Portfolio Créatif</span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-gradient animate-gradient">Mes Projets</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Découvrez quelques-uns de mes projets les plus récents et innovants
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category, index) => (
                <Button
                  key={category.value}
                  variant={filter === category.value ? "default" : "outline"}
                  onClick={() => setFilter(category.value)}
                  className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 hover-lift animate-bounce-in ${
                    filter === category.value 
                      ? `bg-gradient-to-r ${category.gradient} text-white border-0 animate-pulse-glow` 
                      : 'glass border-2 border-white/20 hover:border-purple-300'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card 
                key={project.id} 
                className={`group hover-lift hover-glow transition-all duration-500 transform bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-bounce-in relative overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Effet de shimmer */}
                <div className="absolute inset-0 animate-shimmer opacity-30"></div>
                
                <CardHeader className="p-0 relative">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay avec dégradé */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {project.featured && (
                      <div className="absolute top-4 right-4 animate-bounce-in">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 animate-pulse-glow">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    {/* Boutons d'action en overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300 ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Button 
                        size="sm" 
                        className="bg-white/90 text-gray-900 hover:bg-white rounded-full animate-bounce-in"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full animate-bounce-in"
                        style={{ animationDelay: '0.1s' }}
                        asChild
                      >
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 relative z-10">
                  <CardTitle className="text-xl mb-3 text-gray-900 group-hover:text-gradient transition-all duration-300">
                    {project.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={tech} 
                        variant="secondary" 
                        className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-100 hover:to-purple-100 hover:text-blue-700 transition-all duration-300 animate-fade-in-scale"
                        style={{ animationDelay: `${techIndex * 0.05}s` }}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 glass border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 animate-pulse-glow"
                      asChild
                    >
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>

                {/* Indicateur de like */}
                <div className="absolute bottom-4 right-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16 animate-fade-in-scale">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gradient">Vous avez un projet en tête ?</span>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover-lift animate-pulse-glow"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Discutons de votre projet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}