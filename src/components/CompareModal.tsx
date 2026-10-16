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
      // Trigger confetti celebration!
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 sm:p-8 max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Developer Versus Mode
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Compare developer statistics head-to-head
            </p>
          </div>
        </div>

        {/* Search for competitor */}
        <form onSubmit={handleCompare} className="mt-6 flex gap-2">
          <input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder="Enter second GitHub username (e.g. torvalds, gaearon)..."
            className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={isLoading || !targetUsername.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trophy className="w-4 h-4" />
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
          <div className="mt-8 space-y-6">
            {/* Header cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* User A */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] flex items-center gap-3">
                <img
                  src={userA.user.avatar_url}
                  alt={userA.user.login}
                  className="w-12 h-12 rounded-full border border-blue-500/40"
                />
                <div className="truncate">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {userA.user.name || userA.user.login}
                  </h3>
                  <p className="text-xs font-mono text-[var(--accent)]">
                    @{userA.user.login}
                  </p>
                </div>
              </div>

              {/* User B */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] flex items-center gap-3">
                <img
                  src={userB.user.avatar_url}
                  alt={userB.user.login}
                  className="w-12 h-12 rounded-full border border-purple-500/40"
                />
                <div className="truncate">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {userB.user.name || userB.user.login}
                  </h3>
                  <p className="text-xs font-mono text-purple-400">
                    @{userB.user.login}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-4">
              {/* Metric: Stars */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-blue-400 font-mono">
                    ★ {userA.totalStars.toLocaleString()}
                  </span>
                  <span className="text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Total Stars
                  </span>
                  <span className="text-purple-400 font-mono">
                    ★ {userB.totalStars.toLocaleString()}
                  </span>
                </div>
                {/* Bar */}
                <div className="h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
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
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-blue-400 font-mono">
                    {userA.user.followers.toLocaleString()}
                  </span>
                  <span className="text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-pink-400" /> Followers
                  </span>
                  <span className="text-purple-400 font-mono">
                    {userB.user.followers.toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
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
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-blue-400 font-mono">
                    {userA.user.public_repos.toLocaleString()}
                  </span>
                  <span className="text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Public Repos
                  </span>
                  <span className="text-purple-400 font-mono">
                    {userB.user.public_repos.toLocaleString()}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
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
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Primary Language
                  </span>
                  <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-sm text-[var(--text-primary)]">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: getLanguageColor(userA.primaryLanguage),
                      }}
                    />
                    <span>{userA.primaryLanguage}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Primary Language
                  </span>
                  <div className="flex items-center justify-center gap-1.5 mt-1 font-bold text-sm text-[var(--text-primary)]">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
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
          <div className="mt-8 py-10 text-center text-[var(--text-secondary)] text-sm">
            Enter a GitHub handle above to load and compare stats in real-time.
          </div>
        )}
      </div>
    </div>
  );
};
