'use client';

import { useLanguage } from '@/hooks/use-language';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = ['about', 'services', 'skills', 'experience', 'projects', 'contact'];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-space text-2xl font-bold mb-3">
              <span className="text-foreground">prince</span>
              <span className="text-blue-500">.</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="font-space font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Navigation
            </p>
            <ul className="space-y-2">
              {links.map((key) => (
                <li key={key}>
                  <button
                    onClick={() => scrollTo(key)}
                    className="text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200 capitalize"
                  >
                    {t(`nav.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-space font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Contact
            </p>
            <a
              href="mailto:aprinceaineel@gmail.com"
              className="text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200 block mb-2"
            >
              aprinceaineel@gmail.com
            </a>
            <a
              href="tel:+22901991284"
              className="text-sm text-muted-foreground hover:text-blue-500 transition-colors duration-200 block mb-4"
            >
              +229 01 99 12 84 38
            </a>
            <div className="flex gap-3">
              {[
                { href: 'https://github.com/FritPrince', icon: Github, label: 'GitHub' },
                { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
                { href: 'mailto:aprinceaineel@gmail.com', icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Prince Aïneel ONILOU — {t('footer.rights')}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {t('footer.made')}
            <span className="text-sm">🇧🇯</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
