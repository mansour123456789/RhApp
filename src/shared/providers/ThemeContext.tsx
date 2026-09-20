import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Aligné sur --background dans index.css (évite une frame « claire » avant les variables CSS). */
const DOCUMENT_BG: Record<Theme, string> = {
  light: 'hsl(228 33% 95%)', /* #EFF1F8 */
  dark: 'hsl(240 10% 8%)',
};

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
  root.style.backgroundColor = DOCUMENT_BG[theme];
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  localStorage.setItem('ecopilot-theme', theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('ecopilot-theme');
    return (stored as Theme) || 'light';
  });

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
