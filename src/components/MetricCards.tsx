import React from 'react';
import { Star, BookOpen, Code2, Layers, Cpu, ShieldCheck } from 'lucide-react';
import type { UserSummaryData } from '../types/github';
import { getLanguageColor } from '../services/languageColors';

interface MetricCardsProps {
  summary: UserSummaryData;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const {
    totalStars,
    sourceReposCount,
    primaryLanguage,
    user,
    languageStats,
  } = summary;

  const langColor = getLanguageColor(primaryLanguage);

  // Top technologies mastered
  const topLanguages = languageStats.slice(0, 3).map((l) => l.name).join(', ') || primaryLanguage;
  const originalRatio = Math.round((sourceReposCount / Math.max(1, user.public_repos)) * 100);

  const cards = [
    {
      title: 'Total Codebases',
      value: user.public_repos.toLocaleString(),
      subtitle: `${sourceReposCount} original source repositories`,
      icon: BookOpen,
      iconColor: 'text-[#2997ff]',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Originality Ratio',
      value: `${originalRatio}% Original`,
      subtitle: 'Custom-built software from scratch',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      title: 'Primary Language',
      value: primaryLanguage,
      subtitle: `${summary.languageStats[0]?.percentage || 0}% of all projects`,
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
      title: 'Tech Stack Breadth',
      value: `${languageStats.length} Languages`,
      subtitle: topLanguages ? `Proficient in: ${topLanguages}` : 'Multi-language engineering',
      icon: Layers,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Community Impact',
      value: totalStars > 0 ? `★ ${totalStars.toLocaleString()}` : `${user.public_repos} Projects`,
      subtitle: summary.topStarredRepos[0]?.name
        ? `Featured: ${summary.topStarredRepos[0].name}`
        : 'Open-source software published',
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'Specialization',
      value: 'SaaS & AI Engineer',
      subtitle: 'Full-stack software and intelligent systems',
      icon: Cpu,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
          Engineering Highlights
        </span>
        <span className="text-[10px] font-mono text-[#6e7681]">
          Control Center Widgets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="apple-card p-5 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
                    {card.title}
                  </span>
                  <div className="flex items-center mt-2">
                    {card.customBadge}
                    <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
                      {card.value}
                    </span>
                  </div>
                </div>

                {/* Apple squircle capsule for icon */}
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor} group-hover:scale-105 transition-transform shadow-xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <p className="mt-3 text-xs text-[#8b949e] font-mono truncate">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
