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
      root.style.setProperty('--bg-canvas', '#f6f8fa');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f0f2f5');
      root.style.setProperty('--bg-surface', '#e6ebf1');
      root.style.setProperty('--bg-surface-hover', '#dbe2ea');
      root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.92)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--glass-highlight', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--border-color', '#d0d7de');
      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--text-primary', '#1f2328');
      root.style.setProperty('--text-secondary', '#57606a');
      root.style.setProperty('--text-tertiary', '#6e7781');
      root.style.setProperty('--text-quaternary', '#8c959f');
      root.style.setProperty('--accent', '#0969da');
      root.style.setProperty('--accent-hover', '#0550ae');
      root.style.setProperty('--accent-subtle', 'rgba(9, 105, 218, 0.08)');
      root.style.setProperty('--accent-glow', 'rgba(9, 105, 218, 0.18)');
      root.style.setProperty('--chart-tooltip-bg', '#ffffff');
      root.style.setProperty('--chart-tooltip-text', '#1f2328');
    } else if (theme === 'midnight') {
      root.style.setProperty('--bg-canvas', '#020408');
      root.style.setProperty('--bg-primary', '#040812');
      root.style.setProperty('--bg-secondary', '#090d16');
      root.style.setProperty('--bg-surface', '#0e1420');
      root.style.setProperty('--bg-surface-hover', '#161f30');
      root.style.setProperty('--bg-card', 'rgba(14, 20, 32, 0.92)');
      root.style.setProperty('--glass-bg', 'rgba(9, 13, 22, 0.85)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-highlight', 'rgba(255, 255, 255, 0.04)');
      root.style.setProperty('--border-color', '#1e293b');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--text-quaternary', '#475569');
      root.style.setProperty('--accent', '#38bdf8');
      root.style.setProperty('--accent-hover', '#0284c7');
      root.style.setProperty('--accent-subtle', 'rgba(56, 189, 248, 0.12)');
      root.style.setProperty('--accent-glow', 'rgba(56, 189, 248, 0.25)');
      root.style.setProperty('--chart-tooltip-bg', '#090d16');
      root.style.setProperty('--chart-tooltip-text', '#f8fafc');
    } else {
      // Default dark
      root.style.setProperty('--bg-canvas', '#090d16');
      root.style.setProperty('--bg-primary', '#0d1117');
      root.style.setProperty('--bg-secondary', '#161b22');
      root.style.setProperty('--bg-surface', '#1c2128');
      root.style.setProperty('--bg-surface-hover', '#22272e');
      root.style.setProperty('--bg-card', 'rgba(22, 27, 34, 0.85)');
      root.style.setProperty('--glass-bg', 'rgba(22, 27, 34, 0.72)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--glass-highlight', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--border-color', '#30363d');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--text-primary', '#f0f6fc');
      root.style.setProperty('--text-secondary', '#8b949e');
      root.style.setProperty('--text-tertiary', '#6e7681');
      root.style.setProperty('--text-quaternary', '#484f58');
      root.style.setProperty('--accent', '#2997ff');
      root.style.setProperty('--accent-hover', '#0077ed');
      root.style.setProperty('--accent-subtle', 'rgba(41, 151, 255, 0.12)');
      root.style.setProperty('--accent-glow', 'rgba(41, 151, 255, 0.25)');
      root.style.setProperty('--chart-tooltip-bg', '#161b22');
      root.style.setProperty('--chart-tooltip-text', '#f0f6fc');
    }
  }, [theme]);

  return { theme, setTheme };
}
