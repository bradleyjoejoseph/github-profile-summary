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
  totalScore: number; // Uncapped endless score starting at 0 and building up
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
 * Computes the endless GitPulse Ranking Score (GP) from 0 upwards
 * using transparent, weighted engineering metrics.
 */
export function calculateGitPulseScore(summary: UserSummaryData): GitPulseScoreResult {
  const { user, repos, totalStars, languageStats, sourceReposCount, dayActivity } = summary;

  // 1. Veteran Tenure (Years & fractional months active on GitHub)
  const createdTime = new Date(user.created_at).getTime();
  const nowTime = Date.now();
  const exactYears = Math.max(0.5, (nowTime - createdTime) / (1000 * 60 * 60 * 24 * 365.25));
  const yearsActive = Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear());
  const tenurePoints = Math.round(exactYears * 420); // 420 GP per year active

  // 2. Originality & Source Craftsmanship
  const totalRepoCount = Math.max(1, repos.length || user.public_repos || 1);
  const actualSources = sourceReposCount ?? repos.filter((r) => !r.fork).length;
  const originalityPct = repos.length > 0 ? Math.round((actualSources / totalRepoCount) * 100) : 100;
  const originalityPoints = Math.round(originalityPct * 24 + actualSources * 165);

  // 3. Polyglot Tech Stack Breadth
  const languagesCount = Math.max(1, languageStats.length);
  const polyglotPoints = languagesCount * 380;

  // 4. Codebase Scale & Shipped Architecture (MB of source code + public repos)
  const totalSizeKb = repos.reduce((acc, repo) => acc + (repo.size || 0), 0);
  const totalCodeMb = Number((totalSizeKb / 1024).toFixed(1));
  const codebasePoints = Math.round(totalCodeMb * 35 + user.public_repos * 110);

  // 5. Community Star Power & Activity Cadence (Uncapped / Endless scaling)
  const activeEventsCount = dayActivity.reduce((acc, d) => acc + d.events, 0);
  const starPoints = Math.round(totalStars * 15 + activeEventsCount * 12);

  const totalScore =
    tenurePoints +
    originalityPoints +
    polyglotPoints +
    codebasePoints +
    starPoints;

  let rankTitle = 'Rising Builder';
  let rankBadgeColor = '#38bdf8';

  if (totalScore >= 50000) {
    rankTitle = 'Mythic Open Source Titan';
    rankBadgeColor = '#f43f5e';
  } else if (totalScore >= 18000) {
    rankTitle = 'Grandmaster Architect';
    rankBadgeColor = '#a855f7';
  } else if (totalScore >= 9500) {
    rankTitle = 'Principal Systems Vanguard';
    rankBadgeColor = '#f59e0b';
  } else if (totalScore >= 6000) {
    rankTitle = 'Apex Full-Stack Engineer';
    rankBadgeColor = '#2997ff';
  } else if (totalScore >= 3500) {
    rankTitle = 'Senior Code Craftsman';
    rankBadgeColor = '#10b981';
  }

  const breakdown: GitPulseBreakdownItem[] = [
    {
      id: 'originality',
      label: 'Original Code & Sources',
      points: originalityPoints,
      weightLabel: '24 GP/% + 165 GP/source',
      rawDisplay: `${originalityPct}% Original (${actualSources} sources)`,
      color: '#10b981',
    },
    {
      id: 'tenure',
      label: 'Veteran Tenure',
      points: tenurePoints,
      weightLabel: '420 GP × Years Active',
      rawDisplay: `${yearsActive}y+ on GitHub`,
      color: '#a855f7',
    },
    {
      id: 'polyglot',
      label: 'Polyglot Stack Breadth',
      points: polyglotPoints,
      weightLabel: '380 GP × Languages',
      rawDisplay: `${languagesCount} Languages`,
      color: '#2997ff',
    },
    {
      id: 'codebase',
      label: 'Codebase Scale & Volume',
      points: codebasePoints,
      weightLabel: '110 GP/repo + 35 GP/MB',
      rawDisplay: `${totalCodeMb} MB across ${user.public_repos} repos`,
      color: '#38bdf8',
    },
    {
      id: 'impact',
      label: 'Star Power & Momentum',
      points: starPoints,
      weightLabel: '15 GP/★ + 12 GP/event (Endless)',
      rawDisplay: totalStars > 0 ? `★ ${totalStars.toLocaleString()} + ${activeEventsCount} events` : `${activeEventsCount} active events`,
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
  durationMs = 1400,
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
      // Ease out expo/cubic so it builds up fast from 0 and settles smoothly
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
