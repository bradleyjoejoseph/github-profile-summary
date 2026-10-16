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
    <div className="w-full max-w-4xl mx-auto px-4 pt-7 pb-2">
      {/* macOS Spotlight Inspired Search Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2997ff]/20 via-[#58a6ff]/20 to-[#a855f7]/20 blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
        <div className="relative flex items-center bg-[#161b22]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden px-2">
          <div className="pl-3 text-[#8b949e]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search any GitHub developer (e.g. bradleyjoejoseph, torvalds, antfu)..."
            className="w-full py-3.5 pl-3 pr-4 bg-transparent text-[var(--text-primary)] placeholder-[#6e7681] text-sm focus:outline-hidden"
            disabled={isLoading}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />

          {/* Clear button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 mr-1 text-[#8b949e] hover:text-[#f0f6fc] rounded-lg hover:bg-white/10 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Action Button */}
          <div className="pr-1 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs bg-[#2997ff] hover:bg-[#3ea3ff] disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
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

      {/* Preset Capsules */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[#8b949e] font-medium flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {PRESETS.map((preset) => {
          const isCurrent =
            currentUsername.toLowerCase() === preset.username.toLowerCase();
          return (
            <button
              key={preset.username}
              onClick={() => handlePresetClick(preset.username)}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 font-medium text-[11px] ${
                preset.featured
                  ? 'bg-blue-500/15 text-[#2997ff] border border-blue-500/30 hover:bg-blue-500/25 shadow-xs'
                  : isCurrent
                  ? 'bg-[#2997ff] text-white'
                  : 'bg-white/5 border border-white/5 text-[#8b949e] hover:text-[#f0f6fc] hover:border-white/15'
              }`}
            >
              {preset.featured && <span className="text-amber-400 font-bold">★</span>}
              <span>{preset.label}</span>
            </button>
          );
        })}

        {recentSearches.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 ml-auto text-[11px] text-[#6e7681]">
            <History className="w-3 h-3" />
            <span>Recent:</span>
            {recentSearches.slice(0, 3).map((item) => (
              <button
                key={item}
                onClick={() => handlePresetClick(item)}
                className="underline hover:text-[#f0f6fc]"
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
