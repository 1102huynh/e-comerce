'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    // Initialize theme from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-storage');
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          setTheme(parsed.state?.theme || 'dark');
        } catch (e) {
          setTheme('dark');
        }
      } else {
        // Check system preference
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      }
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <>{children}</>;
}

