'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Accueil', href: '#' },
    { label: 'À propos', href: '#about' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Projets', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass backdrop-blur-xl shadow-2xl border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo avec animation */}
          <div className="font-bold text-2xl hover-lift cursor-pointer">
            <span className="text-gradient animate-gradient flex items-center gap-2">
              <Sparkles className="h-6 w-6 animate-pulse" />
              PO
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href.replace('#', ''))}
                className={`relative text-gray-700 hover:text-gradient transition-all duration-300 font-medium group animate-fade-in-scale`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden glass rounded-full hover-lift"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? 
              <X className="h-5 w-5 text-gradient" /> : 
              <Menu className="h-5 w-5 text-gradient" />
            }
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 glass backdrop-blur-xl border-t border-white/20 shadow-2xl animate-slide-up">
            <nav className="flex flex-col py-4">
              {navItems.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href.replace('#', ''))}
                  className={`text-left px-6 py-4 text-gray-700 hover:text-gradient hover:bg-white/10 transition-all duration-300 font-medium animate-fade-in-scale`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}