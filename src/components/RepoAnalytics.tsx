import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Star, GitFork, BarChart3 } from 'lucide-react';
import type { GitHubRepo } from '../types/github';
import { getLanguageColor } from '../services/languageColors';

interface RepoAnalyticsProps {
  topStarredRepos: GitHubRepo[];
  topForkedRepos: GitHubRepo[];
}

export const RepoAnalytics: React.FC<RepoAnalyticsProps> = ({
  topStarredRepos,
  topForkedRepos,
}) => {
  const [metric, setMetric] = useState<'stars' | 'forks'>('stars');

  const rawRepos = metric === 'stars' ? topStarredRepos : topForkedRepos;

  if (rawRepos.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 text-center text-[var(--text-secondary)]">
        No repository metrics available.
      </div>
    );
  }

  const chartData = rawRepos.slice(0, 8).map((repo) => ({
    name: repo.name.length > 14 ? `${repo.name.slice(0, 12)}...` : repo.name,
    fullName: repo.full_name,
    value: metric === 'stars' ? repo.stargazers_count : repo.forks_count,
    language: repo.language || 'Unknown',
    color: getLanguageColor(repo.language),
    url: repo.html_url,
    description: repo.description,
  }));

  return (
    <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Repository Impact Ranking
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Top projects ranked by community popularity
          </p>
        </div>

        {/* Metric Switch */}
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 text-xs">
          <button
            onClick={() => setMetric('stars')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              metric === 'stars'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Stars per Repo</span>
          </button>
          <button
            onClick={() => setMetric('forks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              metric === 'forks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-emerald-400" />
            <span>Forks per Repo</span>
          </button>
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <XAxis
              dataKey="name"
              stroke="var(--text-secondary)"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[var(--chart-tooltip-bg)] border border-[var(--border-color)] p-3 rounded-xl shadow-xl text-xs max-w-xs">
                      <div className="font-bold text-[var(--chart-tooltip-text)] truncate">
                        {item.fullName}
                      </div>
                      {item.description && (
                        <p className="mt-1 text-[var(--text-secondary)] text-[11px] line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[var(--text-secondary)]">{item.language}</span>
                        </span>
                        <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                          {metric === 'stars' ? `★ ${item.value}` : `🍴 ${item.value}`}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={entry.color}
                  className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => window.open(entry.url, '_blank')}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
