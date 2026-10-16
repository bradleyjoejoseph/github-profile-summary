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

  // Calculate Developer Tier based on stars and followers
  const getDeveloperTier = () => {
    if (totalStars > 10000 || user.followers > 10000)
      return { title: 'Legendary Contributor', color: 'text-purple-400', bg: 'bg-purple-500/10' };
    if (totalStars > 1000 || user.followers > 1000)
      return { title: 'High Impact Author', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (totalStars > 100 || user.followers > 100)
      return { title: 'Pro Open Sourcer', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    return { title: 'Active Builder', color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
  };

  const tier = getDeveloperTier();
  const langColor = getLanguageColor(primaryLanguage);

  const cards = [
    {
      title: 'Total Stars Earned',
      value: totalStars.toLocaleString(),
      subtitle: `${summary.topStarredRepos[0]?.name ? `Top: ${summary.topStarredRepos[0].name}` : 'Across all repositories'}`,
      icon: Star,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'Total Repositories',
      value: user.public_repos.toLocaleString(),
      subtitle: `${sourceReposCount} sources • ${forkedReposCount} forks`,
      icon: BookOpen,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-400/10 border-blue-400/20',
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
          className="inline-block w-3 h-3 rounded-full mr-1.5"
          style={{ backgroundColor: langColor }}
        />
      ),
    },
    {
      title: 'Community Influence',
      value: `${user.followers.toLocaleString()} fans`,
      subtitle: `Following ${user.following.toLocaleString()} developers`,
      icon: Users,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-400/10 border-pink-400/20',
    },
    {
      title: 'Creator Standing',
      value: tier.title,
      subtitle: `${user.public_gists} public gists shared`,
      icon: Award,
      iconColor: tier.color,
      iconBg: `${tier.bg} border-current/20`,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 hover:border-[var(--accent)]/50 transition-all hover:shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {card.title}
                  </span>
                  <div className="flex items-center mt-2">
                    {card.customBadge}
                    <span className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
                      {card.value}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {card.subtitle}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl border ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
