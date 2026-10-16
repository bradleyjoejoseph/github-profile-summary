import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Code, Star } from 'lucide-react';
import type { LanguageStat } from '../types/github';

interface LanguageBreakdownProps {
  languageStats: LanguageStat[];
}

export const LanguageBreakdown: React.FC<LanguageBreakdownProps> = ({
  languageStats,
}) => {
  const [activeTab, setActiveTab] = useState<'repos' | 'stars'>('repos');

  if (languageStats.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 text-center text-[var(--text-secondary)]">
        No language statistics available for this profile.
      </div>
    );
  }

  // Prep data for Repos pie
  const reposData = languageStats.slice(0, 8).map((l) => ({
    name: l.name,
    value: l.count,
    color: l.color,
    percentage: l.percentage,
  }));

  // Prep data for Stars pie
  const totalStarsInLangs = languageStats.reduce((acc, curr) => acc + curr.stars, 0);
  const starsData = languageStats
    .filter((l) => l.stars > 0)
    .slice(0, 8)
    .map((l) => ({
      name: l.name,
      value: l.stars,
      color: l.color,
      percentage:
        totalStarsInLangs > 0 ? Math.round((l.stars / totalStarsInLangs) * 100) : 0,
    }));

  const activeData = activeTab === 'repos' ? reposData : (starsData.length > 0 ? starsData : reposData);

  return (
    <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Language Distribution
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Breakdown across all public repositories
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'repos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            By Repositories
          </button>
          <button
            onClick={() => setActiveTab('stars')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'stars'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            <span>By Stars Earned</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="lg:col-span-6 h-64 sm:h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="var(--bg-secondary)"
                strokeWidth={3}
              >
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[var(--chart-tooltip-bg)] border border-[var(--border-color)] px-3 py-2 rounded-xl shadow-xl text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <span className="font-semibold text-[var(--chart-tooltip-text)]">
                            {data.name}
                          </span>
                        </div>
                        <div className="mt-1 text-[var(--text-secondary)] font-mono">
                          {activeTab === 'repos'
                            ? `${data.value} repos (${data.percentage}%)`
                            : `${data.value} stars (${data.percentage}%)`}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Progress Bars */}
        <div className="lg:col-span-6 space-y-3">
          {languageStats.slice(0, 6).map((lang) => (
            <div key={lang.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-[var(--text-primary)] font-semibold">
                    {lang.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[var(--text-secondary)]">
                  <span>{lang.count} {lang.count === 1 ? 'repo' : 'repos'}</span>
                  {lang.stars > 0 && (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      ★ {lang.stars}
                    </span>
                  )}
                  <span className="w-10 text-right font-bold text-[var(--text-primary)]">
                    {lang.percentage}%
                  </span>
                </div>
              </div>
              {/* Custom Bar */}
              <div className="h-2 w-full bg-[var(--bg-card)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(4, lang.percentage)}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
