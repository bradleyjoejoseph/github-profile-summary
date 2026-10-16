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
    <header className="sticky top-3 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="apple-glass-dock rounded-2xl h-14 px-4 sm:px-6 flex items-center justify-between gap-3 transition-all">
        {/* Brand with macOS window indicator accent */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 inline-block shadow-xs" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2997ff] to-[#0077ed] flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight text-[var(--text-primary)]">
                GitPulse
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#8b949e] border border-white/10">
                macOS + Primer
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Rate limit status pill */}
          <button
            onClick={onOpenTokenModal}
            title={`GitHub API Quota: ${rateLimit.remaining}/${rateLimit.limit} requests`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95 ${
              isNearLimit
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isNearLimit ? 'bg-red-500 animate-ping' : 'bg-[#27c93f]'
              }`}
            />
            <span className="hidden sm:inline font-mono">API:</span>
            <span className="font-mono font-semibold">{rateLimit.remaining}</span>
            <Key className="w-3 h-3 ml-0.5 opacity-70" />
          </button>

          {/* Versus Mode Action Button */}
          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#2997ff] to-[#0071e3] hover:from-[#3ea3ff] hover:to-[#0077ed] text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Versus Mode</span>
          </button>

          {/* Apple Segmented Theme Switcher */}
          <div className="apple-segmented-track">
            <button
              onClick={() => onThemeChange('dark')}
              title="Dark Appearance"
              className={`apple-segmented-item ${theme === 'dark' ? 'active' : ''}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              title="Midnight AMOLED"
              className={`apple-segmented-item ${theme === 'midnight' ? 'active' : ''}`}
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('light')}
              title="Light Appearance"
              className={`apple-segmented-item ${theme === 'light' ? 'active' : ''}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* GitHub Star Link */}
          <a
            href="https://github.com/bradleyjoejoseph/github-profile-summary"
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
