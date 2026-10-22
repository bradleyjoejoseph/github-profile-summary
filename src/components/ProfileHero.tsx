import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Calendar,
  Briefcase,
  ExternalLink,
  Share2,
  Download,
  RotateCw,
  GitCompare,
  Check,
  Star,
  BookOpen,
  GitCommitHorizontal,
  Sparkles,
  Trophy,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { GitHubUser, UserSummaryData } from '../types/github';
import { calculateGitPulseScore, useCountUpFromZero } from '../services/gitpulseScore';

interface ProfileHeroProps {
  user: GitHubUser;
  summary: UserSummaryData;
  totalStars: number;
  totalForks: number;
  primaryLanguage?: string;
  sourceReposCount?: number;
  onRefresh: () => void;
  onOpenCompare: () => void;
  onOpenExportCard: () => void;
  onOpenLeaderboard?: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  user,
  summary,
  totalStars,
  primaryLanguage = 'TypeScript',
  onRefresh,
  onOpenCompare,
  onOpenExportCard,
  onOpenLeaderboard,
}) => {
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const joinedDate = new Date(user.created_at);
  const joinedYear = joinedDate.getFullYear();
  const joinedMonth = joinedDate.toLocaleString('default', { month: 'short' });
  const yearsOnGithub = Math.max(1, new Date().getFullYear() - joinedYear);

  const gpResult = calculateGitPulseScore(summary);
  const animatedScore = useCountUpFromZero(gpResult.totalScore, 1500, user.login);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 sm:mt-5">
      <div className="apple-card p-4 sm:p-8 relative overflow-hidden">
        {/* Subtle macOS Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2997ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          {/* User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
            {/* Avatar with macOS squircle/glow */}
            <div className="flex items-center gap-4 sm:block">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#2997ff] to-purple-500 opacity-60 blur-xs group-hover:opacity-100 transition duration-300 pointer-events-none" />
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-2 border-[#161b22] object-cover shadow-lg"
                />
                {user.hireable && (
                  <span
                    title="Available for hire"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#27c93f] border-2 border-[#161b22] flex items-center justify-center text-white text-[10px] shadow-sm font-bold"
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* Mobile-only name display next to avatar */}
              <div className="sm:hidden min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] truncate">
                  {user.name || user.login}
                </h1>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#2997ff] hover:underline flex items-center gap-1 truncate"
                >
                  @{user.login}
                  <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
                </a>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-1"
                  style={{
                    backgroundColor: `${gpResult.rankBadgeColor}18`,
                    color: gpResult.rankBadgeColor,
                    borderColor: `${gpResult.rankBadgeColor}40`,
                  }}
                >
                  <Zap className="w-2.5 h-2.5" /> {gpResult.rankTitle}
                </span>
              </div>
            </div>

            {/* Names & Bio (Desktop / Tablet) */}
            <div className="w-full">
              <div className="hidden sm:flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  {user.name || user.login}
                </h1>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-mono text-[#2997ff] hover:underline flex items-center gap-1"
                >
                  @{user.login}
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: `${gpResult.rankBadgeColor}18`,
                    color: gpResult.rankBadgeColor,
                    borderColor: `${gpResult.rankBadgeColor}40`,
                  }}
                >
                  <Zap className="w-3 h-3" /> {gpResult.rankTitle}
                </span>

                {user.hireable && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#27c93f]/15 text-[#27c93f] border border-[#27c93f]/30">
                    <Briefcase className="w-3 h-3" /> Hireable
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed whitespace-pre-line">
                  {user.bio}
                </p>
              )}

              {/* Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-[#8b949e]">
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                    <span className="truncate max-w-[200px]">{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{user.company}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] hover:underline truncate max-w-[180px]"
                    >
                      {user.blog.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Joined {joinedMonth} {joinedYear} ({yearsOnGithub}y)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Apple Thumb Pill Buttons) */}
          <div className="w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/8">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-col gap-2 sm:gap-2.5">
              <button
                onClick={onOpenCompare}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#2997ff] to-indigo-600 hover:from-[#3ea3ff] hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer min-h-[44px]"
              >
                <GitCompare className="w-4 h-4" />
                <span>⚔️ Versus Battle</span>
              </button>

              <button
                onClick={onOpenExportCard}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 border border-white/10 text-[var(--text-primary)] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Download className="w-4 h-4 text-[#2997ff]" />
                <span className="truncate">Export Card</span>
              </button>

              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer min-h-[44px]"
                  title="View Global Leaderboards"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rankings</span>
                </button>
              )}

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all cursor-pointer min-h-[44px]"
                  title="Copy share link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onRefresh}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all active:scale-95 cursor-pointer"
                  title="Refresh from GitHub API"
                  aria-label="Refresh Profile"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GitPulse Score Banner */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-surface)] to-[var(--bg-secondary)] border border-[var(--border-subtle)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2997ff] to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2997ff]">
                    GitPulse Score
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[var(--text-primary)]">
                    {animatedScore.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#2997ff]">GP</span>
                  <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
                    • Based on Commits, Stars, Forks, Followers & Repositories
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all cursor-pointer self-start sm:self-center"
            >
              <span>Score Weightings</span>
              {showBreakdown ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#2997ff]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#2997ff]" />
              )}
            </button>
          </div>

          {/* Multi-Segment Composition Bar */}
          <div className="mt-3.5 h-2 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden flex gap-0.5 p-0.5 border border-[var(--border-subtle)]">
            {gpResult.breakdown.map((item) => {
              const pct = Math.max(4, (item.points / Math.max(1, gpResult.totalScore)) * 100);
              return (
                <div
                  key={item.id}
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"
                  title={`${item.label}: +${item.points.toLocaleString()} GP`}
                />
              );
            })}
          </div>

          {/* Expandable Weighting Breakdown */}
          {showBreakdown && (
            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 battle-round-slide-down">
              {gpResult.breakdown.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                        {item.label}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 truncate">
                      {item.rawDisplay}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                    <span className="text-sm font-bold font-mono" style={{ color: item.color }}>
                      +{item.points.toLocaleString()} GP
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-tertiary)]">
                      {item.weightLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* macOS Control Center Ribbon - Key GitHub Impact Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-3 rounded-2xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] text-center">
            <span className="text-[11px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <GitCommitHorizontal className="w-3.5 h-3.5 text-emerald-400" /> Total Commits
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              {gpResult.metrics.totalCommits.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] text-center">
            <span className="text-[11px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3 text-[#2997ff]" /> Public Repos
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
              {user.public_repos.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] text-center">
            <span className="text-[11px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3 text-purple-400" /> Years Active
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-purple-400 mt-1">
              {yearsOnGithub}y+ Active
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] text-center">
            <span className="text-[11px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              {totalStars > 0 ? (
                <>
                  <Star className="w-3 h-3 text-amber-400" /> Total Stars
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-amber-400" /> Primary Stack
                </>
              )}
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
              {totalStars > 0 ? `★ ${totalStars.toLocaleString()}` : primaryLanguage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
