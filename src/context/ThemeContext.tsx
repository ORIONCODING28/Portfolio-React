import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../types';
import { ThemeContext } from './theme-context';
import { readPreference, writePreference } from '../services/preferencesStorage';
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readPreference('portfolio_theme') === 'light' ? 'light' : 'dark');
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light-theme', theme === 'light');
    root.classList.toggle('light', theme === 'light');
    writePreference('portfolio_theme', theme);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#050505' : '#c6cbcb';
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', setTheme, toggleTheme: () => setTheme(value => value === 'dark' ? 'light' : 'dark') }}>{children}</ThemeContext.Provider>;
}
