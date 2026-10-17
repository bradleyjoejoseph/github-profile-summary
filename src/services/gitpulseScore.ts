import { useState, useEffect } from 'react';
import type { UserSummaryData } from '../types/github';

export interface GitPulseBreakdownItem {
  id: string;
  label: string;
  points: number;
  weightLabel: string;
  rawDisplay: string;
  color: string;
}

export interface GitPulseScoreResult {
  totalScore: number;
  rankTitle: string;
  rankBadgeColor: string;
  breakdown: GitPulseBreakdownItem[];
  metrics: {
    yearsActive: number;
    originalityPct: number;
    languagesCount: number;
    totalCodeMb: number;
    publicRepos: number;
    sourceRepos: number;
    totalStars: number;
    activeEventsCount: number;
  };
}

/**
 * Computes the GitPulse Score (GP) from 0 upwards
 * using weighted engineering metrics calibrated around real repository output.
 */
export function calculateGitPulseScore(summary: UserSummaryData): GitPulseScoreResult {
  const { user, repos, totalStars, languageStats, sourceReposCount, dayActivity } = summary;

  // 1. Original Code & Sources (4 GP per original source repo)
  const totalRepoCount = Math.max(1, repos.length || user.public_repos || 1);
  const actualSources = sourceReposCount ?? repos.filter((r) => !r.fork).length;
  const originalityPct =
    repos.length > 0 ? Math.round((actualSources / totalRepoCount) * 100) : 100;
  const originalityPoints = actualSources * 4;

  // 2. Veteran Tenure (4 GP per year active on GitHub)
  const yearsActive = Math.max(
    1,
    new Date().getFullYear() - new Date(user.created_at).getFullYear()
  );
  const tenurePoints = yearsActive * 4;

  // 3. Polyglot Tech Stack Breadth (6 GP per language mastered)
  const languagesCount = Math.max(1, languageStats.length);
  const polyglotPoints = languagesCount * 6;

  // 4. Codebase Scale & Volume (1 GP per public repo + 1 GP per 40 MB of code)
  const totalSizeKb = repos.reduce((acc, repo) => acc + (repo.size || 0), 0);
  const totalCodeMb = Number((totalSizeKb / 1024).toFixed(1));
  const codebasePoints = user.public_repos + Math.round(totalCodeMb / 40);

  // 5. Activity & Community Impact (1 GP per 23 recent events + scaled star bonus)
  const activeEventsCount = dayActivity.reduce((acc, d) => acc + d.events, 0);
  const starPoints =
    Math.round(activeEventsCount / 23) + Math.round(Math.sqrt(totalStars) * 1.5);

  const totalScore =
    originalityPoints +
    tenurePoints +
    polyglotPoints +
    codebasePoints +
    starPoints;

  let rankTitle = 'Rising Builder';
  let rankBadgeColor = '#38bdf8';

  if (totalScore >= 500) {
    rankTitle = 'Open Source Titan';
    rankBadgeColor = '#f43f5e';
  } else if (totalScore >= 250) {
    rankTitle = 'Principal Architect';
    rankBadgeColor = '#a855f7';
  } else if (totalScore >= 160) {
    rankTitle = 'Systems Vanguard';
    rankBadgeColor = '#f59e0b';
  } else if (totalScore >= 110) {
    rankTitle = 'Full-Stack Engineer';
    rankBadgeColor = '#2997ff';
  } else if (totalScore >= 60) {
    rankTitle = 'Code Craftsman';
    rankBadgeColor = '#10b981';
  }

  const breakdown: GitPulseBreakdownItem[] = [
    {
      id: 'originality',
      label: 'Original Sources',
      points: originalityPoints,
      weightLabel: '4 GP × Source Repos',
      rawDisplay: `${actualSources} original repos (${originalityPct}%)`,
      color: '#10b981',
    },
    {
      id: 'tenure',
      label: 'GitHub Tenure',
      points: tenurePoints,
      weightLabel: '4 GP × Years Active',
      rawDisplay: `${yearsActive}y active on GitHub`,
      color: '#a855f7',
    },
    {
      id: 'polyglot',
      label: 'Polyglot Stack',
      points: polyglotPoints,
      weightLabel: '6 GP × Languages',
      rawDisplay: `${languagesCount} Languages`,
      color: '#2997ff',
    },
    {
      id: 'codebase',
      label: 'Codebase Scale',
      points: codebasePoints,
      weightLabel: '1 GP/repo + 1 GP/40MB',
      rawDisplay: `${user.public_repos} repos (${totalCodeMb} MB)`,
      color: '#38bdf8',
    },
    {
      id: 'impact',
      label: 'Activity & Stars',
      points: starPoints,
      weightLabel: 'Events + Star Impact',
      rawDisplay:
        totalStars > 0
          ? `★ ${totalStars.toLocaleString()} • ${activeEventsCount} events`
          : `${activeEventsCount} active events`,
      color: '#f59e0b',
    },
  ];

  return {
    totalScore,
    rankTitle,
    rankBadgeColor,
    breakdown,
    metrics: {
      yearsActive,
      originalityPct,
      languagesCount,
      totalCodeMb,
      publicRepos: user.public_repos,
      sourceRepos: actualSources,
      totalStars,
      activeEventsCount,
    },
  };
}

/**
 * Hook that animates a numeric score starting from 0 and building up to targetValue.
 * Respects prefers-reduced-motion.
 */
export function useCountUpFromZero(
  targetValue: number,
  durationMs = 1200,
  triggerKey?: string | number
): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCurrent(targetValue);
      return;
    }

    setCurrent(0);
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * targetValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, durationMs, triggerKey]);

  return current;
}
