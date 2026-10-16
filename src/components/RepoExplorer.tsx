import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import type { GitHubRepo } from '../types/github';
import { getLanguageColor } from '../services/languageColors';

interface RepoExplorerProps {
  repos: GitHubRepo[];
}

export const RepoExplorer: React.FC<RepoExplorerProps> = ({ repos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'sources' | 'forks'>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated' | 'name'>('stars');

  // Extract all unique languages
  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        // Search filter
        const matchesSearch =
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchTerm.toLowerCase()));

        // Language filter
        const matchesLang =
          selectedLanguage === 'all' || repo.language === selectedLanguage;

        // Type filter
        const matchesType =
          filterType === 'all' ||
          (filterType === 'sources' && !repo.fork) ||
          (filterType === 'forks' && repo.fork);

        return matchesSearch && matchesLang && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'forks') return b.forks_count - a.forks_count;
        if (sortBy === 'updated')
          return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
        return a.name.localeCompare(b.name);
      });
  }, [repos, searchTerm, selectedLanguage, filterType, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 shadow-md transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-blue-400" />
              Repository Explorer
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Showing {filteredRepos.length} of {repos.length} public projects
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter repositories..."
                className="w-full py-2 pl-9 pr-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-hidden focus:border-[var(--accent)]"
              />
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="py-2 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="py-2 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="sources">Sources Only</option>
                <option value="forks">Forks Only</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="stars">Sort by Stars</option>
                <option value="forks">Sort by Forks</option>
                <option value="updated">Sort by Recent</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Repositories Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[var(--text-secondary)] text-sm">
              No repositories matched your filters.
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const langColor = getLanguageColor(repo.language);
              const updatedDate = new Date(repo.pushed_at || repo.updated_at).toLocaleDateString(
                undefined,
                { year: 'numeric', month: 'short', day: 'numeric' }
              );

              return (
                <div
                  key={repo.id}
                  className="rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)] p-4 flex flex-col justify-between hover:border-[var(--accent)]/50 transition-all hover:shadow-md group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-[var(--accent)] hover:underline flex items-center gap-1.5 truncate group-hover:text-blue-400"
                      >
                        <span className="truncate">{repo.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      </a>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {repo.fork && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Fork
                          </span>
                        )}
                        {repo.license && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                            {repo.license.spdx_id || repo.license.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed min-h-[32px]">
                      {repo.description || 'No description provided.'}
                    </p>

                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 4).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-medium"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)]/70 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: langColor }}
                          />
                          <span className="font-medium text-[var(--text-primary)]">
                            {repo.language}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-amber-400 font-mono">
                        <Star className="w-3.5 h-3.5" />
                        <span>{repo.stargazers_count}</span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-400 font-mono">
                        <GitFork className="w-3.5 h-3.5" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono opacity-80">
                      Updated {updatedDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
