'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/hooks/use-language';
import { Moon, Sun, Menu, X } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, setTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = ['about', 'services', 'skills', 'experience', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { key: 'about', label: t('nav.about') },
    { key: 'services', label: t('nav.services') },
    { key: 'skills', label: t('nav.skills') },
    { key: 'experience', label: t('nav.experience') },
    { key: 'projects', label: t('nav.projects') },
    { key: 'contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-border py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-space text-xl font-bold tracking-tight group"
          >
            <span className="text-foreground group-hover:text-blue-500 transition-colors duration-300">
              prince
            </span>
            <span className="text-blue-500">.</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.key)}
                className={`nav-link font-inter text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.key
                    ? 'text-blue-500'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center h-7 rounded-full bg-secondary border border-border overflow-hidden text-xs font-semibold font-inter"
            >
              <span
                className={`px-2.5 py-1 transition-all duration-200 ${
                  lang === 'fr'
                    ? 'bg-blue-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                FR
              </span>
              <span
                className={`px-2.5 py-1 transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-blue-500/40 transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* CTA */}
            <button
              onClick={() => scrollTo('contact')}
              className="btn-primary-glow px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold font-inter transition-colors duration-200"
            >
              {t('nav.hire')}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-secondary border border-border text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-background/95 backdrop-blur-xl"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`absolute inset-0 flex flex-col items-center justify-center gap-8 transition-all duration-400 ${
            mobileOpen ? 'animate-reveal-up' : ''
          }`}
        >
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.key)}
              className="font-space text-3xl font-bold text-foreground hover:text-blue-500 transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={toggleLang}
              className="flex items-center h-9 rounded-full bg-secondary border border-border overflow-hidden text-sm font-semibold"
            >
              <span className={`px-4 py-2 ${lang === 'fr' ? 'bg-blue-500 text-white' : 'text-muted-foreground'}`}>FR</span>
              <span className={`px-4 py-2 ${lang === 'en' ? 'bg-blue-500 text-white' : 'text-muted-foreground'}`}>EN</span>
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary border border-border text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
