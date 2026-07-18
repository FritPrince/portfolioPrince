'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/hooks/use-language';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
