import React from 'react';
import { Star, BookOpen, Code2, Layers, Calendar, GitCommitHorizontal } from 'lucide-react';
import type { UserSummaryData } from '../types/github';
import { getLanguageColor } from '../services/languageColors';
import { calculateGitPulseScore } from '../services/gitpulseScore';

interface MetricCardsProps {
  summary: UserSummaryData;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const {
    totalStars,
    totalForks,
    primaryLanguage,
    user,
    languageStats,
  } = summary;

  const gp = calculateGitPulseScore(summary);
  const langColor = getLanguageColor(primaryLanguage);
  const topLanguages = languageStats.slice(0, 3).map((l) => l.name).join(', ') || primaryLanguage;

  const cards = [
    {
      title: 'Total Commits',
      value: gp.metrics.totalCommits.toLocaleString(),
      subtitle: 'Lifetime code commits & contributions',
      icon: GitCommitHorizontal,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      title: 'Public Repositories',
      value: user.public_repos.toLocaleString(),
      subtitle: 'Open-source projects & packages published',
      icon: BookOpen,
      iconColor: 'text-[#2997ff]',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Total Stars',
      value: `★ ${totalStars.toLocaleString()}`,
      subtitle:
        totalForks > 0
          ? `${totalForks.toLocaleString()} repository forks worldwide`
          : summary.topStarredRepos[0]?.name
          ? `Featured: ${summary.topStarredRepos[0].name}`
          : 'Open-source community impact',
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'Primary Language',
      value: primaryLanguage,
      subtitle: `${summary.languageStats[0]?.percentage || 0}% of active repositories`,
      icon: Code2,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-400/10 border-indigo-400/20',
      customBadge: (
        <span
          className="inline-block w-3 h-3 rounded-full mr-2 shrink-0 shadow-xs"
          style={{ backgroundColor: langColor }}
        />
      ),
    },
    {
      title: 'Languages Used',
      value: `${languageStats.length} Languages`,
      subtitle: topLanguages ? `Core stack: ${topLanguages}` : 'Multi-language engineering',
      icon: Layers,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'GitHub Experience',
      value: `${gp.metrics.yearsActive}+ Years`,
      subtitle: `Active on GitHub since ${new Date(user.created_at).getFullYear()}`,
      icon: Calendar,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
          Core GitHub Statistics
        </span>
        <span className="text-[10px] font-mono text-[#6e7681]">
          Verified Activity & Impact
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="apple-card p-3 sm:p-5 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8b949e] block truncate">
                    {card.title}
                  </span>
                  <div className="flex items-center mt-1 sm:mt-2 min-w-0">
                    {card.customBadge}
                    <span className="text-base sm:text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)] truncate">
                      {card.value}
                    </span>
                  </div>
                </div>

                {/* Apple squircle capsule for icon */}
                <div
                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor} group-hover:scale-105 transition-transform shadow-xs`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-[#8b949e] font-mono truncate">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
