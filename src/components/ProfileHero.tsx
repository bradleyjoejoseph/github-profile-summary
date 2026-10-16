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
  GitFork,
  BookOpen,
  Users,
} from 'lucide-react';
import type { GitHubUser } from '../types/github';

interface ProfileHeroProps {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
  onRefresh: () => void;
  onOpenCompare: () => void;
  onOpenExportCard: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  user,
  totalStars,
  totalForks,
  onRefresh,
  onOpenCompare,
  onOpenExportCard,
}) => {
  const [copied, setCopied] = useState(false);

  // Format joined date
  const joinedDate = new Date(user.created_at);
  const joinedYear = joinedDate.getFullYear();
  const joinedMonth = joinedDate.toLocaleString('default', { month: 'short' });
  const yearsOnGithub = Math.max(1, new Date().getFullYear() - joinedYear);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl p-6 sm:p-8 transition-colors">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
              <img
                src={user.avatar_url}
                alt={user.login}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[var(--bg-secondary)] object-cover shadow-md"
              />
              {user.hireable && (
                <span
                  title="Available for hire"
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--bg-secondary)] flex items-center justify-center text-white text-[10px] shadow-sm font-bold"
                >
                  ✓
                </span>
              )}
            </div>

            {/* Names & Bio */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  {user.name || user.login}
                </h1>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  @{user.login}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {user.hireable && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Briefcase className="w-3 h-3" /> Hireable
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed whitespace-pre-line">
                  {user.bio}
                </p>
              )}

              {/* Metadata Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-purple-400" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-emerald-400" />
                    <a
                      href={
                        user.blog.startsWith('http')
                          ? user.blog
                          : `https://${user.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] hover:underline"
                    >
                      {user.blog.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>
                    Joined {joinedMonth} {joinedYear} ({yearsOnGithub}y)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border-color)]">
            <button
              onClick={onOpenExportCard}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Card (PNG)</span>
            </button>

            <button
              onClick={onOpenCompare}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--bg-primary)] transition-all active:scale-95"
            >
              <GitCompare className="w-4 h-4 text-indigo-400" />
              <span>Compare User</span>
            </button>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)] transition-all"
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
                className="p-2 rounded-xl text-xs font-medium bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
                title="Bypass cache & refresh from GitHub API"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Follower stats bar inside Hero */}
        <div className="mt-6 pt-5 border-t border-[var(--border-color)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]/60">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Total Stars
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-0.5">
              ★ {totalStars.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]/60">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-emerald-400" /> Total Forks
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              🍴 {totalForks.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]/60">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Public Repos
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-0.5">
              {user.public_repos.toLocaleString()}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]/60">
            <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-pink-400" /> Followers
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-0.5">
              {user.followers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
