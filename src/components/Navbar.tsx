import React from 'react';
import {
  Activity,
  Key,
  Moon,
  Sun,
  Flame,
  GitCompare,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import type { Theme } from '../hooks/useTheme';
import type { RateLimitInfo } from '../types/github';

interface NavbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  rateLimit: RateLimitInfo;
  onOpenTokenModal: () => void;
  onOpenCompareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  rateLimit,
  onOpenTokenModal,
  onOpenCompareModal,
}) => {
  const isNearLimit = rateLimit.remaining < 10;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--bg-primary)]/85 border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                GitPulse
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.0
              </span>
            </div>
            <p className="hidden md:block text-xs text-[var(--text-secondary)]">
              GitHub Profile Summary & Analytics
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rate limit badge */}
          <button
            onClick={onOpenTokenModal}
            title={`GitHub API Rate Limit: ${rateLimit.remaining}/${rateLimit.limit} remaining`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isNearLimit
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isNearLimit ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span className="hidden sm:inline">API:</span>
            <span className="font-mono font-semibold">{rateLimit.remaining}</span>
            <Key className="w-3.5 h-3.5 ml-0.5 opacity-70" />
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Versus Mode</span>
          </button>

          {/* Theme selector */}
          <div className="relative flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => onThemeChange('dark')}
              title="Dark Theme"
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              title="Midnight AMOLED"
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'midnight'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('light')}
              title="Light Theme"
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/bradleyjoejoseph/github-profile-summary"
            target="_blank"
            rel="noopener noreferrer"
            title="View Source on GitHub"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden md:inline font-mono">Star</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-secondary)]" />
          </a>
        </div>
      </div>
    </header>
  );
};
