import React, { useState, useEffect } from 'react';
import {
  X,
  Swords,
  Loader2,
  Trophy,
  Star,
  BookOpen,
  GitCommitHorizontal,
  GitFork,
  Users,
  RotateCcw,
  Zap,
  Flame,
  Crown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchUserSummary } from '../services/githubApi';
import type { UserSummaryData } from '../types/github';
import { calculateGitPulseScore, useCountUpFromZero } from '../services/gitpulseScore';
import { INITIAL_LEADERBOARD_PROFILES } from '../services/leaderboardData';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSummaryData;
  initialOpponentLogin?: string | null;
}

interface BattleRound {
  id: string;
  roundNumber: number;
  title: string;
  subtitle: string;
  valA: number;
  valB: number;
  displayA: string;
  displayB: string;
  icon: React.ReactNode;
}

const QUICK_CHALLENGERS = ['shadcn', 'torvalds', 'gaearon', 'Rich-Harris', 'yyx990803', 'karpathy'];

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialOpponentLogin,
}) => {
  const [targetUsername, setTargetUsername] = useState(initialOpponentLogin || 'shadcn');
  const [comparedUser, setComparedUser] = useState<UserSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controls the sequential slide-down battle animation (0..7)
  const [revealedRounds, setRevealedRounds] = useState(0);
  const [tugEngaged, setTugEngaged] = useState(false);
  const [battleNonce, setBattleNonce] = useState(0);

  // Load initial challenger when modal opens or initialOpponentLogin changes
  useEffect(() => {
    if (!isOpen) return;
    const desiredLogin = (initialOpponentLogin || targetUsername || 'shadcn').trim();
    setTargetUsername(desiredLogin);
    startChallenge(desiredLogin);
  }, [isOpen, initialOpponentLogin]);

  // Sequential slide-down timer for each battle round
  useEffect(() => {
    if (!isOpen || !comparedUser) return;

    setRevealedRounds(0);
    setTugEngaged(false);

    const engageTimer = setTimeout(() => {
      setTugEngaged(true);
    }, 120);

    const interval = setInterval(() => {
      setRevealedRounds((prev) => {
        if (prev >= 7) {
          clearInterval(interval);
          return 7;
        }
        const next = prev + 1;
        if (next === 7) {
          confetti({
            particleCount: 75,
            spread: 68,
            origin: { y: 0.65 },
          });
        }
        return next;
      });
    }, 390);

    return () => {
      clearTimeout(engageTimer);
      clearInterval(interval);
    };
  }, [isOpen, comparedUser, battleNonce]);

  const startChallenge = async (usernameToFetch: string) => {
    const clean = usernameToFetch.trim().toLowerCase();
    if (!clean) return;

    setError(null);

    // Check if challenger is in preloaded roster for instant 0ms response
    const preset = INITIAL_LEADERBOARD_PROFILES.find(
      (p) => p.user.login.toLowerCase() === clean
    );

    if (preset) {
      setComparedUser(preset);
      setBattleNonce((n) => n + 1);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchUserSummary(clean);
      setComparedUser(data);
      setBattleNonce((n) => n + 1);
    } catch (err: any) {
      setError(err.message || 'Could not load challenger from GitHub.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startChallenge(targetUsername);
  };

  const handleReplayBattle = () => {
    setBattleNonce((n) => n + 1);
  };

  const gpA = calculateGitPulseScore(currentUser);
  const gpB = comparedUser ? calculateGitPulseScore(comparedUser) : null;

  const animatedGpA = useCountUpFromZero(gpA.totalScore, 1400, `${currentUser.user.login}-${battleNonce}`);
  const animatedGpB = useCountUpFromZero(gpB?.totalScore || 0, 1400, `${comparedUser?.user.login}-${battleNonce}`);

  if (!isOpen) return null;

  const userA = currentUser;
  const userB = comparedUser;

  const rounds: BattleRound[] =
    userB && gpB
      ? [
          {
            id: 'stars',
            roundNumber: 1,
            title: 'Total Stars',
            subtitle: 'Stargazers earned across all repositories',
            valA: gpA.metrics.totalStars,
            valB: gpB.metrics.totalStars,
            displayA: `★ ${gpA.metrics.totalStars.toLocaleString()}`,
            displayB: `★ ${gpB.metrics.totalStars.toLocaleString()}`,
            icon: <Star className="w-3.5 h-3.5 text-yellow-400" />,
          },
          {
            id: 'commits',
            roundNumber: 2,
            title: 'Total Commits',
            subtitle: 'Lifetime code commits and contributions',
            valA: gpA.metrics.totalCommits,
            valB: gpB.metrics.totalCommits,
            displayA: `${gpA.metrics.totalCommits.toLocaleString()} Commits`,
            displayB: `${gpB.metrics.totalCommits.toLocaleString()} Commits`,
            icon: <GitCommitHorizontal className="w-3.5 h-3.5 text-emerald-400" />,
          },
          {
            id: 'forks',
            roundNumber: 3,
            title: 'Total Forks',
            subtitle: 'Repositories forked and built upon worldwide',
            valA: gpA.metrics.totalForks,
            valB: gpB.metrics.totalForks,
            displayA: `${gpA.metrics.totalForks.toLocaleString()} Forks`,
            displayB: `${gpB.metrics.totalForks.toLocaleString()} Forks`,
            icon: <GitFork className="w-3.5 h-3.5 text-[#2997ff]" />,
          },
          {
            id: 'followers',
            roundNumber: 4,
            title: 'Followers',
            subtitle: 'Global developer community following',
            valA: gpA.metrics.followers,
            valB: gpB.metrics.followers,
            displayA: `${gpA.metrics.followers.toLocaleString()} Followers`,
            displayB: `${gpB.metrics.followers.toLocaleString()} Followers`,
            icon: <Users className="w-3.5 h-3.5 text-purple-400" />,
          },
          {
            id: 'repos',
            roundNumber: 5,
            title: 'Public Repositories',
            subtitle: 'Total open-source projects published',
            valA: gpA.metrics.publicRepos,
            valB: gpB.metrics.publicRepos,
            displayA: `${gpA.metrics.publicRepos.toLocaleString()} Repos`,
            displayB: `${gpB.metrics.publicRepos.toLocaleString()} Repos`,
            icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />,
          },
          {
            id: 'gp_score',
            roundNumber: 6,
            title: 'GitPulse Score',
            subtitle: 'Combined weighted engineering score',
            valA: gpA.totalScore,
            valB: gpB.totalScore,
            displayA: `${gpA.totalScore.toLocaleString()} GP`,
            displayB: `${gpB.totalScore.toLocaleString()} GP`,
            icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
          },
        ]
      : [];

  // Calculate live round wins based on revealed rounds so far
  const visibleRounds = rounds.slice(0, Math.min(revealedRounds, 6));
  let winsA = 0;
  let winsB = 0;
  visibleRounds.forEach((r) => {
    if (r.valA > r.valB) winsA += 1;
    else if (r.valB > r.valA) winsB += 1;
    else {
      winsA += 0.5;
      winsB += 0.5;
    }
  });

  const masterTugPctA =
    winsA + winsB === 0
      ? 50
      : Math.min(86, Math.max(14, Math.round((winsA / (winsA + winsB)) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#12161f]/98 border border-white/12 shadow-2xl p-5 sm:p-7 max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#8b949e] hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Arena Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2997ff] to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Versus Tug-of-War Arena
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#2997ff]/15 text-[#2997ff] border border-[#2997ff]/30 font-bold">
                  6-Round Clash
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                Stats slide down round-by-round and pull the Tug-of-War power bar
              </p>
            </div>
          </div>

          {userB && (
            <button
              onClick={handleReplayBattle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95 cursor-pointer"
              title="Replay Slide-Down Battle Animation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Replay Fight</span>
            </button>
          )}
        </div>

        {/* Challenger Input + Quick Presets */}
        <div className="mt-4 p-3.5 rounded-2xl bg-black/40 border border-white/8">
          <form onSubmit={handleCompareSubmit} className="flex gap-2">
            <input
              type="text"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder="Enter challenger GitHub username (e.g. shadcn, torvalds)..."
              className="flex-1 py-2 px-3.5 rounded-xl bg-[#0d1117] border border-white/10 text-xs sm:text-sm text-white placeholder-[#6e7681] focus:outline-hidden focus:border-[#2997ff]"
            />
            <button
              type="submit"
              disabled={isLoading || !targetUsername.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-[#2997ff] to-purple-600 hover:from-[#3ea3ff] hover:to-purple-500 disabled:opacity-50 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Swords className="w-3.5 h-3.5" />
              )}
              <span>Fight!</span>
            </button>
          </form>

          {/* Quick Opponent Pills */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681] mr-1">
              Quick Challengers:
            </span>
            {QUICK_CHALLENGERS.filter(
              (c) => c.toLowerCase() !== userA.user.login.toLowerCase()
            ).map((challenger) => {
              const isSelected =
                userB?.user.login.toLowerCase() === challenger.toLowerCase();
              return (
                <button
                  key={challenger}
                  type="button"
                  onClick={() => {
                    setTargetUsername(challenger);
                    startChallenge(challenger);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50 font-bold'
                      : 'bg-white/5 text-[#8b949e] hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  @{challenger}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Battle Arena */}
        {userB && gpB ? (
          <div className="mt-5 space-y-4">
            {/* Fighter Corner Cards + Master Tug-of-War Power Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/40 border border-white/10">
              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Fighter 1 (Blue Corner) */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={userA.user.avatar_url}
                      alt={userA.user.login}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#2997ff] object-cover shadow-lg shadow-blue-500/20"
                    />
                    {revealedRounds >= 6 && winsA > winsB && (
                      <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md">
                        <Crown className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2997ff]/20 text-[#2997ff]">
                        P1
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                        {userA.user.name || userA.user.login}
                      </h3>
                    </div>
                    <p className="text-[11px] font-mono text-[#2997ff] truncate">
                      @{userA.user.login}
                    </p>
                    <p className="text-xs font-mono font-extrabold text-white mt-0.5">
                      {animatedGpA.toLocaleString()} <span className="text-[10px] text-[#2997ff]">GP</span>
                    </p>
                  </div>
                </div>

                {/* Fighter 2 (Purple/Red Corner) */}
                <div className="flex items-center justify-end gap-3 text-right">
                  <div className="min-w-0">
                    <div className="flex items-center justify-end gap-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                        {userB.user.name || userB.user.login}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        P2
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-purple-400 truncate">
                      @{userB.user.login}
                    </p>
                    <p className="text-xs font-mono font-extrabold text-white mt-0.5">
                      {animatedGpB.toLocaleString()} <span className="text-[10px] text-purple-400">GP</span>
                    </p>
                  </div>
                  <div className="relative shrink-0">
                    <img
                      src={userB.user.avatar_url}
                      alt={userB.user.login}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-purple-500 object-cover shadow-lg shadow-purple-500/20"
                    />
                    {revealedRounds >= 6 && winsB > winsA && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md">
                        <Crown className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Master Tug-of-War Rope */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="text-[#2997ff] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {winsA} Rounds Won
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#8b949e] font-sans font-bold">
                    Master Tug-of-War
                  </span>
                  <span className="text-purple-400 flex items-center gap-1">
                    {winsB} Rounds Won <Flame className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="relative h-4 w-full rounded-full bg-black/70 p-0.5 border border-white/10 overflow-visible flex items-center">
                  <div className="w-full h-full rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-[#0071e3] to-[#2997ff] transition-all duration-500 ease-out"
                      style={{ width: `${masterTugPctA}%` }}
                    />
                    <div
                      className="h-full bg-gradient-to-l from-purple-700 to-purple-500 transition-all duration-500 ease-out"
                      style={{ width: `${100 - masterTugPctA}%` }}
                    />
                  </div>
                  {/* Center Knot / Clash Spark */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#161b22] border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/40 transition-all duration-500 ease-out z-10 clash-spark"
                    style={{ left: `${masterTugPctA}%` }}
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sequential Slide-Down Stat Battle Rounds */}
            <div className="space-y-2.5">
              {rounds.map((round) => {
                const isRevealed = revealedRounds >= round.roundNumber;
                if (!isRevealed) return null;

                const total = round.valA + round.valB;
                const rawPctA = total === 0 ? 50 : (round.valA / total) * 100;
                const clampedPctA = tugEngaged
                  ? Math.min(88, Math.max(12, rawPctA))
                  : 50;

                const winner =
                  round.valA > round.valB
                    ? 'A'
                    : round.valB > round.valA
                    ? 'B'
                    : 'TIE';

                return (
                  <div
                    key={`${round.id}-${battleNonce}`}
                    className="battle-round-slide-down p-3.5 rounded-2xl bg-black/40 border border-white/8 hover:border-white/15 transition-colors"
                  >
                    {/* Round Header & Values */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {/* Left Fighter Stat */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-mono font-bold ${
                            winner === 'A' ? 'text-[#2997ff]' : 'text-[#8b949e]'
                          }`}
                        >
                          {round.displayA}
                        </span>
                        {winner === 'A' && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30">
                            WIN +1
                          </span>
                        )}
                      </div>

                      {/* Center Round Title */}
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span className="text-[10px] font-mono text-[#6e7681]">
                            R{round.roundNumber}
                          </span>
                          {round.icon}
                          <span>{round.title}</span>
                        </div>
                      </div>

                      {/* Right Fighter Stat */}
                      <div className="flex items-center justify-end gap-2 min-w-0">
                        {winner === 'B' && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            WIN +1
                          </span>
                        )}
                        <span
                          className={`text-xs sm:text-sm font-mono font-bold ${
                            winner === 'B' ? 'text-purple-400' : 'text-[#8b949e]'
                          }`}
                        >
                          {round.displayB}
                        </span>
                      </div>
                    </div>

                    {/* Animated Tug-of-War Clash Bar */}
                    <div className="relative h-2.5 w-full bg-black/60 rounded-full flex items-center">
                      <div className="w-full h-full rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-r from-[#0071e3] to-[#2997ff] transition-all duration-700 ease-out"
                          style={{ width: `${clampedPctA}%` }}
                        />
                        <div
                          className="h-full bg-gradient-to-l from-purple-700 to-purple-500 transition-all duration-700 ease-out"
                          style={{ width: `${100 - clampedPctA}%` }}
                        />
                      </div>

                      {/* Tug Point Divider Marker */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#161b22] shadow-md transition-all duration-700 ease-out"
                        style={{ left: `${clampedPctA}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Verdict Banner (Slides down at Round 7) */}
            {revealedRounds >= 7 && (
              <div className="battle-round-slide-down p-4 rounded-2xl bg-gradient-to-r from-[#2997ff]/15 via-purple-500/15 to-[#2997ff]/15 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                      Battle Complete • Final Tug-of-War Verdict
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {winsA > winsB
                        ? `🏆 @${userA.user.login} wins the Tug-of-War (${winsA} – ${winsB})!`
                        : winsB > winsA
                        ? `🏆 @${userB.user.login} wins the Tug-of-War (${winsB} – ${winsA})!`
                        : `⚡ Deadlock Draw (${winsA} – ${winsB})! Both engineers matched round-for-round!`}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={handleReplayBattle}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer shrink-0"
                >
                  Replay Slide-Down
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 py-12 text-center text-[#8b949e] text-xs">
            Select a challenger above to begin the Tug-of-War battle.
          </div>
        )}
      </div>
    </div>
  );
};
