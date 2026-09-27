'use client';

import React, { useState } from 'react';
import { DailyLog, DayStatus } from '@/lib/types';
import {
  Calendar,
  Scale,
  Moon,
  Rocket,
  Music,
  BookOpen,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Palmtree,
  FileText,
} from 'lucide-react';

interface HistoryTableProps {
  logs: DailyLog[];
  selectedCycleNum: number | null;
  onEditLog: (log: DailyLog) => void;
  onQuickLog: () => void;
}

export function HistoryTable({
  logs,
  selectedCycleNum,
  onEditLog,
  onQuickLog,
}: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sort logs date descending
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  // Filter logs by search term
  const filteredLogs = sortedLogs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.date.toLowerCase().includes(term) ||
      (log.upsc_topic && log.upsc_topic.toLowerCase().includes(term)) ||
      (log.notes && log.notes.toLowerCase().includes(term)) ||
      log.day_status.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: DayStatus) => {
    switch (status) {
      case 'On-Track':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Leave':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Recovered':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Slip':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const getWeightTrend = (currentIndex: number) => {
    const currentWeight = sortedLogs[currentIndex]?.weight;
    if (currentWeight === null || currentWeight === undefined) return null;

    // Compare to next older log
    const prevLog = sortedLogs[currentIndex + 1];
    if (!prevLog || prevLog.weight === null || prevLog.weight === undefined) return null;

    const diff = Number((currentWeight - prevLog.weight).toFixed(1));
    if (diff > 0) {
      return (
        <span className="inline-flex items-center text-[10px] text-amber-400 font-mono ml-1">
          <ArrowUpRight className="h-3 w-3" />+{diff}
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="inline-flex items-center text-[10px] text-emerald-400 font-mono ml-1">
          <ArrowDownRight className="h-3 w-3" />{diff}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] text-zinc-500 font-mono ml-1">
        <Minus className="h-3 w-3" />0.0
      </span>
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl backdrop-blur-sm space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            Executive History Log Table
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time chronological timeline & habits execution record.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topic, status, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            onClick={onQuickLog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Log</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Weight</th>
              <th className="py-3 px-4">Sleep</th>
              <th className="py-3 px-4">Founder Sprint</th>
              <th className="py-3 px-4">UPSC</th>
              <th className="py-3 px-4">Physical</th>
              <th className="py-3 px-4">Music</th>
              <th className="py-3 px-4">UPSC Topic & Notes</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-zinc-500 font-mono">
                  No daily log entries found matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                  {/* Date */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-white whitespace-nowrap">
                    {log.date}
                  </td>

                  {/* Day Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusBadge(
                        log.day_status
                      )}`}
                    >
                      {log.day_status === 'Leave' && <Palmtree className="h-3 w-3 text-purple-400" />}
                      {log.day_status}
                    </span>
                  </td>

                  {/* Weight */}
                  <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                    {log.weight !== null ? (
                      <span className="flex items-center">
                        <span className="text-white font-bold">{log.weight} kg</span>
                        {getWeightTrend(index)}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Sleep */}
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                    {log.sleep_hours !== null ? (
                      <span className="text-indigo-300 font-semibold">{log.sleep_hours} hrs</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Founder Sprint */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.founder_done ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                        <Rocket className="h-3 w-3" /> Done
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[10px]">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.upsc_done ? (
                      <span className="text-emerald-400 text-[10px] font-bold">✓</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.physical_done ? (
                      <span className="text-emerald-400 text-[10px] font-bold">✓</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {log.music_done ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                        <Music className="h-3 w-3" /> ✓
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* UPSC Topic & Notes */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="space-y-0.5">
                      {log.upsc_topic ? (
                        <p className="text-zinc-200 font-medium truncate flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-sky-400 flex-shrink-0" />
                          <span className="truncate">{log.upsc_topic}</span>
                        </p>
                      ) : (
                        <p className="text-zinc-600 text-[11px]">No topic logged</p>
                      )}

                      {log.notes && (
                        <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                          <FileText className="h-3 w-3 text-zinc-500 flex-shrink-0" />
                          <span className="italic">{log.notes}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEditLog(log)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Edit log"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
