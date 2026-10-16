import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Star, GitFork, BookOpen } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { UserSummaryData } from '../types/github';

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

  const { user, totalStars, totalForks, languageStats } = summary;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Retina high resolution
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 sm:p-8 max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Export Profile Summary Card
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Share your stats card or embed it into your GitHub Profile README
            </p>
          </div>
        </div>

        {/* The Visual Card to Export */}
        <div className="mt-6 flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0f172a] border-2 border-blue-500/30 p-6 shadow-2xl text-white relative overflow-hidden"
          >
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={user.login}
                crossOrigin="anonymous"
                className="w-16 h-16 rounded-full border-2 border-blue-400/50 shadow-md object-cover"
              />
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white truncate">
                    {user.name || user.login}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-xs font-mono text-blue-400">@{user.login}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">
                  {user.bio || 'GitHub Contributor & Open Source Developer'}
                </p>
              </div>
            </div>

            {/* Quick KPI stats in Card */}
            <div className="relative mt-5 pt-4 border-t border-gray-800 grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" /> Stars
                </span>
                <span className="text-sm font-bold font-mono text-amber-300 mt-0.5 block">
                  ★ {totalStars.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <GitFork className="w-3 h-3 text-emerald-400" /> Forks
                </span>
                <span className="text-sm font-bold font-mono text-emerald-300 mt-0.5 block">
                  🍴 {totalForks.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-gray-900/60 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-400" /> Repos
                </span>
                <span className="text-sm font-bold font-mono text-blue-300 mt-0.5 block">
                  {user.public_repos.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Top Languages breakdown in Card */}
            <div className="relative mt-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Top Languages
              </span>
              <div className="space-y-1.5">
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
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
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
            <div className="relative mt-5 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>GitPulse Analytics</span>
              <span>bradleyjoejoseph.github.io</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PNG...' : 'Download High-Res PNG'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
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
