import type { UserSummaryData } from '../types/github';
import { BRADLEY_DEMO_DATA } from './mockData';

function makeDeveloperSummary(params: {
  login: string;
  id: number;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string | null;
  blog: string | null;
  created_at: string;
  public_repos: number;
  sourceReposCount: number;
  totalStars: number;
  totalForks: number;
  primaryLanguage: string;
  languages: Array<{ name: string; count: number; stars: number; color: string; percentage: number }>;
  totalSizeKb: number;
  eventsPerWeek: number;
}): UserSummaryData {
  const repoSizeEach = Math.round(params.totalSizeKb / Math.max(1, params.public_repos));
  const syntheticRepos = params.languages.map((lang, idx) => ({
    id: params.id * 100 + idx,
    name: `${params.login}-${lang.name.toLowerCase()}-core`,
    full_name: `${params.login}/${params.login}-${lang.name.toLowerCase()}-core`,
    private: false,
    html_url: `https://github.com/${params.login}`,
    description: `Core ${lang.name} architecture and open-source modules by ${params.name}.`,
    fork: false,
    created_at: params.created_at,
    updated_at: '2026-10-10T12:00:00Z',
    pushed_at: '2026-10-10T12:00:00Z',
    homepage: params.blog,
    size: repoSizeEach * lang.count,
    stargazers_count: lang.stars,
    watchers_count: lang.stars,
    language: lang.name,
    forks_count: Math.round(lang.stars * 0.12),
    open_issues_count: 2,
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT', url: null },
    topics: [lang.name.toLowerCase(), 'open-source'],
    archived: false,
    disabled: false,
  }));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayActivity = days.map((day, idx) => ({
    day,
    dayIndex: idx,
    events: Math.round((params.eventsPerWeek / 7) * (idx > 0 && idx < 6 ? 1.2 : 0.6)),
  }));

  const hourActivity = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    events: hour >= 9 && hour <= 21 ? Math.round(params.eventsPerWeek / 14) : 2,
  }));

  return {
    user: {
      login: params.login,
      id: params.id,
      avatar_url: params.avatar_url,
      html_url: `https://github.com/${params.login}`,
      name: params.name,
      company: params.company,
      blog: params.blog,
      location: params.location,
      email: null,
      hireable: true,
      bio: params.bio,
      twitter_username: params.login,
      public_repos: params.public_repos,
      public_gists: 4,
      followers: 100,
      following: 20,
      created_at: params.created_at,
      updated_at: '2026-10-15T12:00:00Z',
    },
    repos: syntheticRepos,
    totalStars: params.totalStars,
    totalForks: params.totalForks,
    languageStats: params.languages,
    topStarredRepos: syntheticRepos,
    topForkedRepos: syntheticRepos,
    dayActivity,
    hourActivity,
    primaryLanguage: params.primaryLanguage,
    sourceReposCount: params.sourceReposCount,
    forkedReposCount: Math.max(0, params.public_repos - params.sourceReposCount),
  };
}

export const BRADLEY_LEADERBOARD_PROFILE: UserSummaryData = {
  ...BRADLEY_DEMO_DATA,
  user: {
    ...BRADLEY_DEMO_DATA.user,
    public_repos: 16,
  },
  repos: [
    ...BRADLEY_DEMO_DATA.repos.map((r, i) => ({
      ...r,
      stargazers_count: 0,
      size: i === 0 ? 336900 : r.size,
    })),
  ],
  totalStars: 0,
  sourceReposCount: 11,
  forkedReposCount: 5,
  dayActivity: [
    { day: 'Sun', dayIndex: 0, events: 4 },
    { day: 'Mon', dayIndex: 1, events: 7 },
    { day: 'Tue', dayIndex: 2, events: 9 },
    { day: 'Wed', dayIndex: 3, events: 7 },
    { day: 'Thu', dayIndex: 4, events: 8 },
    { day: 'Fri', dayIndex: 5, events: 6 },
    { day: 'Sat', dayIndex: 6, events: 5 },
  ],
  languageStats: [
    { name: 'TypeScript', count: 5, stars: 0, color: '#3178c6', percentage: 38 },
    { name: 'JavaScript', count: 3, stars: 0, color: '#f1e05a', percentage: 23 },
    { name: 'HTML', count: 3, stars: 0, color: '#e34c26', percentage: 23 },
    { name: 'Python', count: 1, stars: 0, color: '#3572A5', percentage: 8 },
    { name: 'C#', count: 1, stars: 0, color: '#178600', percentage: 8 },
  ],
};

export const INITIAL_LEADERBOARD_PROFILES: UserSummaryData[] = [
  BRADLEY_LEADERBOARD_PROFILE,
  makeDeveloperSummary({
    login: 'torvalds',
    id: 1024025,
    name: 'Linus Torvalds',
    avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    bio: 'Creator of the Linux kernel and Git version control system.',
    location: 'Portland, OR',
    company: 'Linux Foundation',
    blog: 'https://kernel.org',
    created_at: '2011-09-03T15:26:22Z',
    public_repos: 7,
    sourceReposCount: 2,
    totalStars: 184500,
    totalForks: 52000,
    primaryLanguage: 'C',
    languages: [
      { name: 'C', count: 5, stars: 184000, color: '#555555', percentage: 85 },
      { name: 'C++', count: 1, stars: 500, color: '#f34b7d', percentage: 15 },
    ],
    totalSizeKb: 412000,
    eventsPerWeek: 210,
  }),
  makeDeveloperSummary({
    login: 'shadcn',
    id: 124599,
    name: 'shadcn',
    avatar_url: 'https://avatars.githubusercontent.com/u/124599?v=4',
    bio: 'Designing & building accessible component systems and modern web primitives.',
    location: 'San Francisco, CA',
    company: 'Vercel',
    blog: 'https://ui.shadcn.com',
    created_at: '2019-08-18T10:00:00Z',
    public_repos: 26,
    sourceReposCount: 19,
    totalStars: 76400,
    totalForks: 4800,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', count: 20, stars: 75000, color: '#3178c6', percentage: 80 },
      { name: 'CSS', count: 4, stars: 1200, color: '#563d7c', percentage: 15 },
      { name: 'JavaScript', count: 2, stars: 200, color: '#f1e05a', percentage: 5 },
    ],
    totalSizeKb: 48200,
    eventsPerWeek: 145,
  }),
  makeDeveloperSummary({
    login: 'gaearon',
    id: 810438,
    name: 'Dan Abramov',
    avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
    bio: 'Working on distributed social protocols & UI architecture. Co-author of Redux and Create React App.',
    location: 'London, UK',
    company: 'Bluesky',
    blog: 'https://overreacted.io',
    created_at: '2011-05-25T18:18:31Z',
    public_repos: 265,
    sourceReposCount: 98,
    totalStars: 112000,
    totalForks: 19500,
    primaryLanguage: 'JavaScript',
    languages: [
      { name: 'JavaScript', count: 160, stars: 88000, color: '#f1e05a', percentage: 65 },
      { name: 'TypeScript', count: 65, stars: 22000, color: '#3178c6', percentage: 25 },
      { name: 'HTML', count: 25, stars: 2000, color: '#e34c26', percentage: 10 },
    ],
    totalSizeKb: 96400,
    eventsPerWeek: 130,
  }),
  makeDeveloperSummary({
    login: 'Rich-Harris',
    id: 1162160,
    name: 'Rich Harris',
    avatar_url: 'https://avatars.githubusercontent.com/u/1162160?v=4',
    bio: 'Creator of Svelte and Rollup. Building compiler-first web frameworks.',
    location: 'New York, NY',
    company: 'Vercel',
    blog: 'https://svelte.dev',
    created_at: '2011-10-31T12:00:00Z',
    public_repos: 192,
    sourceReposCount: 115,
    totalStars: 38900,
    totalForks: 3200,
    primaryLanguage: 'JavaScript',
    languages: [
      { name: 'JavaScript', count: 110, stars: 25000, color: '#f1e05a', percentage: 58 },
      { name: 'TypeScript', count: 55, stars: 12000, color: '#3178c6', percentage: 29 },
      { name: 'Svelte', count: 25, stars: 1900, color: '#ff3e00', percentage: 13 },
    ],
    totalSizeKb: 64000,
    eventsPerWeek: 115,
  }),
  makeDeveloperSummary({
    login: 'yyx990803',
    id: 499550,
    name: 'Evan You',
    avatar_url: 'https://avatars.githubusercontent.com/u/499550?v=4',
    bio: 'Founder of VoidZero. Creator of Vue.js and Vite.',
    location: 'Singapore',
    company: 'VoidZero',
    blog: 'https://evanyou.me',
    created_at: '2010-11-28T01:05:40Z',
    public_repos: 178,
    sourceReposCount: 124,
    totalStars: 98500,
    totalForks: 14200,
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', count: 95, stars: 62000, color: '#3178c6', percentage: 54 },
      { name: 'JavaScript', count: 65, stars: 34000, color: '#f1e05a', percentage: 36 },
      { name: 'Rust', count: 10, stars: 2500, color: '#dea584', percentage: 6 },
      { name: 'CSS', count: 8, stars: 0, color: '#563d7c', percentage: 4 },
    ],
    totalSizeKb: 115000,
    eventsPerWeek: 165,
  }),
  makeDeveloperSummary({
    login: 'karpathy',
    id: 241138,
    name: 'Andrej Karpathy',
    avatar_url: 'https://avatars.githubusercontent.com/u/241138?v=4',
    bio: 'Building Eureka Labs. Previously Director of AI @ Tesla, Founding Member @ OpenAI.',
    location: 'San Francisco, CA',
    company: 'Eureka Labs',
    blog: 'https://karpathy.ai',
    created_at: '2010-04-10T19:00:00Z',
    public_repos: 61,
    sourceReposCount: 44,
    totalStars: 146000,
    totalForks: 29400,
    primaryLanguage: 'Python',
    languages: [
      { name: 'Python', count: 38, stars: 102000, color: '#3572A5', percentage: 62 },
      { name: 'C', count: 9, stars: 35000, color: '#555555', percentage: 15 },
      { name: 'JavaScript', count: 10, stars: 7000, color: '#f1e05a', percentage: 16 },
      { name: 'C++', count: 4, stars: 2000, color: '#f34b7d', percentage: 7 },
    ],
    totalSizeKb: 72000,
    eventsPerWeek: 95,
  }),
];
