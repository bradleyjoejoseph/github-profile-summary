import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { ProfileHero } from './components/ProfileHero';
import { MetricCards } from './components/MetricCards';
import { LanguageBreakdown } from './components/LanguageBreakdown';
import { RepoAnalytics } from './components/RepoAnalytics';
import { CommitPunchcard } from './components/CommitPunchcard';
import { RepoExplorer } from './components/RepoExplorer';
import { CompareModal } from './components/CompareModal';
import { ExportCardModal } from './components/ExportCardModal';
import { Footer } from './components/Footer';
import { fetchUserSummary } from './services/githubApi';
import { BRADLEY_DEMO_DATA } from './services/mockData';
import type { UserSummaryData } from './types/github';
import { AlertCircle, Sparkles } from 'lucide-react';

export function App() {
  const { theme, setTheme } = useTheme();

  // Initial username from query string or default to Bradley Joseph
  const getInitialUsername = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('user') || 'bradleyjoejoseph';
  };

  const [username, setUsername] = useState(getInitialUsername);
  const [summary, setSummary] = useState<UserSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // Modals state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExportCardModalOpen, setIsExportCardModalOpen] = useState(false);

  const loadUserData = useCallback(
    async (targetUser: string, bypassCache = false) => {
      setIsLoading(true);
      setError(null);
      setIsDemoActive(false);

      // Update URL search param without full reload
      const url = new URL(window.location.href);
      url.searchParams.set('user', targetUser);
      window.history.replaceState({}, '', url.toString());

      try {
        const data = await fetchUserSummary(targetUser, bypassCache);
        setSummary(data);
        setUsername(targetUser);
      } catch (err: any) {
        console.error('Fetch error:', err);
        const errMsg = err.message || 'Failed to fetch GitHub profile summary.';
        setError(errMsg);

        // If target was bradleyjoejoseph or user wants demo fallback
        if (targetUser.toLowerCase() === 'bradleyjoejoseph') {
          setSummary(BRADLEY_DEMO_DATA);
          setIsDemoActive(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadUserData(username);
  }, []);

  const handleSearch = (newUsername: string) => {
    if (newUsername.trim()) {
      loadUserData(newUsername.trim());
    }
  };

  const handleRefresh = () => {
    if (username) {
      loadUserData(username, true);
    }
  };

  const handleUseDemo = () => {
    setSummary(BRADLEY_DEMO_DATA);
    setUsername('bradleyjoejoseph');
    setError(null);
    setIsDemoActive(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Search Bar & Demo Presets */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          currentUsername={username}
        />

        {/* Demo Mode Notice */}
        {isDemoActive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#2997ff] text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>Interactive Showcase:</strong> Displaying verified developer profile data for Bradley Joseph.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && !isDemoActive && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <h4 className="font-bold">Request Failed</h4>
                  <p className="text-xs text-red-400/90 mt-0.5">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleUseDemo}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-white transition-colors cursor-pointer"
                >
                  Load Demo Showcase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !summary && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-5">
            <div className="h-64 rounded-3xl bg-[#161b22]/60 border border-white/5 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="h-28 rounded-2xl bg-[#161b22]/60 border border-white/5 animate-pulse" />
              <div className="h-28 rounded-2xl bg-[#161b22]/60 border border-white/5 animate-pulse" />
              <div className="h-28 rounded-2xl bg-[#161b22]/60 border border-white/5 animate-pulse" />
            </div>
          </div>
        )}

        {/* Profile Content */}
        {summary && (
          <>
            {/* Executive Hero */}
            <ProfileHero
              user={summary.user}
              totalStars={summary.totalStars}
              totalForks={summary.totalForks}
              primaryLanguage={summary.primaryLanguage}
              sourceReposCount={summary.sourceReposCount}
              onRefresh={handleRefresh}
              onOpenCompare={() => setIsCompareModalOpen(true)}
              onOpenExportCard={() => setIsExportCardModalOpen(true)}
            />

            {/* KPI Metric Ribbon */}
            <MetricCards summary={summary} />

            {/* Analytics Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <LanguageBreakdown languageStats={summary.languageStats} />
                <RepoAnalytics
                  topStarredRepos={summary.topStarredRepos}
                  topForkedRepos={summary.topForkedRepos}
                />
              </div>

              {/* Day of week & 24h cadence */}
              <CommitPunchcard
                dayActivity={summary.dayActivity}
                hourActivity={summary.hourActivity}
              />
            </div>

            {/* Repositories Explorer */}
            <RepoExplorer repos={summary.repos} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {summary && (
        <>
          <CompareModal
            isOpen={isCompareModalOpen}
            onClose={() => setIsCompareModalOpen(false)}
            currentUser={summary}
          />

          <ExportCardModal
            isOpen={isExportCardModalOpen}
            onClose={() => setIsExportCardModalOpen(false)}
            summary={summary}
          />
        </>
      )}
    </div>
  );
}

export default App;
