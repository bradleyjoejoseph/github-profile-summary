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

  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [repos]);

  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        const matchesSearch =
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLang =
          selectedLanguage === 'all' || repo.language === selectedLanguage;

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
      <div className="apple-card p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#2997ff]" />
              Repository Explorer
            </h2>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Showing {filteredRepos.length} of {repos.length} public projects
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter repositories..."
                className="w-full py-1.5 pl-8 pr-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[var(--text-primary)] placeholder-[#6e7681] focus:outline-hidden focus:border-[#2997ff]"
              />
            </div>

            {/* Language Capsule */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[#2997ff] cursor-pointer"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Capsule */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[#2997ff] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="sources">Sources Only</option>
                <option value="forks">Forks Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[#2997ff] cursor-pointer"
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
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredRepos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#8b949e] text-xs">
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
                  className="rounded-2xl bg-black/25 border border-white/5 p-4 flex flex-col justify-between hover:border-white/15 hover:bg-black/40 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-[var(--text-primary)] hover:text-[#2997ff] hover:underline flex items-center gap-1.5 truncate group-hover:text-[#2997ff] transition-colors"
                      >
                        <span className="truncate">{repo.name}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </a>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {repo.fork && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                            Fork
                          </span>
                        )}
                        {repo.license && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#8b949e] border border-white/10">
                            {repo.license.spdx_id || repo.license.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-[#8b949e] line-clamp-2 leading-relaxed min-h-[32px]">
                      {repo.description || 'No description provided.'}
                    </p>

                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {repo.topics.slice(0, 4).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-[#2997ff] font-medium"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#8b949e]">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: langColor }}
                          />
                          <span className="font-medium text-[var(--text-primary)] text-[11px]">
                            {repo.language}
                          </span>
                        </div>
                      )}

                      {repo.stargazers_count > 0 && (
                        <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                          <Star className="w-3 h-3" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                      )}

                      {repo.forks_count > 0 && (
                        <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks_count}</span>
                        </div>
                      )}

                      {repo.size > 0 && (
                        <span className="text-[10px] font-mono text-[#6e7681]">
                          {repo.size >= 1024 ? `${(repo.size / 1024).toFixed(1)} MB` : `${repo.size} KB`}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-[#6e7681]">
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
