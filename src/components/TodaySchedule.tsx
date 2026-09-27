'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DailyLog, ScheduleArchetype } from '@/lib/types';
import { SCHEDULE_ARCHETYPES, getArchetypeForDate } from '@/lib/schedules';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  Building2,
  Laptop,
  Flame,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface TodayScheduleProps {
  todayLog: DailyLog | null;
  selectedDate: string;
  onSaveLog: (updatedLog: Partial<DailyLog> & { date: string }) => void;
}

export function TodaySchedule({ todayLog, selectedDate, onSaveLog }: TodayScheduleProps) {
  const currentDateObj = new Date(selectedDate + 'T00:00:00');
  const autoArchetype = getArchetypeForDate(currentDateObj);
  const [selectedArchetype, setSelectedArchetype] = useState<ScheduleArchetype>(autoArchetype);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [localCheckboxes, setLocalCheckboxes] = useState<Record<string, boolean>>(
    todayLog?.schedule_checkboxes || {}
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedArchetype(getArchetypeForDate(new Date(selectedDate + 'T00:00:00')));
  }, [selectedDate]);

  useEffect(() => {
    setLocalCheckboxes(todayLog?.schedule_checkboxes || {});
  }, [todayLog?.schedule_checkboxes, selectedDate]);

  const archetypeConfig = SCHEDULE_ARCHETYPES[selectedArchetype];
  const totalItems = archetypeConfig.items.length;
  const completedCount = archetypeConfig.items.filter((item) => localCheckboxes[item.id]).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const persistCheckboxes = useCallback(
    (next: Record<string, boolean>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSaveLog({
          date: selectedDate,
          schedule_checkboxes: next,
        });
      }, 400);
    },
    [onSaveLog, selectedDate]
  );

  const handleToggleTask = (itemId: string) => {
    const nextCheckboxes = {
      ...localCheckboxes,
      [itemId]: !localCheckboxes[itemId],
    };
    setLocalCheckboxes(nextCheckboxes);
    persistCheckboxes(nextCheckboxes);
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'health':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'work':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'study':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'leisure':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50';
    }
  };

  const getArchetypeIcon = (key: ScheduleArchetype) => {
    switch (key) {
      case 'in-office':
        return <Building2 className="h-4 w-4 text-blue-400" />;
      case 'wfh':
        return <Laptop className="h-4 w-4 text-emerald-400" />;
      case 'saturday':
        return <Flame className="h-4 w-4 text-purple-400" />;
      case 'sunday':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
    }
  };

  const dayTypeLabel =
    selectedArchetype === 'in-office'
      ? 'In-Office'
      : selectedArchetype === 'wfh'
        ? 'WFH'
        : selectedArchetype === 'saturday'
          ? 'Saturday'
          : 'Sunday';

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarIcon className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Today&apos;s Operational Cockpit</h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {dayTypeLabel}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono">{selectedDate}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Time-slotted tasks · debounced sync to daily_logs.schedule_checkboxes</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 hover:border-zinc-700 transition-colors"
          >
            {getArchetypeIcon(selectedArchetype)}
            <span>{archetypeConfig.name.split(' (')[0]}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-30 p-1 space-y-1">
              {(Object.keys(SCHEDULE_ARCHETYPES) as ScheduleArchetype[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedArchetype(key);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedArchetype === key
                      ? 'bg-emerald-600/20 text-emerald-400 font-semibold border border-emerald-500/30'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getArchetypeIcon(key)}
                    <span>{SCHEDULE_ARCHETYPES[key].name}</span>
                  </div>
                  {autoArchetype === key && <span className="text-[10px] text-zinc-500 font-mono">Auto</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            Routine Execution Progress
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {completedCount} / {totalItems} ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
          <div
            className="bg-gradient-to-r from-emerald-600 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {archetypeConfig.items.map((item) => {
          const isDone = Boolean(localCheckboxes[item.id]);

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleToggleTask(item.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleToggleTask(item.id)}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-zinc-950/40 border-zinc-800/50 opacity-75'
                  : 'bg-zinc-950/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400" />
                )}

                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium transition-all ${
                      isDone ? 'line-through text-zinc-500' : 'text-zinc-100'
                    }`}
                  >
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      {item.time}
                    </span>
                    <span className="text-[10px] text-zinc-500">({item.duration})</span>
                  </div>
                </div>
              </div>

              {item.category && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadge(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
