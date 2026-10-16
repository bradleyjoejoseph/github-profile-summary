import React, { useState } from 'react';
import { X, GitCompare, Loader2, Trophy, Star, BookOpen, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchUserSummary } from '../services/githubApi';
import type { UserSummaryData } from '../types/github';
import { getLanguageColor } from '../services/languageColors';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSummaryData;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [targetUsername, setTargetUsername] = useState('torvalds');
  const [comparedUser, setComparedUser] = useState<UserSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUsername.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchUserSummary(targetUsername.trim());
      setComparedUser(data);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user for comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  const userA = currentUser;
  const userB = comparedUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#161b22]/95 border border-white/10 shadow-2xl p-6 sm:p-7 max-h-[90dvh] overflow-y-auto">
        {/* macOS Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8b949e] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Developer Versus Mode
            </h2>
            <p className="text-xs text-[#8b949e]">
              Compare developer statistics head-to-head
            </p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleCompare} className="mt-5 flex gap-2">
          <input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder="Enter second GitHub handle (e.g. torvalds, gaearon)..."
            className="flex-1 py-2 px-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[#6e7681] focus:outline-hidden focus:border-[#2997ff]"
          />
          <button
            type="submit"
            disabled={isLoading || !targetUsername.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs bg-[#2997ff] hover:bg-[#3ea3ff] disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trophy className="w-3.5 h-3.5" />
            )}
            <span>Compare</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Comparison Arena */}
        {userB ? (
          <div className="mt-6 space-y-4">
            {/* Header Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex items-center gap-3">
                <img
                  src={userA.user.avatar_url}
                  alt={userA.user.login}
                  className="w-10 h-10 rounded-xl border border-blue-500/40"
                />
                <div className="truncate">
                  <h3 className="font-bold text-xs text-[var(--text-primary)] truncate">
                    {userA.user.name || userA.user.login}
                  </h3>
                  <p className="text-[11px] font-mono text-[#2997ff]">
                    @{userA.user.login}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex items-center gap-3">
                <img
                  src={userB.user.avatar_url}
                  alt={userB.user.login}
                  className="w-10 h-10 rounded-xl border border-purple-500/40"
                />
                <div className="truncate">
                  <h3 className="font-bold text-xs text-[var(--text-primary)] truncate">
                    {userB.user.name || userB.user.login}
                  </h3>
                  <p className="text-[11px] font-mono text-purple-400">
                    @{userB.user.login}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3">
              {/* Metric: Stars */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-[#2997ff] font-mono">
                    ★ {userA.totalStars.toLocaleString()}
                  </span>
                  <span className="text-[#8b949e] uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> Total Stars
                  </span>
                  <span className="text-purple-400 font-mono">
                    ★ {userB.totalStars.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#2997ff] transition-all duration-500"
                    style={{
                      width: `${
                        userA.totalStars + userB.totalStars === 0
                          ? 50
                          : (userA.totalStars / (userA.totalStars + userB.totalStars)) * 100
                      }%`,
                    }}
                  />
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${
                        userA.totalStars + userB.totalStars === 0
                          ? 50
                          : (userB.totalStars / (userA.totalStars + userB.totalStars)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Metric: Followers */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-[#2997ff] font-mono">
                    {userA.user.followers.toLocaleString()}
                  </span>
                  <span className="text-[#8b949e] uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Users className="w-3 h-3 text-pink-400" /> Followers
                  </span>
                  <span className="text-purple-400 font-mono">
                    {userB.user.followers.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#2997ff] transition-all duration-500"
                    style={{
                      width: `${
                        userA.user.followers + userB.user.followers === 0
                          ? 50
                          : (userA.user.followers /
                              (userA.user.followers + userB.user.followers)) *
                            100
                      }%`,
                    }}
                  />
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${
                        userA.user.followers + userB.user.followers === 0
                          ? 50
                          : (userB.user.followers /
                              (userA.user.followers + userB.user.followers)) *
                            100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Metric: Public Repos */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-[#2997ff] font-mono">
                    {userA.user.public_repos.toLocaleString()}
                  </span>
                  <span className="text-[#8b949e] uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" /> Public Repos
                  </span>
                  <span className="text-purple-400 font-mono">
                    {userB.user.public_repos.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#2997ff] transition-all duration-500"
                    style={{
                      width: `${
                        userA.user.public_repos + userB.user.public_repos === 0
                          ? 50
                          : (userA.user.public_repos /
                              (userA.user.public_repos + userB.user.public_repos)) *
                            100
                      }%`,
                    }}
                  />
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{
                      width: `${
                        userA.user.public_repos + userB.user.public_repos === 0
                          ? 50
                          : (userB.user.public_repos /
                              (userA.user.public_repos + userB.user.public_repos)) *
                            100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Primary Language */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#8b949e] uppercase font-semibold">
                    Primary Language
                  </span>
                  <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-xs text-[var(--text-primary)]">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getLanguageColor(userA.primaryLanguage),
                      }}
                    />
                    <span>{userA.primaryLanguage}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#8b949e] uppercase font-semibold">
                    Primary Language
                  </span>
                  <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-xs text-[var(--text-primary)]">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getLanguageColor(userB.primaryLanguage),
                      }}
                    />
                    <span>{userB.primaryLanguage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 py-10 text-center text-[#8b949e] text-xs">
            Enter a GitHub handle above to load and compare developer stats.
          </div>
        )}
      </div>
    </div>
  );
};
