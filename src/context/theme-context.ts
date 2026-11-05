import { createContext } from 'react';
import type { Theme } from '../types';
export interface ThemeContextValue { theme: Theme; isDark: boolean; toggleTheme: () => void; setTheme: (theme: Theme) => void }
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
