import React from 'react';
import { UserCheck, Trophy, Swords, Moon, Flame, Sun } from 'lucide-react';
import type { ActivePage } from './Navbar';
import type { Theme } from '../hooks/useTheme';

interface MobileTabBarProps {
  activePage: ActivePage;
  onChangePage: (page: ActivePage) => void;
  onOpenCompareModal: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activePage,
  onChangePage,
  onOpenCompareModal,
  theme,
  onThemeChange,
}) => {
  const cycleTheme = () => {
    if (theme === 'dark') onThemeChange('midnight');
    else if (theme === 'midnight') onThemeChange('light');
    else onThemeChange('dark');
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="sm:hidden fixed bottom-3 inset-x-3 z-40 apple-glass-dock rounded-2xl h-16 px-2 flex items-center justify-around shadow-2xl border border-white/12 transition-all"
    >
      {/* Tab 1: Profile */}
      <button
        onClick={() => onChangePage('profile')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
          activePage === 'profile'
            ? 'text-[#2997ff] font-bold'
            : 'text-[#8b949e] hover:text-[var(--text-primary)]'
        }`}
        aria-label="Developer Profile"
      >
        <div
          className={`p-1 rounded-xl transition-all ${
            activePage === 'profile' ? 'bg-[#2997ff]/15' : ''
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight">Profile</span>
      </button>

      {/* Tab 2: Leaderboards */}
      <button
        onClick={() => onChangePage('leaderboard')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
          activePage === 'leaderboard'
            ? 'text-amber-400 font-bold'
            : 'text-[#8b949e] hover:text-[var(--text-primary)]'
        }`}
        aria-label="Global Leaderboards"
      >
        <div
          className={`p-1 rounded-xl transition-all ${
            activePage === 'leaderboard' ? 'bg-amber-400/15' : ''
          }`}
        >
          <Trophy className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight">Rankings</span>
      </button>

      {/* Tab 3: Versus Center Action Button */}
      <button
        onClick={onOpenCompareModal}
        className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-90 cursor-pointer"
        aria-label="Open Versus Battle Arena"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2997ff] to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
          <Swords className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold text-white tracking-tight">Versus</span>
      </button>

      {/* Tab 4: Theme Cycle */}
      <button
        onClick={cycleTheme}
        className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 text-[#8b949e] hover:text-[var(--text-primary)] transition-all active:scale-95 cursor-pointer"
        aria-label={`Cycle theme. Current: ${theme}`}
        title={`Current: ${theme} appearance. Tap to cycle.`}
      >
        <div className="p-1 rounded-xl bg-white/5 border border-white/8">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-blue-300" />
          ) : theme === 'midnight' ? (
            <Flame className="w-5 h-5 text-purple-400" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </div>
        <span className="text-[10px] capitalize tracking-tight font-mono">
          {theme}
        </span>
      </button>
    </nav>
  );
};
