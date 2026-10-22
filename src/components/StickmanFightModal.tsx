import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, FastForward, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UserSummaryData } from '../types/github';

interface StickmanFightModalProps {
  isOpen: boolean;
  onClose: () => void;
  userA: UserSummaryData;
  userB: UserSummaryData;
  winsA: number;
  winsB: number;
}

type FightPhase = 'intro' | 'round1' | 'round2' | 'finisher' | 'ko' | 'victory';

export const StickmanFightModal: React.FC<StickmanFightModalProps> = ({
  isOpen,
  onClose,
  userA,
  userB,
  winsA,
  winsB,
}) => {
  const [phase, setPhase] = useState<FightPhase>('intro');
  const [hpA, setHpA] = useState(100);
  const [hpB, setHpB] = useState(100);
  const [actionText, setActionText] = useState('READY...');
  const [fightTime, setFightTime] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const winner: 'A' | 'B' | 'TIE' =
    winsA > winsB ? 'A' : winsB > winsA ? 'B' : 'TIE';

  const resetFight = () => {
    setPhase('intro');
    setHpA(100);
    setHpB(100);
    setActionText('READY...');
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isOpen) return;
    resetFight();

    const updateLoop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setFightTime(elapsed);

      // Phase 0: Intro (0s - 1.4s)
      if (elapsed < 1.4) {
        setPhase('intro');
        setActionText(elapsed < 0.7 ? 'READY...' : 'FIGHT!');
        setHpA(100);
        setHpB(100);
      }
      // Phase 1: Round 1 clash (1.4s - 3.6s)
      else if (elapsed < 3.6) {
        setPhase('round1');
        setActionText(elapsed < 2.5 ? 'CLASH!' : 'COUNTER!');
        if (winner === 'A') {
          setHpB(Math.max(65, 100 - (elapsed - 1.4) * 22));
          setHpA(Math.max(85, 100 - (elapsed - 1.4) * 9));
        } else if (winner === 'B') {
          setHpA(Math.max(65, 100 - (elapsed - 1.4) * 22));
          setHpB(Math.max(85, 100 - (elapsed - 1.4) * 9));
        } else {
          setHpA(Math.max(75, 100 - (elapsed - 1.4) * 15));
          setHpB(Math.max(75, 100 - (elapsed - 1.4) * 15));
        }
      }
      // Phase 2: Round 2 rapid flurry (3.6s - 5.8s)
      else if (elapsed < 5.8) {
        setPhase('round2');
        setActionText(elapsed < 4.8 ? 'COMBO x5!' : 'SUPER CHARGE!');
        if (winner === 'A') {
          setHpB(Math.max(25, 65 - (elapsed - 3.6) * 20));
          setHpA(Math.max(70, 85 - (elapsed - 3.6) * 8));
        } else if (winner === 'B') {
          setHpA(Math.max(25, 65 - (elapsed - 3.6) * 20));
          setHpB(Math.max(70, 85 - (elapsed - 3.6) * 8));
        } else {
          setHpA(Math.max(45, 75 - (elapsed - 3.6) * 15));
          setHpB(Math.max(45, 75 - (elapsed - 3.6) * 15));
        }
      }
      // Phase 3: Finishing Move (5.8s - 7.6s)
      else if (elapsed < 7.6) {
        setPhase('finisher');
        setActionText('SPECIAL FINISHER!');
        if (winner === 'A') {
          setHpB(Math.max(0, 25 - (elapsed - 5.8) * 25));
        } else if (winner === 'B') {
          setHpA(Math.max(0, 25 - (elapsed - 5.8) * 25));
        } else {
          setHpA(0);
          setHpB(0);
        }
      }
      // Phase 4: K.O. (7.6s - 9.0s)
      else if (elapsed < 9.0) {
        setPhase('ko');
        setActionText(winner === 'TIE' ? 'DOUBLE K.O.!' : 'K.O.!');
        if (winner === 'A') setHpB(0);
        else if (winner === 'B') setHpA(0);
      }
      // Phase 5: Victory Pose (9.0s+)
      else {
        if (phase !== 'victory') {
          setPhase('victory');
          setActionText(
            winner === 'A'
              ? `@${userA.user.login} WINS!`
              : winner === 'B'
              ? `@${userB.user.login} WINS!`
              : 'DRAW DEADLOCK!'
          );
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, userA, userB, winsA, winsB, winner]);

  const handleSkipToFinisher = () => {
    startTimeRef.current = Date.now() - 7600;
  };

  if (!isOpen) return null;

  // Calculate dynamic positions & poses for SVG stickmen based on phase and fightTime
  const getFighterStates = () => {
    const t = fightTime;

    let posX_A = 180;
    let posX_B = 460;
    let poseA = 'idle';
    let poseB = 'idle';

    if (phase === 'intro') {
      posX_A = Math.min(200, 100 + t * 90);
      posX_B = Math.max(440, 540 - t * 90);
      poseA = 'walk';
      poseB = 'walk';
    } else if (phase === 'round1') {
      const cycle = Math.sin(t * 8);
      posX_A = 260 + cycle * 35;
      posX_B = 380 - cycle * 35;
      poseA = cycle > 0 ? 'punch' : 'block';
      poseB = cycle > 0 ? 'hurt' : 'kick';
    } else if (phase === 'round2') {
      const cycle = Math.sin(t * 14);
      posX_A = 275 + cycle * 20;
      posX_B = 365 - cycle * 20;
      poseA = cycle > 0 ? 'kick' : 'punch';
      poseB = cycle > 0 ? 'block' : 'punch';
    } else if (phase === 'finisher') {
      if (winner === 'A') {
        posX_A = 295;
        posX_B = 430;
        poseA = 'dragon';
        poseB = 'fly_back';
      } else if (winner === 'B') {
        posX_A = 210;
        posX_B = 345;
        poseA = 'fly_back';
        poseB = 'dragon';
      } else {
        posX_A = 290;
        posX_B = 350;
        poseA = 'clash_center';
        poseB = 'clash_center';
      }
    } else {
      // ko & victory
      if (winner === 'A') {
        posX_A = 280;
        posX_B = 480;
        poseA = 'victory';
        poseB = 'knockout';
      } else if (winner === 'B') {
        posX_A = 160;
        posX_B = 360;
        poseA = 'knockout';
        poseB = 'victory';
      } else {
        posX_A = 260;
        posX_B = 380;
        poseA = 'knockout';
        poseB = 'knockout';
      }
    }

    return { posX_A, posX_B, poseA, poseB };
  };

  const { posX_A, posX_B, poseA, poseB } = getFighterStates();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c1017] border border-white/15 shadow-2xl p-4 sm:p-6 overflow-hidden">
        {/* Top Floating Glass HUD */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Fighter 1 (Blue) */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={userA.user.avatar_url}
              alt={userA.user.login}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-[#2997ff] object-cover shrink-0 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[#2997ff] truncate">@{userA.user.login}</span>
                <span className="text-white text-[10px]">{Math.round(hpA)}%</span>
              </div>
              {/* Health bar */}
              <div className="h-2.5 sm:h-3 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10 mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#0071e3] to-[#2997ff] rounded-full transition-all duration-150"
                  style={{ width: `${Math.max(0, hpA)}%` }}
                />
              </div>
            </div>
          </div>

          {/* VS Center Badge */}
          <div className="shrink-0 flex flex-col items-center px-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-xs font-mono tracking-wider">
              VS
            </span>
            <span className="text-[9px] font-mono text-[#8b949e] mt-0.5">
              {Math.max(0, Math.floor(10 - fightTime))}s
            </span>
          </div>

          {/* Fighter 2 (Purple) */}
          <div className="flex items-center justify-end gap-2 min-w-0 flex-1 text-right">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-white text-[10px]">{Math.round(hpB)}%</span>
                <span className="text-purple-400 truncate">@{userB.user.login}</span>
              </div>
              {/* Health bar */}
              <div className="h-2.5 sm:h-3 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10 mt-0.5 flex justify-end">
                <div
                  className="h-full bg-gradient-to-l from-purple-700 to-purple-400 rounded-full transition-all duration-150"
                  style={{ width: `${Math.max(0, hpB)}%` }}
                />
              </div>
            </div>
            <img
              src={userB.user.avatar_url}
              alt={userB.user.login}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-purple-500 object-cover shrink-0 shadow-md"
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8b949e] hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-1"
            aria-label="Close Fight Arena"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Animated Arena Screen */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl bg-gradient-to-b from-[#090d16] via-[#0d121f] to-[#070a10] border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Neon Grid Stage Floor */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2997ff]/10 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-8 h-[1px] bg-gradient-to-r from-transparent via-[#2997ff]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-8 flex justify-around opacity-20 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-[#2997ff]" />
            ))}
          </div>

          {/* Floating Action Text Banner */}
          <div className="absolute top-4 inset-x-0 flex flex-col items-center pointer-events-none z-20">
            <span
              className={`font-black uppercase tracking-widest text-center px-4 py-1 rounded-full text-xs sm:text-sm shadow-lg transition-all transform duration-200 ${
                phase === 'ko' || phase === 'victory'
                  ? 'bg-amber-400 text-black scale-110 font-mono animate-bounce'
                  : phase === 'finisher'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-black/60 backdrop-blur-md text-[#2997ff] border border-white/10'
              }`}
            >
              {actionText}
            </span>
          </div>

          {/* SVG Vector Stickmen Arena */}
          <svg
            viewBox="0 0 640 320"
            className="w-full h-full select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2997ff" />
              </filter>
              <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#c084fc" />
              </filter>
              <linearGradient id="blueLaser" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2997ff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Fighter 1 (Blue Stickman) */}
            <g
              transform={`translate(${posX_A}, 220)`}
              filter="url(#glowBlue)"
              className="transition-transform duration-75"
            >
              {/* Crest Avatar above head */}
              <circle cx="0" cy="-80" r="14" fill="#2997ff" opacity="0.3" />
              <text
                x="0"
                y="-75"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#ffffff"
                fontFamily="sans-serif"
              >
                P1
              </text>

              {/* Head */}
              <circle
                cx="0"
                cy="-48"
                r="11"
                fill="#ffffff"
                stroke="#2997ff"
                strokeWidth="2.5"
              />
              {/* Headband */}
              <path d="M -11 -48 L 11 -48" stroke="#2997ff" strokeWidth="3" />
              <path d="M -10 -46 L -16 -40" stroke="#2997ff" strokeWidth="2.5" />

              {/* Body & Limbs depending on pose */}
              {poseA === 'victory' ? (
                <>
                  {/* Spine */}
                  <line x1="0" y1="-37" x2="0" y2="-5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Victory Raised Arms */}
                  <line x1="0" y1="-30" x2="-18" y2="-55" stroke="#2997ff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="-30" x2="18" y2="-55" stroke="#2997ff" strokeWidth="3" strokeLinecap="round" />
                  {/* Golden Trophy held high */}
                  <circle cx="0" cy="-66" r="7" fill="#fbbf24" />
                  {/* Sturdy Stance Legs */}
                  <line x1="0" y1="-5" x2="-15" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="0" y1="-5" x2="15" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </>
              ) : poseA === 'knockout' ? (
                <>
                  {/* Knocked down flat */}
                  <line x1="-20" y1="14" x2="15" y2="14" stroke="#8b949e" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="-15" y1="14" x2="-25" y2="6" stroke="#8b949e" strokeWidth="3" strokeLinecap="round" />
                  <line x1="10" y1="14" x2="22" y2="18" stroke="#8b949e" strokeWidth="3" strokeLinecap="round" />
                  {/* Dizzy stars */}
                  <text x="0" y="0" fontSize="12" fill="#fbbf24">💫</text>
                </>
              ) : poseA === 'punch' || poseA === 'dragon' ? (
                <>
                  {/* Spine leaning forward */}
                  <line x1="0" y1="-37" x2="-8" y2="-5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Forward punching arm with energy blast */}
                  <line x1="0" y1="-30" x2="26" y2="-30" stroke="#2997ff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="0" y1="-30" x2="-12" y2="-18" stroke="#2997ff" strokeWidth="3" strokeLinecap="round" />
                  {/* Punch shockwave */}
                  <circle cx="34" cy="-30" r="10" fill="#2997ff" opacity="0.6" />
                  <line x1="26" y1="-30" x2="52" y2="-30" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                  {/* Lunge Legs */}
                  <line x1="-8" y1="-5" x2="-22" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="-8" y1="-5" x2="14" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Standard combat stance / walk */}
                  <line x1="0" y1="-37" x2="0" y2="-5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Boxing guard arms */}
                  <line x1="0" y1="-30" x2="14" y2="-34" stroke="#2997ff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="-30" x2="-10" y2="-20" stroke="#2997ff" strokeWidth="3" strokeLinecap="round" />
                  {/* Legs */}
                  <line x1="0" y1="-5" x2="-12" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="0" y1="-5" x2="12" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </>
              )}
            </g>

            {/* Fighter 2 (Purple Stickman) */}
            <g
              transform={`translate(${posX_B}, 220)`}
              filter="url(#glowPurple)"
              className="transition-transform duration-75"
            >
              {/* Crest Avatar above head */}
              <circle cx="0" cy="-80" r="14" fill="#c084fc" opacity="0.3" />
              <text
                x="0"
                y="-75"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#ffffff"
                fontFamily="sans-serif"
              >
                P2
              </text>

              {/* Head */}
              <circle
                cx="0"
                cy="-48"
                r="11"
                fill="#ffffff"
                stroke="#c084fc"
                strokeWidth="2.5"
              />
              {/* Headband */}
              <path d="M -11 -48 L 11 -48" stroke="#c084fc" strokeWidth="3" />
              <path d="M 10 -46 L 16 -40" stroke="#c084fc" strokeWidth="2.5" />

              {/* Body & Limbs */}
              {poseB === 'victory' ? (
                <>
                  {/* Spine */}
                  <line x1="0" y1="-37" x2="0" y2="-5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Victory Raised Arms */}
                  <line x1="0" y1="-30" x2="-18" y2="-55" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="-30" x2="18" y2="-55" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                  {/* Golden Trophy */}
                  <circle cx="0" cy="-66" r="7" fill="#fbbf24" />
                  {/* Legs */}
                  <line x1="0" y1="-5" x2="-15" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="0" y1="-5" x2="15" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </>
              ) : poseB === 'knockout' ? (
                <>
                  {/* Knocked down flat */}
                  <line x1="-15" y1="14" x2="20" y2="14" stroke="#8b949e" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="-22" y1="18" x2="-10" y2="14" stroke="#8b949e" strokeWidth="3" strokeLinecap="round" />
                  <line x1="15" y1="14" x2="25" y2="6" stroke="#8b949e" strokeWidth="3" strokeLinecap="round" />
                  {/* Dizzy stars */}
                  <text x="0" y="0" fontSize="12" fill="#fbbf24">💫</text>
                </>
              ) : poseB === 'dragon' || poseB === 'kick' ? (
                <>
                  {/* Spine lunging left */}
                  <line x1="0" y1="-37" x2="8" y2="-5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* High flying kick toward left */}
                  <line x1="8" y1="-5" x2="-28" y2="-22" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                  <line x1="8" y1="-5" x2="16" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Kick spark */}
                  <circle cx="-32" cy="-22" r="10" fill="#c084fc" opacity="0.6" />
                  {/* Arms */}
                  <line x1="0" y1="-30" x2="-14" y2="-32" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="-30" x2="12" y2="-18" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Standard combat stance / walk facing left */}
                  <line x1="0" y1="-37" x2="0" y2="-5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Arms guard */}
                  <line x1="0" y1="-30" x2="-14" y2="-34" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="-30" x2="10" y2="-20" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
                  {/* Legs */}
                  <line x1="0" y1="-5" x2="-12" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="0" y1="-5" x2="12" y2="20" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </>
              )}
            </g>

            {/* Hit Sparks & Particle Clashes */}
            {(phase === 'round1' || phase === 'round2' || phase === 'finisher') && (
              <g transform="translate(320, 180)">
                <circle cx="0" cy="0" r="14" fill="#fbbf24" opacity="0.7" />
                <path d="M -18 0 L 18 0 M 0 -18 L 0 18 M -12 -12 L 12 12 M -12 12 L 12 -12" stroke="#ffffff" strokeWidth="2.5" />
              </g>
            )}
          </svg>
        </div>

        {/* Bottom Arena Footer Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              {winner === 'A'
                ? `@${userA.user.login} Leads (${winsA} – ${winsB})`
                : winner === 'B'
                ? `@${userB.user.login} Leads (${winsB} – ${winsA})`
                : `Tied Battle (${winsA} – ${winsB})`}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={resetFight}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all active:scale-95 cursor-pointer min-h-[40px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Fight</span>
            </button>

            {phase !== 'victory' && phase !== 'ko' && (
              <button
                onClick={handleSkipToFinisher}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#8b949e] hover:text-white border border-white/10 transition-all active:scale-95 cursor-pointer min-h-[40px]"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip to K.O.</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-[#2997ff] hover:bg-[#3ea3ff] text-white transition-all active:scale-95 cursor-pointer min-h-[40px]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
