import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Swords,
  GitCommitHorizontal,
  GitFork,
  Users,
  BookOpen,
  Star,
  Plus,
  Loader2,
  ArrowUpRight,
  Zap,
  Info,
} from 'lucide-react';
import type { UserSummaryData } from '../types/github';
import { calculateGitPulseScore, useCountUpFromZero } from '../services/gitpulseScore';

export type LeaderboardCategoryId =
  | 'gp_score'
  | 'stars'
  | 'commits'
  | 'forks'
  | 'followers'
  | 'repos';

interface CategoryConfig {
  id: LeaderboardCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  getValue: (entry: EnrichedLeaderboardEntry) => number;
  formatValue: (entry: EnrichedLeaderboardEntry) => string;
}

interface EnrichedLeaderboardEntry {
  summary: UserSummaryData;
  gp: ReturnType<typeof calculateGitPulseScore>;
}

interface LeaderboardPageProps {
  profiles: UserSummaryData[];
  currentUsername: string;
  onAddProfile: (username: string) => Promise<void>;
  onSelectProfile: (username: string) => void;
  onBattleUser: (opponentUsername: string) => void;
  isAddingUser: boolean;
  addError: string | null;
}

const ScoreCell: React.FC<{ score: number; triggerKey: string }> = ({ score, triggerKey }) => {
  const animated = useCountUpFromZero(score, 1200, triggerKey);
  return <>{animated.toLocaleString()}</>;
};

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  profiles,
  currentUsername,
  onAddProfile,
  onSelectProfile,
  onBattleUser,
  isAddingUser,
  addError,
}) => {
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategoryId>('gp_score');
  const [newUsername, setNewUsername] = useState('');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const enrichedProfiles: EnrichedLeaderboardEntry[] = useMemo(() => {
    return profiles.map((summary) => ({
      summary,
      gp: calculateGitPulseScore(summary),
    }));
  }, [profiles]);

  const categories: CategoryConfig[] = useMemo(
    () => [
      {
        id: 'gp_score',
        label: 'GitPulse Score',
        shortLabel: 'GitPulse Score',
        description: 'Overall weighted score combining Stars, Commits, Forks, Followers, and Repositories',
        icon: <Trophy className="w-4 h-4 text-amber-400" />,
        accentColor: '#f59e0b',
        getValue: (e) => e.gp.totalScore,
        formatValue: (e) => `${e.gp.totalScore.toLocaleString()} GP`,
      },
      {
        id: 'stars',
        label: 'Most Stars',
        shortLabel: 'Total Stars',
        description: 'Total stargazers earned across all public repositories showing open-source adoption',
        icon: <Star className="w-4 h-4 text-yellow-400" />,
        accentColor: '#facc15',
        getValue: (e) => e.gp.metrics.totalStars,
        formatValue: (e) => `★ ${e.gp.metrics.totalStars.toLocaleString()}`,
      },
      {
        id: 'commits',
        label: 'Most Commits',
        shortLabel: 'Total Commits',
        description: 'Lifetime GitHub commits and code contributions pushed across years active',
        icon: <GitCommitHorizontal className="w-4 h-4 text-emerald-400" />,
        accentColor: '#10b981',
        getValue: (e) => e.gp.metrics.totalCommits,
        formatValue: (e) => `${e.gp.metrics.totalCommits.toLocaleString()} commits`,
      },
      {
        id: 'forks',
        label: 'Most Forks',
        shortLabel: 'Total Forks',
        description: 'Times other developers around the world forked and built upon their repositories',
        icon: <GitFork className="w-4 h-4 text-[#2997ff]" />,
        accentColor: '#2997ff',
        getValue: (e) => e.gp.metrics.totalForks,
        formatValue: (e) => `${e.gp.metrics.totalForks.toLocaleString()} forks`,
      },
      {
        id: 'followers',
        label: 'Most Followers',
        shortLabel: 'Followers',
        description: 'Global developer community following their work and releases on GitHub',
        icon: <Users className="w-4 h-4 text-purple-400" />,
        accentColor: '#a855f7',
        getValue: (e) => e.gp.metrics.followers,
        formatValue: (e) => `${e.gp.metrics.followers.toLocaleString()} followers`,
      },
      {
        id: 'repos',
        label: 'Most Repositories',
        shortLabel: 'Public Repos',
        description: 'Total public repositories and open-source projects published on GitHub',
        icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
        accentColor: '#38bdf8',
        getValue: (e) => e.gp.metrics.publicRepos,
        formatValue: (e) => `${e.gp.metrics.publicRepos.toLocaleString()} repos`,
      },
    ],
    []
  );

  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  const sortedEntries = useMemo(() => {
    return [...enrichedProfiles].sort((a, b) => currentCat.getValue(b) - currentCat.getValue(a));
  }, [enrichedProfiles, currentCat]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    await onAddProfile(newUsername.trim());
    setNewUsername('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
      {/* Leaderboard Hero Banner */}
      <div className="apple-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2997ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Global Developer Impact & Stat Leaderboards</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              GitPulse Leaderboards
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#8b949e] max-w-2xl leading-relaxed">
              Developers ranked by their <span className="text-[#2997ff] font-semibold">GitPulse Score</span> and real-world impact across{' '}
              <span className="text-white font-medium">Stars, Commits, Forks, Followers, and Repositories</span>.
            </p>
          </div>

          {/* Add any GitHub user to the live leaderboard */}
          <div className="w-full lg:w-auto shrink-0">
            <form onSubmit={handleAddSubmit} className="flex sm:w-96 gap-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Add any GitHub user to leaderboard..."
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-black/50 border border-white/12 text-xs sm:text-sm text-white placeholder-[#6e7681] focus:outline-hidden focus:border-[#2997ff]"
              />
              <button
                type="submit"
                disabled={isAddingUser || !newUsername.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2997ff] to-[#0071e3] hover:from-[#3ea3ff] hover:to-[#0077ed] disabled:opacity-50 text-white shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {isAddingUser ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Rank User</span>
              </button>
            </form>
            {addError && (
              <p className="text-xs text-red-400 mt-1.5">{addError}</p>
            )}
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#8b949e]">
              <span>Ranked Roster: {enrichedProfiles.length} Developers</span>
              <button
                type="button"
                onClick={() => setShowFormulaModal(!showFormulaModal)}
                className="text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3 h-3" />
                <span>{showFormulaModal ? 'Hide Score Weightings' : 'How GitPulse Score Works'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Formula Explanation Drawer */}
        {showFormulaModal && (
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-5 gap-3 battle-round-slide-down">
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">1. Total Commits</span>
              <p className="text-xs font-mono font-bold text-white mt-1">1 GP / 12.5 Commits</p>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Rewards consistent code contributions</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
              <span className="text-[11px] font-bold text-amber-400 uppercase">2. Total Stars</span>
              <p className="text-xs font-mono font-bold text-white mt-1">√Stars × 1.4 GP</p>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Measures open-source impact & adoption</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-purple-500/20">
              <span className="text-[11px] font-bold text-purple-400 uppercase">3. Forks & Reach</span>
              <p className="text-xs font-mono font-bold text-white mt-1">Forks + Followers</p>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Global developer community reach</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-blue-500/20">
              <span className="text-[11px] font-bold text-[#2997ff] uppercase">4. Public Repos</span>
              <p className="text-xs font-mono font-bold text-white mt-1">2 GP × Public Repos</p>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Projects shared with the world</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20">
              <span className="text-[11px] font-bold text-cyan-400 uppercase">5. Stack & Tenure</span>
              <p className="text-xs font-mono font-bold text-white mt-1">4 GP/lang + 3 GP/yr</p>
              <p className="text-[11px] text-[#8b949e] mt-0.5">Multi-language breadth & experience</p>
            </div>
          </div>
        )}
      </div>

      {/* Category Champions Bento */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8b949e] flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Category Leaders (#1 in Each Stat)</span>
          </h2>
          <span className="text-xs text-[#6e7681] hidden sm:inline">
            Click any card to filter the leaderboard by that stat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const champ = [...enrichedProfiles].sort(
              (a, b) => cat.getValue(b) - cat.getValue(a)
            )[0];
            if (!champ) return null;

            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`apple-card p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-[#2997ff] bg-[#1c2331]/90'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">
                      {cat.shortLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    #1 Leader
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={champ.summary.user.avatar_url}
                      alt={champ.summary.user.login}
                      className="w-11 h-11 rounded-xl border border-white/15 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {champ.summary.user.name || champ.summary.user.login}
                      </h3>
                      <p className="text-xs font-mono text-[#2997ff] truncate">
                        @{champ.summary.user.login}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className="text-sm font-extrabold font-mono block"
                      style={{ color: cat.accentColor }}
                    >
                      {cat.formatValue(champ)}
                    </span>
                    <span className="text-[10px] font-mono text-[#8b949e]">
                      {champ.gp.totalScore.toLocaleString()} GP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#2997ff] text-white shadow-lg shadow-blue-500/25'
                  : 'bg-[#161b22]/80 text-[#8b949e] hover:text-white border border-white/8'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium Cards for Active Stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedEntries.slice(0, 3).map((entry, idx) => {
          const rank = idx + 1;
          const medalColors = [
            'from-amber-400/20 via-amber-500/5 to-transparent border-amber-400/40',
            'from-slate-300/20 via-slate-400/5 to-transparent border-slate-300/35',
            'from-amber-700/20 via-amber-800/5 to-transparent border-amber-600/35',
          ];
          const badgeLabels = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];

          return (
            <div
              key={`${entry.summary.user.login}-${activeCategory}`}
              className={`apple-card p-5 bg-gradient-to-b ${medalColors[idx]} relative overflow-hidden flex flex-col justify-between battle-round-slide-down`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-black/50 text-white border border-white/10">
                    {badgeLabels[idx]}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${entry.gp.rankBadgeColor}15`,
                      color: entry.gp.rankBadgeColor,
                      borderColor: `${entry.gp.rankBadgeColor}40`,
                    }}
                  >
                    {entry.gp.rankTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={entry.summary.user.avatar_url}
                    alt={entry.summary.user.login}
                    className="w-14 h-14 rounded-2xl border-2 border-white/20 object-cover shadow-md"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-white truncate">
                      {entry.summary.user.name || entry.summary.user.login}
                    </h3>
                    <p className="text-xs font-mono text-[#2997ff] truncate">
                      @{entry.summary.user.login}
                    </p>
                    <p className="text-[11px] text-[#8b949e] truncate mt-0.5">
                      Primary: {entry.summary.primaryLanguage}
                    </p>
                  </div>
                </div>

                {/* Highlighted Category Stat + GitPulse Score */}
                <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/8 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-bold block">
                      {currentCat.shortLabel}
                    </span>
                    <span
                      className="text-lg font-extrabold font-mono"
                      style={{ color: currentCat.accentColor }}
                    >
                      {currentCat.formatValue(entry)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-bold block">
                      GitPulse Score
                    </span>
                    <span className="text-sm font-extrabold font-mono text-white">
                      <ScoreCell
                        score={entry.gp.totalScore}
                        triggerKey={`${entry.summary.user.login}-${activeCategory}-${rank}`}
                      />{' '}
                      <span className="text-[#2997ff] text-xs">GP</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-2">
                <button
                  onClick={() => onBattleUser(entry.summary.user.login)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2997ff] to-purple-600 hover:from-[#3ea3ff] hover:to-purple-500 text-white shadow-sm transition-all cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Versus Battle</span>
                </button>
                <button
                  onClick={() => onSelectProfile(entry.summary.user.login)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Standings Table */}
      <div className="apple-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {currentCat.icon}
              <span>Full Standings — {currentCat.label}</span>
            </h3>
            <p className="text-xs text-[#8b949e] mt-0.5">{currentCat.description}</p>
          </div>
          <span className="text-xs font-mono text-[#8b949e]">
            Showing all {sortedEntries.length} ranked engineers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/8 text-[11px] font-bold uppercase tracking-wider text-[#8b949e] bg-black/20">
                <th className="py-3.5 px-4 w-16">Rank</th>
                <th className="py-3.5 px-4">Developer</th>
                <th className="py-3.5 px-4">GitPulse Score</th>
                <th className="py-3.5 px-4">Total Stars</th>
                <th className="py-3.5 px-4">Total Commits</th>
                <th className="py-3.5 px-4">Forks</th>
                <th className="py-3.5 px-4">Followers</th>
                <th className="py-3.5 px-4">Repos</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {sortedEntries.map((entry, idx) => {
                const rank = idx + 1;
                const isCurrentUser =
                  entry.summary.user.login.toLowerCase() === currentUsername.toLowerCase();

                return (
                  <tr
                    key={entry.summary.user.login}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-[#2997ff]/10 hover:bg-[#2997ff]/15'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-extrabold">
                      {rank === 1 ? (
                        <span className="text-amber-400 text-base">🥇 #1</span>
                      ) : rank === 2 ? (
                        <span className="text-slate-300 text-base">🥈 #2</span>
                      ) : rank === 3 ? (
                        <span className="text-amber-600 text-base">🥉 #3</span>
                      ) : (
                        <span className="text-[#8b949e]">#{rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.summary.user.avatar_url}
                          alt={entry.summary.user.login}
                          className="w-9 h-9 rounded-xl border border-white/15 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">
                              {entry.summary.user.name || entry.summary.user.login}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2997ff]/20 text-[#2997ff] font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-[#8b949e]">
                            @{entry.summary.user.login}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-extrabold text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{entry.gp.totalScore.toLocaleString()} GP</span>
                      </div>
                      <span
                        className="text-[10px] font-medium block"
                        style={{ color: entry.gp.rankBadgeColor }}
                      >
                        {entry.gp.rankTitle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">
                      ★ {entry.gp.metrics.totalStars.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {entry.gp.metrics.totalCommits.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#2997ff] font-semibold">
                      {entry.gp.metrics.totalForks.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-purple-300 font-semibold">
                      {entry.gp.metrics.followers.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-cyan-300 font-semibold">
                      {entry.gp.metrics.publicRepos.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onBattleUser(entry.summary.user.login)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#2997ff]/15 hover:bg-[#2997ff]/25 text-[#2997ff] border border-[#2997ff]/30 transition-all cursor-pointer flex items-center gap-1"
                          title="Fight in Versus Tug-of-War"
                        >
                          <Swords className="w-3 h-3" />
                          <span>Fight</span>
                        </button>
                        <button
                          onClick={() => onSelectProfile(entry.summary.user.login)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
