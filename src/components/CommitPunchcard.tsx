import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Clock, Calendar, Zap, Moon, Sun } from 'lucide-react';
import type { DayActivity, HourActivity } from '../types/github';

interface CommitPunchcardProps {
  dayActivity: DayActivity[];
  hourActivity: HourActivity[];
}

export const CommitPunchcard: React.FC<CommitPunchcardProps> = ({
  dayActivity,
  hourActivity,
}) => {
  const maxDay = [...dayActivity].sort((a, b) => b.events - a.events)[0];
  const maxHour = [...hourActivity].sort((a, b) => b.events - a.events)[0];

  const getPersona = () => {
    if (!maxHour || maxHour.events === 0) return { title: 'Balanced Coder', icon: Sun, color: 'text-amber-400' };
    const h = maxHour.hour;
    if (h >= 0 && h < 6) return { title: 'Late Night Owl', icon: Moon, color: 'text-purple-400' };
    if (h >= 6 && h < 12) return { title: 'Early Morning Bird', icon: Sun, color: 'text-amber-400' };
    if (h >= 12 && h < 18) return { title: 'Afternoon Architect', icon: Zap, color: 'text-[#2997ff]' };
    return { title: 'Evening Hacker', icon: Moon, color: 'text-indigo-400' };
  };

  const persona = getPersona();
  const PersonaIcon = persona.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
      {/* Day of Week Widget */}
      <div className="apple-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2997ff]" />
              Day of Week Cadence
            </h2>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Event frequency by day of the week
            </p>
          </div>
          {maxDay && maxDay.events > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-[#2997ff] border border-blue-500/20 font-mono">
              Peak: {maxDay.day}
            </span>
          )}
        </div>

        <div className="mt-5 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayActivity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#8b949e" fontSize={11} tickLine={false} />
              <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="apple-glass-dock px-3 py-1.5 rounded-xl text-xs font-mono">
                        <span className="font-semibold text-white">{d.day}:</span>{' '}
                        <span className="text-[#2997ff] font-bold">{d.events} events</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="events" fill="#2997ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 24-Hour Productivity Clock Widget */}
      <div className="apple-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              24-Hour Productivity Clock
            </h2>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Habits across 24 hours (UTC/Local)
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1 ${persona.color}`}>
            <PersonaIcon className="w-3.5 h-3.5" />
            {persona.title}
          </span>
        </div>

        <div className="mt-5 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourActivity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="hourColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                stroke="#8b949e"
                fontSize={10}
                tickLine={false}
                interval={3}
              />
              <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const h = payload[0].payload;
                    return (
                      <div className="apple-glass-dock px-3 py-1.5 rounded-xl text-xs font-mono">
                        <span className="font-semibold text-white">{h.label}:</span>{' '}
                        <span className="text-indigo-400 font-bold">{h.events} events</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#hourColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
