import React from 'react';
import { Star, GitFork, BookOpen, Code2, Users, Award } from 'lucide-react';
import type { UserSummaryData } from '../types/github';
import { getLanguageColor } from '../services/languageColors';

interface MetricCardsProps {
  summary: UserSummaryData;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const {
    totalStars,
    totalForks,
    sourceReposCount,
    forkedReposCount,
    primaryLanguage,
    user,
  } = summary;

  const getDeveloperTier = () => {
    if (totalStars > 10000 || user.followers > 10000)
      return { title: 'Legendary Contributor', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
    if (totalStars > 1000 || user.followers > 1000)
      return { title: 'High Impact Author', color: 'text-[#2997ff]', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (totalStars > 100 || user.followers > 100)
      return { title: 'Pro Open Sourcer', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    return { title: 'Active Builder', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
  };

  const tier = getDeveloperTier();
  const langColor = getLanguageColor(primaryLanguage);

  const cards = [
    {
      title: 'Total Stars',
      value: totalStars.toLocaleString(),
      subtitle: `${summary.topStarredRepos[0]?.name ? `Top: ${summary.topStarredRepos[0].name}` : 'Across all public repos'}`,
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'Repositories',
      value: user.public_repos.toLocaleString(),
      subtitle: `${sourceReposCount} sources • ${forkedReposCount} forks`,
      icon: BookOpen,
      iconColor: 'text-[#2997ff]',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Community Forks',
      value: totalForks.toLocaleString(),
      subtitle: 'Code remixed by developers',
      icon: GitFork,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      title: 'Primary Language',
      value: primaryLanguage,
      subtitle: `${summary.languageStats[0]?.percentage || 0}% of repositories`,
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
      title: 'Community Reach',
      value: `${user.followers.toLocaleString()} fans`,
      subtitle: `Following ${user.following.toLocaleString()} developers`,
      icon: Users,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-400/10 border-pink-400/20',
    },
    {
      title: 'Developer Tier',
      value: tier.title,
      subtitle: `${user.public_gists} public gists shared`,
      icon: Award,
      iconColor: tier.color,
      iconBg: tier.bg,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
          Overview Metrics
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
                    <span className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
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

              <p className="mt-3 text-xs text-[#8b949e] font-mono">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
