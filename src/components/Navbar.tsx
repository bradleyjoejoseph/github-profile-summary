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
    <header className="sticky top-3 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="apple-glass-dock rounded-2xl h-14 px-4 sm:px-6 flex items-center justify-between gap-3 transition-all">
        {/* Brand + Page Switcher */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChangePage('profile')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2997ff] to-[#0077ed] flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-semibold text-base tracking-tight text-[var(--text-primary)]">
              GitPulse
            </span>
          </button>

          {/* Main Navigation Segmented Pill */}
          <div className="apple-segmented-track">
            <button
              onClick={() => onChangePage('profile')}
              className={`apple-segmented-item flex items-center gap-1.5 cursor-pointer ${
                activePage === 'profile' ? 'active' : ''
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => onChangePage('leaderboard')}
              className={`apple-segmented-item flex items-center gap-1.5 cursor-pointer ${
                activePage === 'leaderboard' ? 'active' : ''
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboards</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Versus Mode Action Button */}
          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2997ff] to-purple-600 hover:from-[#3ea3ff] hover:to-purple-500 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Versus Mode</span>
          </button>

          {/* Apple Segmented Theme Switcher */}
          <div className="apple-segmented-track hidden sm:inline-flex">
            <button
              onClick={() => onThemeChange('dark')}
              title="Dark Appearance"
              className={`apple-segmented-item cursor-pointer ${theme === 'dark' ? 'active' : ''}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              title="Midnight AMOLED"
              className={`apple-segmented-item cursor-pointer ${theme === 'midnight' ? 'active' : ''}`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('light')}
              title="Light Appearance"
              className={`apple-segmented-item cursor-pointer ${theme === 'light' ? 'active' : ''}`}
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-[var(--text-primary)] hover:border-white/20 transition-all active:scale-95"
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
