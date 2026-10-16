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

    // Save to recents
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
    <div className="w-full max-w-4xl mx-auto px-4 pt-6 pb-2">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-xs opacity-30 group-hover:opacity-60 transition duration-300" />
        <div className="relative flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden">
          <div className="pl-4 text-[var(--text-secondary)]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search GitHub username (e.g. bradleyjoejoseph, torvalds, antfu)..."
            className="w-full py-4 pl-3 pr-24 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm sm:text-base focus:outline-hidden"
            disabled={isLoading}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-card)] transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="pr-2">
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Presets & Recents */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[var(--text-secondary)] font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Presets:
        </span>
        {PRESETS.map((preset) => {
          const isCurrent =
            currentUsername.toLowerCase() === preset.username.toLowerCase();
          return (
            <button
              key={preset.username}
              onClick={() => handlePresetClick(preset.username)}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
                preset.featured
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 shadow-xs'
                  : isCurrent
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              {preset.featured && <span className="text-amber-400">★</span>}
              <span>{preset.label}</span>
            </button>
          );
        })}

        {recentSearches.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 ml-auto text-[var(--text-secondary)]">
            <History className="w-3.5 h-3.5" />
            <span>Recent:</span>
            {recentSearches.slice(0, 3).map((item) => (
              <button
                key={item}
                onClick={() => handlePresetClick(item)}
                className="underline hover:text-[var(--text-primary)]"
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
