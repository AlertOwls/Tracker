'use client';

import React from 'react';
import { CycleInfo, DailyLog } from '@/lib/types';
import { generate13Cycles } from '@/lib/cycles';
import { CYCLE_ROADMAP } from '@/data/roadmap';
import { Calendar, CheckCircle2, Moon, Scale, Sparkles, Target, BookOpen, Rocket } from 'lucide-react';

interface CycleNavigatorProps {
  selectedCycleNum: number | null; // null means 'All Cycles'
  onSelectCycle: (num: number | null) => void;
  logs: DailyLog[];
  currentDateStr: string;
}

export function CycleNavigator({
  selectedCycleNum,
  onSelectCycle,
  logs,
  currentDateStr,
}: CycleNavigatorProps) {
  const cycles = generate13Cycles(currentDateStr);
  const currentActiveCycle = cycles.find((c) => c.isCurrent);

  // Compute stats for selected cycle (or all)
  const filteredLogs = logs.filter((log) => {
    if (selectedCycleNum === null) return true;
    const cycle = cycles.find((c) => c.number === selectedCycleNum);
    if (!cycle) return true;
    return log.date >= cycle.startDate && log.date <= cycle.endDate;
  });

  const validWeights = filteredLogs.map((l) => l.weight).filter((w): w is number => w !== null);
  const avgWeight =
    validWeights.length > 0
      ? (validWeights.reduce((a, b) => a + b, 0) / validWeights.length).toFixed(1)
      : null;

  const validSleeps = filteredLogs.map((l) => l.sleep_hours).filter((s): s is number => s !== null);
  const avgSleep =
    validSleeps.length > 0
      ? (validSleeps.reduce((a, b) => a + b, 0) / validSleeps.length).toFixed(1)
      : null;

  const onTrackCount = filteredLogs.filter(
    (l) => l.day_status === 'On-Track' || l.day_status === 'Recovered'
  ).length;

  const activeRoadmap =
    selectedCycleNum != null
      ? CYCLE_ROADMAP.find((c) => c.number === selectedCycleNum)
      : currentActiveCycle
        ? CYCLE_ROADMAP.find((c) => c.number === currentActiveCycle.number)
        : CYCLE_ROADMAP[0];

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              50-Week Cycle Navigator (13 x 4-Week Chunks)
            </h2>
            {currentActiveCycle && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Active: Cycle {currentActiveCycle.number}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sep 28, 2026 – Sep 26, 2027 • Standardized 4-week execution cycles for peak output.
          </p>
        </div>

        {/* Quick Filter Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectCycle(null)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
              selectedCycleNum === null
                ? 'bg-blue-600 text-white border-blue-500 font-bold'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            All Cycles ({logs.length})
          </button>
          {currentActiveCycle && (
            <button
              onClick={() => onSelectCycle(currentActiveCycle.number)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                selectedCycleNum === currentActiveCycle.number
                  ? 'bg-purple-600 text-white border-purple-500 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              Current Cycle {currentActiveCycle.number}
            </button>
          )}
        </div>
      </div>

      {/* Cycle Tabs Horizontal Slider */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {cycles.map((cycle) => {
          const isSelected = selectedCycleNum === cycle.number;
          const isCurrent = cycle.isCurrent;

          return (
            <button
              key={cycle.number}
              onClick={() => onSelectCycle(cycle.number)}
              className={`flex-shrink-0 min-w-[130px] p-2.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-950/60 to-zinc-950 border-purple-500 text-white shadow-lg shadow-purple-950/30'
                  : isCurrent
                  ? 'bg-zinc-950 border-purple-500/50 text-purple-300 hover:border-purple-400'
                  : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono">C{cycle.number}</span>
                {isCurrent && (
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                {cycle.startDate.slice(5)} to {cycle.endDate.slice(5)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Cycle Summary Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 block font-medium">Logs in View</span>
            <span className="text-sm font-bold font-mono text-white">{filteredLogs.length} Days</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 block font-medium">Avg Weight</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {avgWeight ? `${avgWeight} kg` : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Moon className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 block font-medium">Avg Sleep</span>
            <span className="text-sm font-bold font-mono text-indigo-400">
              {avgSleep ? `${avgSleep} hrs` : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-500 block font-medium">On-Track Days</span>
            <span className="text-sm font-bold font-mono text-purple-400">
              {onTrackCount} / {filteredLogs.length}
            </span>
          </div>
        </div>
      </div>

      {activeRoadmap && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
          <div>
            <p className="text-xs font-bold text-white mb-2">{activeRoadmap.title}</p>
            <p className="text-[11px] text-zinc-400 flex items-start gap-2 mb-2">
              <BookOpen className="h-3.5 w-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
              {activeRoadmap.upscFocus}
            </p>
            <p className="text-[11px] text-zinc-400 flex items-start gap-2">
              <Rocket className="h-3.5 w-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              {activeRoadmap.alertowlsMilestone}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-500 font-semibold mb-2">Weekly assignments</p>
            <ul className="space-y-1">
              {activeRoadmap.weeklyTopics.map((topic) => (
                <li key={topic} className="text-[11px] text-zinc-300 font-mono">{topic}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
