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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161b22]/95 border border-white/10 shadow-2xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#8b949e] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              GitHub API & Token Settings
            </h2>
            <p className="text-xs text-[#8b949e]">
              Bypass rate limits by connecting your personal access token
            </p>
          </div>
        </div>

        {/* Current Quota Status */}
        <div className="mt-5 p-4 rounded-2xl bg-black/30 border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8b949e]">Current API Rate Limit:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {rateLimit.remaining} / {rateLimit.limit} remaining
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                rateLimit.remaining < 10
                  ? 'bg-red-500'
                  : rateLimit.remaining < 30
                  ? 'bg-amber-500'
                  : 'bg-[#27c93f]'
              }`}
              style={{
                width: `${Math.max(5, (rateLimit.remaining / rateLimit.limit) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[10px] text-[#6e7681] font-mono">
            Quota resets at: {resetTime}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Personal Access Token
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full py-2 px-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-hidden focus:border-[#2997ff]"
            />
          </div>

          <div className="flex items-start gap-2 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#2997ff] text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Client-Side Privacy:</strong> Stored strictly in your browser's <code>localStorage</code>. No backend server exists. No permissions/scopes required!
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="https://github.com/settings/tokens/new?description=GitPulse%20Profile%20Summary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2997ff] hover:underline flex items-center gap-1"
            >
              Generate token on GitHub <ExternalLink className="w-3 h-3" />
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
          <div className="pt-3 border-t border-white/5 flex gap-2.5">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#2997ff] to-[#0071e3] hover:from-[#3ea3ff] hover:to-[#0077ed] text-white shadow-md transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Token & Refresh</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-[#8b949e] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
