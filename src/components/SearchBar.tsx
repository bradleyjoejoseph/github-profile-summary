import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, X, History } from 'lucide-react';

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  currentUsername: string;
}

const PRESETS = [
  { username: 'bradleyjoejoseph', label: 'Bradley Joseph', featured: true },
  { username: 'torvalds', label: 'Linus Torvalds' },
  { username: 'gaearon', label: 'Dan Abramov' },
  { username: 'antfu', label: 'Anthony Fu' },
  { username: 'shadcn', label: 'Shadcn' },
  { username: 'leerob', label: 'Lee Robinson' },
  { username: 'tj', label: 'TJ Holowaychuk' },
];

const RECENT_KEY = 'gitpulse_recent_searches';

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  currentUsername,
}) => {
  const [inputValue, setInputValue] = useState(currentUsername);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setInputValue(currentUsername);
  }, [currentUsername]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}

    onSearch(trimmed);
  };

  const handlePresetClick = (user: string) => {
    setInputValue(user);
    onSearch(user);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-4 pt-4 sm:pt-7 pb-2">
      {/* macOS Spotlight Inspired Search Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2997ff]/20 via-[#58a6ff]/20 to-[#a855f7]/20 blur-md opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none" />
        <div className="relative flex items-center bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden pl-3 pr-1.5 min-h-[50px]">
          <div className="text-[var(--text-secondary)] shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search GitHub developer..."
            className="w-full py-3 pl-2.5 pr-2 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-base sm:text-sm focus:outline-hidden min-h-[44px]"
            disabled={isLoading}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="search"
          />

          {/* Clear button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[44px] min-w-[36px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
              title="Clear input"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Action Button */}
          <div className="shrink-0">
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="min-h-[40px] px-3.5 sm:px-4 flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs bg-[#2997ff] hover:bg-[#3ea3ff] disabled:opacity-50 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Capsules - Horizontal Smooth Scroll Tray on Mobile */}
      <div className="mt-3 flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar py-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap">
        <span className="text-[var(--text-secondary)] font-semibold flex items-center gap-1 shrink-0 mr-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        {PRESETS.map((preset) => {
          const isCurrent =
            currentUsername.toLowerCase() === preset.username.toLowerCase();
          return (
            <button
              key={preset.username}
              onClick={() => handlePresetClick(preset.username)}
              className={`min-h-[34px] px-3 py-1 rounded-full transition-all flex items-center gap-1 font-medium text-[11px] shrink-0 active:scale-95 cursor-pointer ${
                preset.featured
                  ? 'bg-blue-500/15 text-[#2997ff] border border-blue-500/30 hover:bg-blue-500/25 shadow-xs'
                  : isCurrent
                  ? 'bg-[#2997ff] text-white font-bold'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
              }`}
            >
              {preset.featured && <span className="text-amber-400 font-bold">★</span>}
              <span>{preset.label}</span>
            </button>
          );
        })}

        {recentSearches.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 ml-auto text-[11px] text-[var(--text-tertiary)]">
            <History className="w-3 h-3" />
            <span>Recent:</span>
            {recentSearches.slice(0, 3).map((item) => (
              <button
                key={item}
                onClick={() => handlePresetClick(item)}
                className="underline hover:text-[var(--text-primary)] cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
