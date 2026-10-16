export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
  } | null;
  topics?: string[];
  archived: boolean;
  disabled: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: {
    commits?: Array<{
      sha: string;
      message: string;
    }>;
    action?: string;
  };
}

export interface LanguageStat {
  name: string;
  count: number;
  stars: number;
  color: string;
  percentage: number;
}

export interface DayActivity {
  day: string;
  dayIndex: number;
  events: number;
}

export interface HourActivity {
  hour: number;
  label: string;
  events: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export interface UserSummaryData {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  languageStats: LanguageStat[];
  topStarredRepos: GitHubRepo[];
  topForkedRepos: GitHubRepo[];
  dayActivity: DayActivity[];
  hourActivity: HourActivity[];
  primaryLanguage: string;
  sourceReposCount: number;
  forkedReposCount: number;
  cachedAt?: number;
}
