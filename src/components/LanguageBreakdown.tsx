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
      <div className="apple-card p-6 text-center text-[#8b949e]">
        No language statistics available for this profile.
      </div>
    );
  }

  // Repos data
  const reposData = languageStats.slice(0, 8).map((l) => ({
    name: l.name,
    value: l.count,
    color: l.color,
    percentage: l.percentage,
  }));

  // Stars data
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
    <div className="apple-card p-6 flex flex-col justify-between">
      {/* Widget Header with Apple Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Code className="w-4 h-4 text-[#2997ff]" />
            Language Distribution
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Breakdown across all public repositories
          </p>
        </div>

        {/* Apple Segmented Toggle */}
        <div className="apple-segmented-track">
          <button
            onClick={() => setActiveTab('repos')}
            className={`apple-segmented-item ${activeTab === 'repos' ? 'active' : ''}`}
          >
            By Repositories
          </button>
          <button
            onClick={() => setActiveTab('stars')}
            className={`apple-segmented-item flex items-center gap-1 ${activeTab === 'stars' ? 'active' : ''}`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            <span>By Stars</span>
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="lg:col-span-6 h-60 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="#161b22"
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
                      <div className="apple-glass-dock px-3 py-2 rounded-xl shadow-xl text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <span className="font-semibold text-white">
                            {data.name}
                          </span>
                        </div>
                        <div className="mt-1 text-[#8b949e] font-mono">
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
        <div className="lg:col-span-6 space-y-2.5">
          {languageStats.slice(0, 6).map((lang) => (
            <div key={lang.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-[var(--text-primary)] font-medium">
                    {lang.name}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 font-mono text-[11px] text-[#8b949e]">
                  <span>{lang.count} {lang.count === 1 ? 'repo' : 'repos'}</span>
                  {lang.stars > 0 && (
                    <span className="text-amber-400">★ {lang.stars}</span>
                  )}
                  <span className="w-8 text-right font-bold text-[var(--text-primary)]">
                    {lang.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar with Apple continuous pill */}
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
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
