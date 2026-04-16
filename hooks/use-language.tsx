'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Lang } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  toggle: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'fr' || stored === 'en') {
      setLang(stored);
    }
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next: Lang = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: unknown = translations[lang];
    for (const key of keys) {
      if (result && typeof result === 'object') {
        result = (result as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }
    return typeof result === 'string' ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
