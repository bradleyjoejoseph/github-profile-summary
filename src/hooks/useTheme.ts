import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'midnight' | 'dimmed' | 'light';

const THEME_KEY = 'gitpulse_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme;
    if (saved && ['dark', 'midnight', 'dimmed', 'light'].includes(saved)) {
      return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-midnight', 'theme-dimmed', 'theme-light');
    root.classList.add(`theme-${theme}`);

    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f6f8fa');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--border-color', '#d0d7de');
      root.style.setProperty('--text-primary', '#1f2328');
      root.style.setProperty('--text-secondary', '#656d76');
      root.style.setProperty('--accent', '#0969da');
      root.style.setProperty('--accent-hover', '#0550ae');
      root.style.setProperty('--chart-tooltip-bg', '#ffffff');
      root.style.setProperty('--chart-tooltip-text', '#1f2328');
    } else if (theme === 'midnight') {
      root.style.setProperty('--bg-primary', '#020408');
      root.style.setProperty('--bg-secondary', '#090d16');
      root.style.setProperty('--bg-card', '#0e1420');
      root.style.setProperty('--border-color', '#1e293b');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--accent', '#38bdf8');
      root.style.setProperty('--accent-hover', '#0284c7');
      root.style.setProperty('--chart-tooltip-bg', '#090d16');
      root.style.setProperty('--chart-tooltip-text', '#f8fafc');
    } else if (theme === 'dimmed') {
      root.style.setProperty('--bg-primary', '#1c2128');
      root.style.setProperty('--bg-secondary', '#22272e');
      root.style.setProperty('--bg-card', '#2d333b');
      root.style.setProperty('--border-color', '#444c56');
      root.style.setProperty('--text-primary', '#adbac7');
      root.style.setProperty('--text-secondary', '#768390');
      root.style.setProperty('--accent', '#539bf5');
      root.style.setProperty('--accent-hover', '#316dca');
      root.style.setProperty('--chart-tooltip-bg', '#22272e');
      root.style.setProperty('--chart-tooltip-text', '#adbac7');
    } else {
      // Default dark
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#161b22');
      root.style.setProperty('--bg-card', '#21262d');
      root.style.setProperty('--border-color', '#30363d');
      root.style.setProperty('--text-primary', '#f0f6fc');
      root.style.setProperty('--text-secondary', '#8b949e');
      root.style.setProperty('--accent', '#58a6ff');
      root.style.setProperty('--accent-hover', '#1f6feb');
      root.style.setProperty('--chart-tooltip-bg', '#161b22');
      root.style.setProperty('--chart-tooltip-text', '#f0f6fc');
    }
  }, [theme]);

  return { theme, setTheme };
}
