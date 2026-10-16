import React from 'react';
import { Heart, Globe } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-base text-[var(--text-primary)]">
                GitPulse
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                v2.0
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Next-generation GitHub profile visualizer, analytics suite, and card generator.
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)] flex items-center justify-center md:justify-start gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by{' '}
              <a
                href="https://github.com/bradleyjoejoseph"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--text-primary)] hover:text-blue-400 hover:underline"
              >
                Bradley Joseph
              </a>{' '}
              • University of York (CS & AI)
            </p>
          </div>

          {/* Center tech stack pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)]">
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)]">
              React 19
            </span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)]">
              TypeScript
            </span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)]">
              Tailwind CSS
            </span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)]">
              Recharts
            </span>
            <span className="px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)]">
              Vite
            </span>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <a
              href="https://bradleyjoejoseph.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </a>
            <a
              href="https://github.com/bradleyjoejoseph/github-profile-summary"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          </div>
        </div>

        {/* Tribute footnote */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]/60 text-center text-[11px] text-[var(--text-secondary)]/80">
          <p>
            Modern tribute inspired by the classic <code>profile-summary-for-github</code>. Data fetched live via official GitHub REST v3 API.
          </p>
        </div>
      </div>
    </footer>
  );
};
