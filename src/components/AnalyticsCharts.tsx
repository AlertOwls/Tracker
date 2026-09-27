'use client';

import React from 'react';
import { AppSettings, DailyLog } from '@/lib/types';
import { computePredictiveMetrics } from '@/lib/predictive';
import { Activity, Moon, Scale, Sparkles, TrendingUp } from 'lucide-react';

interface AnalyticsChartsProps {
  logs: DailyLog[];
  settings: AppSettings;
}

export function AnalyticsCharts({ logs, settings }: AnalyticsChartsProps) {
  const predictive = computePredictiveMetrics(logs, settings);
  // Sort logs by date ascending for charts
  const chronLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date)).slice(-14); // Last 14 entries

  const onTrackCount = logs.filter((l) => l.day_status === 'On-Track').length;
  const leaveCount = logs.filter((l) => l.day_status === 'Leave').length;
  const recoveredCount = logs.filter((l) => l.day_status === 'Recovered').length;
  const slipCount = logs.filter((l) => l.day_status === 'Slip').length;
  const total = logs.length || 1;

  const founderCount = logs.filter((l) => l.founder_done).length;
  const physicalCount = logs.filter((l) => l.physical_done).length;
  const musicCount = logs.filter((l) => l.music_done).length;
  const upscCount = logs.filter((l) => l.upsc_done).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Executive Status Distribution */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-400" />
            Execution Breakdown
          </span>
          <span className="text-[10px] text-zinc-500">{logs.length} Total Logs</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> On-Track
            </span>
            <span className="font-mono text-zinc-300">{onTrackCount} ({Math.round((onTrackCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(onTrackCount / total) * 100}%` }} />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-sky-400 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> Recovered
            </span>
            <span className="font-mono text-zinc-300">{recoveredCount} ({Math.round((recoveredCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: `${(recoveredCount / total) * 100}%` }} />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-purple-400 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" /> Leave
            </span>
            <span className="font-mono text-zinc-300">{leaveCount} ({Math.round((leaveCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(leaveCount / total) * 100}%` }} />
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-rose-400 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Slip
            </span>
            <span className="font-mono text-zinc-300">{slipCount} ({Math.round((slipCount / total) * 100)}%)</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-rose-400 h-full rounded-full" style={{ width: `${(slipCount / total) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Habit Velocity Widget */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Core Habit Consistency
          </span>
          <span className="text-[10px] text-zinc-500">All Time</span>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300">Founder Sprint Velocity</p>
              <p className="text-[10px] text-zinc-500">Alertowls core product building</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-purple-400">{founderCount}</span>
              <span className="text-[10px] text-zinc-500 block">/ {total} Days</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-300">Physical blocks</p>
              <p className="text-[10px] text-zinc-500">Badminton, swimming, strikes</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-emerald-400">{physicalCount}</span>
              <span className="text-[10px] text-zinc-500 block">/ {total}</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-300">Music / Riyaz</p>
              <p className="text-[10px] text-zinc-500">Vocal index: {predictive.vocalStaminaIndex}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-amber-400">{musicCount}</span>
              <span className="text-[10px] text-zinc-500 block">UPSC: {upscCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weight & Sleep Quick Sparkline view */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-sky-400" />
            Recent Weight & Sleep Sparks
          </span>
          <span className="text-[10px] text-zinc-500">Last 14 Days</span>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-[11px] text-zinc-400 flex items-center justify-between font-mono">
            <span>Weight (kg)</span>
            <span className="text-sky-400 font-bold">
              {chronLogs.filter((l) => l.weight !== null).slice(-1)[0]?.weight || '—'} kg
            </span>
          </p>

          <div className="flex items-end gap-1 h-12 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
            {chronLogs.map((log) => {
              const heightPct = log.weight ? Math.min(100, Math.max(20, ((log.weight - 60) / 10) * 100)) : 10;
              return (
                <div
                  key={log.date}
                  className="flex-1 bg-sky-500/80 hover:bg-sky-400 rounded-t transition-all"
                  style={{ height: `${heightPct}%` }}
                  title={`${log.date}: ${log.weight} kg`}
                />
              );
            })}
          </div>

          <p className="text-[11px] text-zinc-400 flex items-center justify-between font-mono pt-1">
            <span>Sleep (hrs)</span>
            <span className="text-indigo-400 font-bold">
              {chronLogs.filter((l) => l.sleep_hours !== null).slice(-1)[0]?.sleep_hours || '—'} hrs
            </span>
          </p>
          <div className="flex items-end gap-1 h-10 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {chronLogs.map((log) => {
              const heightPct = log.sleep_hours ? Math.min(100, Math.max(20, (log.sleep_hours / 10) * 100)) : 10;
              return (
                <div
                  key={log.date}
                  className="flex-1 bg-indigo-500/80 hover:bg-indigo-400 rounded-t transition-all"
                  style={{ height: `${heightPct}%` }}
                  title={`${log.date}: ${log.sleep_hours} hrs sleep`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
