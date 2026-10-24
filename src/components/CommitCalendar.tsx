import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  GitCommitHorizontal,
  Flame,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  Layers,
  Calendar as CalendarIcon,
} from 'lucide-react';
import type { ContributionDay } from '../types/github';

interface CommitCalendarProps {
  contributions?: ContributionDay[];
  totalContributions?: number;
  yearlyContributions?: Record<string, number>;
  username: string;
}

interface YearGridProps {
  year: string;
  days: ContributionDay[];
  yearTotal: number;
  onHoverDay: (
    day: { date: string; count: number; level: number; x: number; y: number } | null
  ) => void;
  showYearHeader?: boolean;
}

const getCellColorClass = (level: number) => {
  switch (level) {
    case 1:
      return 'bg-[#0e4429] dark:bg-[#0e4429] border-[#0e4429] text-white';
    case 2:
      return 'bg-[#006d32] dark:bg-[#006d32] border-[#006d32] text-white';
    case 3:
      return 'bg-[#26a641] dark:bg-[#26a641] border-[#26a641] text-white shadow-xs shadow-green-500/20';
    case 4:
      return 'bg-[#39d353] dark:bg-[#39d353] border-[#39d353] text-white shadow-sm shadow-green-400/40';
    default:
      return 'bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-70';
  }
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Renders a single 52/53-week GitHub contribution grid for a given year.
 */
const SingleYearGrid: React.FC<YearGridProps> = ({
  year,
  days,
  yearTotal,
  onHoverDay,
  showYearHeader = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Group days into columns of 7 (Sunday to Saturday)
  const { weeks, monthLabels } = useMemo(() => {
    if (days.length === 0) return { weeks: [], monthLabels: [] };

    // Sort chronologically
    const sorted = [...days].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstDay = new Date(sorted[0].date);
    const dayOffset = firstDay.getDay(); // 0 is Sunday

    // Pad beginning so week starts on Sunday
    const padded: Array<ContributionDay | null> = Array(dayOffset).fill(null);
    sorted.forEach((d) => padded.push(d));

    // Chunk into columns of 7 days
    const cols: Array<Array<ContributionDay | null>> = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }

    // Determine month headers
    const labels: Array<{ month: string; colIndex: number }> = [];
    let lastMonth = -1;

    cols.forEach((col, colIdx) => {
      const validDay = col.find((d) => d !== null);
      if (validDay) {
        const m = new Date(validDay.date).getMonth();
        if (m !== lastMonth) {
          labels.push({
            month: new Date(validDay.date).toLocaleString('default', { month: 'short' }),
            colIndex: colIdx,
          });
          lastMonth = m;
        }
      }
    });

    return { weeks: cols, monthLabels: labels };
  }, [days]);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      // Auto-scroll to rightmost (most recent weeks) on initial mount
      el.scrollLeft = el.scrollWidth;
      checkScroll();
    }
  }, [weeks]);

  const handleScrollNudge = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative group/grid">
      {/* Optional Year Header for Stacked Mode */}
      {showYearHeader && (
        <div className="flex items-center justify-between mb-2.5 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold font-mono text-[var(--text-primary)] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              {year}
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">
              <span className="font-bold text-[var(--text-primary)]">
                {yearTotal.toLocaleString()}
              </span>{' '}
              contributions in {year}
            </span>
          </div>
        </div>
      )}

      {/* Left / Right Scroll Arrow Buttons */}
      <div className="absolute right-0 -top-8 hidden sm:flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => handleScrollNudge('left')}
          disabled={!canScrollLeft}
          className="p-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer transition-all active:scale-95"
          title="Scroll left"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleScrollNudge('right')}
          disabled={!canScrollRight}
          className="p-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 cursor-pointer transition-all active:scale-95"
          title="Scroll right"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Scroll Shadow Indicators */}
      {canScrollLeft && (
        <div className="absolute left-6 top-6 bottom-2 w-8 bg-gradient-to-r from-[var(--bg-card)] to-transparent pointer-events-none z-10" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-6 bottom-2 w-8 bg-gradient-to-l from-[var(--bg-card)] to-transparent pointer-events-none z-10" />
      )}

      {/* Heatmap Grid Track */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="overflow-x-auto pb-2 pt-1 transition-all"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border-subtle) transparent',
        }}
      >
        <div className="inline-block min-w-full">
          {/* Months Header Row */}
          <div className="flex text-[11px] font-mono text-[var(--text-secondary)] mb-1.5 pl-7 select-none">
            <div
              className="relative h-4 w-full"
              style={{ minWidth: `${Math.max(53, weeks.length) * 14}px` }}
            >
              {monthLabels.map((m, i) => (
                <span
                  key={`${m.month}-${i}`}
                  className="absolute font-semibold text-[10px] uppercase tracking-wider"
                  style={{ left: `${m.colIndex * 14}px` }}
                >
                  {m.month}
                </span>
              ))}
            </div>
          </div>

          {/* Grid with Day of Week Axis */}
          <div className="flex items-start gap-2">
            {/* Day Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between h-[96px] sm:h-[105px] text-[9px] font-mono text-[var(--text-secondary)] pr-1 select-none py-0.5 shrink-0">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Columns of 7 Squares */}
            <div className="flex gap-[2.5px] sm:gap-[3px] items-center">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[2.5px] sm:gap-[3px]">
                  {week.map((day, rowIdx) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${rowIdx}`}
                          className="w-[10px] h-[10px] sm:w-[11.5px] sm:h-[11.5px] rounded-[2.5px] opacity-0 pointer-events-none"
                        />
                      );
                    }

                    const colorClass = getCellColorClass(day.level);

                    return (
                      <div
                        key={day.date}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          onHoverDay({
                            ...day,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => onHoverDay(null)}
                        onClick={() => {
                          onHoverDay({
                            ...day,
                            x: window.innerWidth / 2,
                            y: 120,
                          });
                        }}
                        className={`w-[10px] h-[10px] sm:w-[11.5px] sm:h-[11.5px] rounded-[2.5px] border cursor-pointer transition-all duration-150 hover:scale-135 hover:z-20 ${colorClass}`}
                        data-date={day.date}
                        data-count={day.count}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CommitCalendar: React.FC<CommitCalendarProps> = ({
  contributions,
  totalContributions,
  yearlyContributions,
  username,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    level: number;
    x: number;
    y: number;
  } | null>(null);

  // Group raw contributions into years
  const { yearGroups, availableYears } = useMemo(() => {
    const groups: Record<string, ContributionDay[]> = {};

    if (contributions && contributions.length > 0) {
      contributions.forEach((day) => {
        const year = day.date.split('-')[0];
        if (year) {
          if (!groups[year]) groups[year] = [];
          groups[year].push(day);
        }
      });
    }

    // Determine available years list (sorted descending: e.g. 2026, 2025, 2024...)
    let years = Object.keys(groups);

    if (yearlyContributions) {
      Object.keys(yearlyContributions).forEach((y) => {
        if (!years.includes(y)) years.push(y);
      });
    }

    if (years.length === 0) {
      const curYear = new Date().getFullYear();
      years = [curYear.toString(), (curYear - 1).toString(), (curYear - 2).toString()];
    }

    years.sort((a, b) => Number(b) - Number(a));

    return { yearGroups: groups, availableYears: years };
  }, [contributions, yearlyContributions]);

  // Selected year state or 'all' for stacked mode
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return availableYears[0] || new Date().getFullYear().toString();
  });

  // Ensure selected year is in availableYears if roster changes
  useEffect(() => {
    if (selectedYear !== 'all' && !availableYears.includes(selectedYear) && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Compute stats for current view
  const currentDays = useMemo(() => {
    if (selectedYear === 'all') {
      return contributions || [];
    }
    return yearGroups[selectedYear] || [];
  }, [selectedYear, yearGroups, contributions]);

  const activeStats = useMemo(() => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let computedTotal = 0;

    // Traverse chronologically
    const sorted = [...currentDays].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const day of sorted) {
      computedTotal += day.count;
      if (day.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current streak from newest backwards
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].count > 0) {
        currentStreak++;
      } else {
        if (i === sorted.length - 1) continue;
        break;
      }
    }

    let displayTotal = computedTotal;
    if (selectedYear === 'all') {
      displayTotal =
        totalContributions && totalContributions > 0 ? totalContributions : computedTotal;
    } else if (yearlyContributions && yearlyContributions[selectedYear]) {
      displayTotal = yearlyContributions[selectedYear];
    }

    return {
      total: displayTotal,
      longestStreak: Math.max(longestStreak, currentStreak),
      currentStreak,
    };
  }, [currentDays, selectedYear, totalContributions, yearlyContributions]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5 sm:mt-6">
      <div className="apple-card p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon with Year Switcher & Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-md shadow-emerald-500/15">
              <GitCommitHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  Contribution Activity
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {selectedYear === 'all' ? 'All Years Stacked' : selectedYear}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                <span className="font-semibold text-[var(--text-primary)]">
                  {activeStats.total.toLocaleString()}
                </span>{' '}
                {selectedYear === 'all'
                  ? `contributions across ${availableYears.length} years for`
                  : `contributions in ${selectedYear} for`}{' '}
                <span className="font-mono text-[#2997ff]">@{username}</span>
              </p>
            </div>
          </div>

          {/* Controls: Year Selector Dropdown + Quick Stack Toggle */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Year Dropdown with All Years Option */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="py-1.5 pl-3 pr-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-hidden focus:border-[#2997ff] cursor-pointer min-h-[36px]"
                aria-label="Select contribution year"
              >
                <option value="all">📚 All Years (Stacked)</option>
                {availableYears.map((y) => {
                  const count =
                    yearlyContributions && yearlyContributions[y]
                      ? yearlyContributions[y]
                      : yearGroups[y]?.reduce((acc, d) => acc + d.count, 0) || 0;
                  return (
                    <option key={y} value={y}>
                      {y} ({count.toLocaleString()} commits)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Quick Toggle: Stack All Years vs Single Year */}
            <button
              type="button"
              onClick={() => {
                setSelectedYear(selectedYear === 'all' ? availableYears[0] || '2026' : 'all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer min-h-[36px] active:scale-95 ${
                selectedYear === 'all'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Toggle between single year view and all years stacked"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{selectedYear === 'all' ? 'Single Year' : 'Stack All Years'}</span>
            </button>

            {/* Streaks Callouts */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono">
                <Flame className="w-3 h-3 text-amber-400" />
                <span className="text-[var(--text-secondary)]">Streak:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {activeStats.longestStreak}d
                </span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span className="text-[var(--text-secondary)]">Active:</span>
                <span className="font-bold text-emerald-400">
                  {activeStats.currentStreak}d
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Quick Year Pills Tray (Like GitHub's Year Navigation) */}
        {availableYears.length > 1 && (
          <div className="mt-3 hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-[11px] font-mono uppercase text-[var(--text-secondary)] mr-1 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3 text-[#2997ff]" /> Years:
            </span>
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                selectedYear === 'all'
                  ? 'bg-[#2997ff] text-white font-bold shadow-xs'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All Years (Stacked)
            </button>
            {availableYears.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                  selectedYear === y
                    ? 'bg-[#2997ff] text-white font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Content Section: Single Year View OR Stacked Multi-Year Timeline */}
        <div className="mt-4 space-y-6">
          {selectedYear === 'all' ? (
            /* STACKED TIMELINE: Each Year Rendered Under Each Other */
            <div className="space-y-6 divide-y divide-[var(--border-subtle)]">
              {availableYears.map((y, idx) => {
                const yearDays = yearGroups[y] || [];
                const yearTotal =
                  yearlyContributions && yearlyContributions[y]
                    ? yearlyContributions[y]
                    : yearDays.reduce((acc, d) => acc + d.count, 0);

                return (
                  <div key={y} className={idx > 0 ? 'pt-5' : ''}>
                    <SingleYearGrid
                      year={y}
                      days={yearDays}
                      yearTotal={yearTotal}
                      onHoverDay={setHoveredDay}
                      showYearHeader={true}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* SINGLE YEAR VIEW: Selected Year */
            <SingleYearGrid
              year={selectedYear}
              days={yearGroups[selectedYear] || []}
              yearTotal={activeStats.total}
              onHoverDay={setHoveredDay}
              showYearHeader={false}
            />
          )}
        </div>

        {/* Footer with Legend & Hint */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Info className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Hover or tap any square to inspect daily commits • Use arrows or swipe to scroll</span>
          </div>

          {/* GitHub Standard Contribution Legend */}
          <div className="flex items-center gap-2 font-mono text-[11px] self-end sm:self-auto">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] opacity-70" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] bg-[#0e4429] border border-[#0e4429]" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] bg-[#006d32] border border-[#006d32]" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] bg-[#26a641] border border-[#26a641]" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] bg-[#39d353] border border-[#39d353]" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 rounded-xl bg-[#090d16]/95 border border-white/15 text-white shadow-2xl backdrop-blur-md text-xs font-mono battle-round-slide-down"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 6}px`,
          }}
        >
          <span className="font-bold text-emerald-400">
            {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
          </span>{' '}
          on {formatDate(hoveredDay.date)}
        </div>
      )}
    </div>
  );
};
