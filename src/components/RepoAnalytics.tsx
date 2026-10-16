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
      <div className="apple-card p-6 text-center text-[#8b949e]">
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
    <div className="apple-card p-6 flex flex-col justify-between">
      {/* Widget Header with Apple Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Repository Impact Ranking
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Top projects ranked by community popularity
          </p>
        </div>

        {/* Apple Segmented Toggle */}
        <div className="apple-segmented-track">
          <button
            onClick={() => setMetric('stars')}
            className={`apple-segmented-item flex items-center gap-1.5 ${metric === 'stars' ? 'active' : ''}`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            <span>Stars</span>
          </button>
          <button
            onClick={() => setMetric('forks')}
            className={`apple-segmented-item flex items-center gap-1.5 ${metric === 'forks' ? 'active' : ''}`}
          >
            <GitFork className="w-3 h-3 text-emerald-400" />
            <span>Forks</span>
          </button>
        </div>
      </div>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
            <XAxis
              dataKey="name"
              stroke="#8b949e"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="#8b949e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="apple-glass-dock p-3 rounded-xl shadow-xl text-xs max-w-xs">
                      <div className="font-bold text-white truncate">
                        {item.fullName}
                      </div>
                      {item.description && (
                        <p className="mt-1 text-[#8b949e] text-[11px] line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[#8b949e]">{item.language}</span>
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
