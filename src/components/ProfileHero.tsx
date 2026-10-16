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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <div className="apple-card p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle macOS Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2997ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with macOS squircle/glow */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#2997ff] to-purple-500 opacity-60 blur-xs group-hover:opacity-100 transition duration-300" />
              <img
                src={user.avatar_url}
                alt={user.login}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-[#161b22] object-cover shadow-lg"
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
                  className="text-xs sm:text-sm font-mono text-[#2997ff] hover:underline flex items-center gap-1"
                >
                  @{user.login}
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>

                {user.hireable && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#27c93f]/15 text-[#27c93f] border border-[#27c93f]/30">
                    <Briefcase className="w-3 h-3" /> Hireable
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed whitespace-pre-line">
                  {user.bio}
                </p>
              )}

              {/* Badges */}
              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#8b949e]">
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2997ff]" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] hover:underline"
                    >
                      {user.blog.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Joined {joinedMonth} {joinedYear} ({yearsOnGithub}y)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Apple Pill Buttons) */}
          <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
            <button
              onClick={onOpenExportCard}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#2997ff] to-[#0071e3] hover:from-[#3ea3ff] hover:to-[#0077ed] text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Card (PNG)</span>
            </button>

            <button
              onClick={onOpenCompare}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-[var(--text-primary)] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              <GitCompare className="w-4 h-4 text-[#2997ff]" />
              <span>Compare User</span>
            </button>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all"
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
                className="p-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all active:scale-95"
                title="Refresh from GitHub API"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* macOS Control Center Ribbon */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-center">
            <span className="text-[11px] text-[#8b949e] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <Star className="w-3 h-3 text-amber-400" /> Total Stars
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
              ★ {totalStars.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-center">
            <span className="text-[11px] text-[#8b949e] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <GitFork className="w-3 h-3 text-emerald-400" /> Total Forks
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              🍴 {totalForks.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-center">
            <span className="text-[11px] text-[#8b949e] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3 text-[#2997ff]" /> Public Repos
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
              {user.public_repos.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-center">
            <span className="text-[11px] text-[#8b949e] uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-pink-400" /> Followers
            </span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
              {user.followers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
