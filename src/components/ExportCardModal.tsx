import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Star, Calendar, BookOpen, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { UserSummaryData } from '../types/github';
import { calculateGitPulseScore } from '../services/gitpulseScore';

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: UserSummaryData;
}

export const ExportCardModal: React.FC<ExportCardModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (!isOpen) return null;

  const { user, totalStars, languageStats } = summary;
  const gp = calculateGitPulseScore(summary);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High-DPI Retina resolution
      });
      const link = document.createElement('a');
      link.download = `${user.login}-profile-summary.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = `[![${user.login}'s GitHub Summary](https://bradleyjoejoseph.github.io/github-profile-summary/)](https://github.com/${user.login})`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#161b22]/95 border border-white/10 shadow-2xl p-6 sm:p-7 max-h-[90dvh] overflow-y-auto">
        {/* macOS Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8b949e] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-[#2997ff] border border-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Export Profile Summary Card
            </h2>
            <p className="text-xs text-[#8b949e]">
              Share your stats card or embed it into your GitHub Profile README
            </p>
          </div>
        </div>

        {/* The Visual Card to Export */}
        <div className="mt-6 flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-md rounded-3xl bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0a0f1d] border border-white/15 p-6 shadow-2xl text-white relative overflow-hidden"
          >
            {/* macOS Ambient Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#2997ff]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header Branding */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${gp.rankBadgeColor}20`,
                  color: gp.rankBadgeColor,
                  borderColor: `${gp.rankBadgeColor}40`,
                }}
              >
                {gp.rankTitle}
              </span>
              <span className="text-[10px] font-mono text-[#2997ff] font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                {gp.totalScore.toLocaleString()} GP
              </span>
            </div>

            {/* Card Header */}
            <div className="relative flex items-center gap-3.5">
              <img
                src={user.avatar_url}
                alt={user.login}
                crossOrigin="anonymous"
                className="w-14 h-14 rounded-2xl border border-white/20 shadow-md object-cover"
              />
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white truncate">
                    {user.name || user.login}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-[#2997ff] font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-xs font-mono text-[#2997ff]">@{user.login}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">
                  {user.bio || 'GitHub Contributor & Open Source Developer'}
                </p>
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="relative mt-4 pt-3.5 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#2997ff]" /> Repos
                </span>
                <span className="text-xs font-bold font-mono text-blue-300 mt-0.5 block">
                  {user.public_repos.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-400" /> Tenure
                </span>
                <span className="text-xs font-bold font-mono text-purple-300 mt-0.5 block">
                  {Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear())}y+ Active
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" /> {totalStars > 0 ? 'Stars' : 'Stack'}
                </span>
                <span className="text-xs font-bold font-mono text-amber-300 mt-0.5 block truncate">
                  {totalStars > 0 ? `★ ${totalStars.toLocaleString()}` : (summary.primaryLanguage || 'Code')}
                </span>
              </div>
            </div>

            {/* Top Languages breakdown */}
            <div className="relative mt-3.5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Top Languages
              </span>
              <div className="space-y-1">
                {languageStats.slice(0, 3).map((l) => (
                  <div key={l.name} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-gray-200 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: l.color }}
                        />
                        {l.name}
                      </span>
                      <span className="font-mono text-gray-400">{l.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(5, l.percentage)}%`,
                          backgroundColor: l.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watermark Footer */}
            <div className="relative mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>Verified Analytics</span>
              <span>bradleyjoejoseph.github.io</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#2997ff] to-[#0071e3] hover:from-[#3ea3ff] hover:to-[#0077ed] text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PNG...' : 'Download Retina PNG'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-white/5 border border-white/10 text-[var(--text-primary)] hover:border-white/20 transition-all active:scale-95"
          >
            {copiedMarkdown ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy README Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
