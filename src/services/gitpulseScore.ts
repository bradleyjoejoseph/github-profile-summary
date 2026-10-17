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
    totalStars: number;
    totalCommits: number;
    totalForks: number;
    followers: number;
    publicRepos: number;
    languagesCount: number;
    yearsActive: number;
  };
}

/**
 * Computes the GitPulse Score (GP) from real-world GitHub impact and activity metrics:
 * Commits/Contributions, Total Stars, Repository Forks, Followers, Public Repos, and Stack/Tenure.
 */
export function calculateGitPulseScore(summary: UserSummaryData): GitPulseScoreResult {
  const { user, totalStars, totalForks, languageStats, dayActivity, totalContributions } = summary;

  // 1. Total Commits & Contributions (~1 GP per 12.5 commits)
  const fallbackEvents = dayActivity.reduce((acc, d) => acc + d.events, 0);
  const totalCommits =
    totalContributions && totalContributions > 0
      ? totalContributions
      : Math.max(fallbackEvents * 15, user.public_repos * 25);
  const commitPoints = Math.round(totalCommits / 12.5);

  // 2. Total Stars (World Impact & Open Source Recognition)
  const starPoints = Math.round(Math.sqrt(totalStars) * 1.4);

  // 3. Global Reach: Forks & Followers
  const followers = user.followers || 0;
  const reachPoints = Math.round(
    Math.sqrt(totalForks) * 1.2 + Math.sqrt(followers) * 1.5
  );

  // 4. Public Repositories (2 GP per public repository)
  const repoPoints = user.public_repos * 2;

  // 5. Tech Stack & Tenure (4 GP per language + 3 GP per year on GitHub)
  const languagesCount = Math.max(1, languageStats.length);
  const yearsActive = Math.max(
    1,
    new Date().getFullYear() - new Date(user.created_at).getFullYear()
  );
  const stackTenurePoints = languagesCount * 4 + yearsActive * 3;

  const totalScore =
    commitPoints +
    starPoints +
    reachPoints +
    repoPoints +
    stackTenurePoints;

  let rankTitle = 'Rising Developer';
  let rankBadgeColor = '#38bdf8';

  if (totalScore >= 1500) {
    rankTitle = 'Global Open Source Icon';
    rankBadgeColor = '#f43f5e';
  } else if (totalScore >= 600) {
    rankTitle = 'Principal Maintainer';
    rankBadgeColor = '#a855f7';
  } else if (totalScore >= 250) {
    rankTitle = 'Senior Impact Engineer';
    rankBadgeColor = '#f59e0b';
  } else if (totalScore >= 110) {
    rankTitle = 'Active Software Engineer';
    rankBadgeColor = '#2997ff';
  } else if (totalScore >= 50) {
    rankTitle = 'Open Source Builder';
    rankBadgeColor = '#10b981';
  }

  const breakdown: GitPulseBreakdownItem[] = [
    {
      id: 'commits',
      label: 'Total Commits',
      points: commitPoints,
      weightLabel: '1 GP / 12.5 commits',
      rawDisplay: `${totalCommits.toLocaleString()} contributions`,
      color: '#10b981',
    },
    {
      id: 'stars',
      label: 'Total Stars',
      points: starPoints,
      weightLabel: 'Star Impact Weight',
      rawDisplay: `★ ${totalStars.toLocaleString()} stars earned`,
      color: '#f59e0b',
    },
    {
      id: 'reach',
      label: 'Forks & Followers',
      points: reachPoints,
      weightLabel: 'Global Reach Weight',
      rawDisplay: `${totalForks.toLocaleString()} forks • ${followers.toLocaleString()} followers`,
      color: '#a855f7',
    },
    {
      id: 'repos',
      label: 'Public Repositories',
      points: repoPoints,
      weightLabel: '2 GP × Public Repos',
      rawDisplay: `${user.public_repos.toLocaleString()} public repos`,
      color: '#2997ff',
    },
    {
      id: 'stack',
      label: 'Stack & Experience',
      points: stackTenurePoints,
      weightLabel: '4 GP/lang + 3 GP/yr',
      rawDisplay: `${languagesCount} languages • ${yearsActive}y active`,
      color: '#38bdf8',
    },
  ];

  return {
    totalScore,
    rankTitle,
    rankBadgeColor,
    breakdown,
    metrics: {
      totalStars,
      totalCommits,
      totalForks,
      followers,
      publicRepos: user.public_repos,
      languagesCount,
      yearsActive,
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
