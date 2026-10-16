import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Trash2, Check } from 'lucide-react';
import { getStoredToken, setStoredToken } from '../services/githubApi';
import type { RateLimitInfo } from '../types/github';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateLimit: RateLimitInfo;
  onTokenUpdated: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  rateLimit,
  onTokenUpdated,
}) => {
  const [tokenInput, setTokenInput] = useState(getStoredToken() || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredToken(tokenInput.trim() || null);
    setSavedSuccess(true);
    onTokenUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleRemove = () => {
    setStoredToken(null);
    setTokenInput('');
    onTokenUpdated();
  };

  const resetTime = new Date(rateLimit.reset * 1000).toLocaleTimeString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              GitHub API & Token Settings
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Bypass rate limits by connecting your personal token
            </p>
          </div>
        </div>

        {/* Current Rate Limit Status */}
        <div className="mt-6 p-4 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border-color)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">Current Rate Limit:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {rateLimit.remaining} / {rateLimit.limit} remaining
            </span>
          </div>
          <div className="mt-2 h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                rateLimit.remaining < 10
                  ? 'bg-red-500'
                  : rateLimit.remaining < 30
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.max(5, (rateLimit.remaining / rateLimit.limit) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[var(--text-secondary)] font-mono">
            Quota resets at: {resetTime}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Personal Access Token (Classic or Fine-Grained)
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Client-Side Privacy:</strong> Your token is stored only in
              your browser's <code>localStorage</code> and never sent to any server. No
              scopes/permissions are required for reading public profile data!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://github.com/settings/tokens/new?description=GitPulse%20Profile%20Summary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              Generate token on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {getStoredToken() && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear token
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[var(--border-color)] flex gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <span>Save Token & Refresh</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
