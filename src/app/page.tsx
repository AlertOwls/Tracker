'use client';

import React, { useState, useEffect } from 'react';
import { AppSettings, DailyLog } from '@/lib/types';
import {
  fetchDailyLogs,
  saveDailyLog,
  fetchAppSettings,
  saveAppSettings,
} from '@/lib/storage';
import { generate13Cycles } from '@/lib/cycles';
import { Header } from '@/components/Header';
import { PredictiveBanner } from '@/components/PredictiveBanner';
import { TodaySchedule } from '@/components/TodaySchedule';
import { DailyLogModal } from '@/components/DailyLogModal';
import { CycleNavigator } from '@/components/CycleNavigator';
import { HistoryTable } from '@/components/HistoryTable';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { SettingsPanel } from '@/components/SettingsPanel';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { Database, PlusCircle } from 'lucide-react';

export default function TrackerDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    id: 1,
    paying_users: 54,
    arpu_usd: 15,
    usd_inr_rate: 95.9,
    leave_bank_total: 28,
    projected_prelims_base: 155,
  });

  const [selectedCycleNum, setSelectedCycleNum] = useState<number | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setSupabaseActive(isSupabaseConfigured());

      const [loadedLogs, loadedSettings] = await Promise.all([fetchDailyLogs(), fetchAppSettings()]);

      setLogs(loadedLogs);
      setSettings(loadedSettings);
      setIsLoading(false);
    }

    loadData();
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = await saveAppSettings(newSettings);
    setSettings(updated);
  };

  const handleSaveLog = async (logData: Partial<DailyLog> & { date: string }) => {
    const savedLog = await saveDailyLog(logData);
    setLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.date === savedLog.date);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = savedLog;
        return copy;
      }
      return [savedLog, ...prev];
    });
  };

  const todayLog = logs.find((l) => l.date === selectedDate) || null;

  const cycleFilteredLogs =
    selectedCycleNum === null
      ? logs
      : logs.filter((l) => {
          const cycles = generate13Cycles(selectedDate);
          const targetCycle = cycles.find((c) => c.number === selectedCycleNum);
          if (!targetCycle) return true;
          return l.date >= targetCycle.startDate && l.date <= targetCycle.endDate;
        });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 text-sm font-mono">
        Loading Tracker Executive OS…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400">
        <div className="flex items-center gap-2">
          <Database className={`h-3.5 w-3.5 ${supabaseActive ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>
            {supabaseActive ? 'Supabase PostgreSQL' : 'Local cache'} · tracker.alertowls.com
          </span>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>

      <Header
        settings={settings}
        logs={logs}
        onUpdateSettings={handleUpdateSettings}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      <PredictiveBanner logs={logs} settings={settings} />

      <AnalyticsCharts logs={logs} settings={settings} />

      <TodaySchedule todayLog={todayLog} selectedDate={selectedDate} onSaveLog={handleSaveLog} />

      <CycleNavigator
        selectedCycleNum={selectedCycleNum}
        onSelectCycle={(num) => setSelectedCycleNum(num)}
        logs={logs}
        currentDateStr={selectedDate}
      />

      <HistoryTable
        logs={cycleFilteredLogs}
        selectedCycleNum={selectedCycleNum}
        onEditLog={(logToEdit) => {
          setSelectedDate(logToEdit.date);
          setIsLogModalOpen(true);
        }}
        onQuickLog={() => setIsLogModalOpen(true)}
      />

      <SettingsPanel
        settings={settings}
        logs={logs}
        onUpdateSettings={handleUpdateSettings}
        onRestore={(restoredLogs, restoredSettings) => {
          setLogs(restoredLogs);
          setSettings(restoredSettings);
        }}
      />

      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        existingLogs={logs}
        onSaveLog={handleSaveLog}
        initialDate={selectedDate}
      />

      <button
        type="button"
        onClick={() => setIsLogModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 flex items-center justify-center sm:hidden active:scale-95"
        aria-label="Quick log"
      >
        <PlusCircle className="h-6 w-6" />
      </button>

      <footer className="pt-8 pb-4 text-center text-xs text-zinc-500 border-t border-zinc-900">
        © 2026 Alertowls · Tracker Executive OS · Cycle 1 starts Sep 28, 2026
      </footer>
    </div>
  );
}
