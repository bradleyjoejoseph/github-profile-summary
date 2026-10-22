import React from 'react';
import {
  Activity,
  Moon,
  Sun,
  Flame,
  Swords,
  Trophy,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import type { Theme } from '../hooks/useTheme';

export type ActivePage = 'profile' | 'leaderboard';

interface NavbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  activePage: ActivePage;
  onChangePage: (page: ActivePage) => void;
  onOpenCompareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  activePage,
  onChangePage,
  onOpenCompareModal,
}) => {
  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="apple-glass-dock rounded-2xl h-14 px-3 sm:px-6 flex items-center justify-between gap-2.5 transition-all">
        {/* Brand + Page Segmented Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={() => onChangePage('profile')}
            className="flex items-center gap-2 cursor-pointer group min-h-[40px] focus-visible:ring-2 focus-visible:ring-[#2997ff] rounded-xl shrink-0"
            aria-label="GitPulse Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2997ff] to-[#0077ed] flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)]">
              GitPulse
            </span>
          </button>

          {/* Segmented Page Switcher (Optimized for both mobile and desktop) */}
          <div className="apple-segmented-track shrink-0">
            <button
              onClick={() => onChangePage('profile')}
              className={`apple-segmented-item flex items-center gap-1 sm:gap-1.5 cursor-pointer min-h-[32px] px-2 sm:px-3 text-xs ${
                activePage === 'profile' ? 'active' : ''
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => onChangePage('leaderboard')}
              className={`apple-segmented-item flex items-center gap-1 sm:gap-1.5 cursor-pointer min-h-[32px] px-2 sm:px-3 text-xs ${
                activePage === 'leaderboard' ? 'active' : ''
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Rankings</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Versus Mode Action Button */}
          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2997ff] to-purple-600 hover:from-[#3ea3ff] hover:to-purple-500 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[36px]"
            title="Head-to-head Versus Battle"
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Versus</span>
          </button>

          {/* Mobile One-Tap Theme Toggle */}
          <button
            onClick={() => {
              const nextTheme = theme === 'dark' ? 'midnight' : theme === 'midnight' ? 'light' : 'dark';
              onThemeChange(nextTheme);
            }}
            className="sm:hidden p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-color)] transition-all active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            title={`Current: ${theme}. Tap to switch.`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-blue-400" />
            ) : theme === 'midnight' ? (
              <Flame className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </button>

          {/* Desktop Segmented Theme Switcher */}
          <div className="apple-segmented-track hidden sm:inline-flex">
            <button
              onClick={() => onThemeChange('dark')}
              title="Dark Appearance"
              className={`apple-segmented-item cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center ${theme === 'dark' ? 'active' : ''}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              title="Midnight AMOLED"
              className={`apple-segmented-item cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center ${theme === 'midnight' ? 'active' : ''}`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('light')}
              title="Light Appearance"
              className={`apple-segmented-item cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center ${theme === 'light' ? 'active' : ''}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* GitHub Star Link */}
          <a
            href="https://github.com/bradleyjoejoseph/gitpulse"
            target="_blank"
            rel="noopener noreferrer"
            title="Star on GitHub"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-color)] transition-all active:scale-95 min-h-[36px]"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono">Star</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-secondary)] opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};
