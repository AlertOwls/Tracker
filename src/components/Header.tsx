'use client';

import React, { useState, useEffect } from 'react';
import { AppSettings, DailyLog } from '@/lib/types';
import { computeLeaveBankRemaining } from '@/lib/storage';
import { TARGET_PAID_USERS } from '@/lib/predictive';
import { getNextMilestone } from '@/data/roadmap';
import {
  DollarSign,
  TrendingUp,
  Palmtree,
  PlusCircle,
  Clock,
  Sparkles,
  Users,
  Flag,
} from 'lucide-react';

interface HeaderProps {
  settings: AppSettings;
  logs: DailyLog[];
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenLogModal: () => void;
}

export function Header({ settings, logs, onUpdateSettings, onOpenLogModal }: HeaderProps) {
  const [payingUsersInput, setPayingUsersInput] = useState<number>(settings.paying_users);
  const [arpuInput, setArpuInput] = useState<number>(settings.arpu_usd);
  const [prelimsDays, setPrelimsDays] = useState<number>(0);
  const [mainsDays, setMainsDays] = useState<number>(0);
  const [sprintDays, setSprintDays] = useState<number>(0);
  const [sprintLabel, setSprintLabel] = useState<string>('');

  useEffect(() => {
    setPayingUsersInput(settings.paying_users);
    setArpuInput(settings.arpu_usd);
  }, [settings]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prelimsDate = new Date(2027, 4, 23);
    const mainsDate = new Date(2027, 8, 15);
    const todayIso = today.toISOString().split('T')[0];
    const nextMilestone = getNextMilestone(todayIso);
    const milestoneDate = new Date(nextMilestone.date + 'T00:00:00');

    setPrelimsDays(Math.max(0, Math.ceil((prelimsDate.getTime() - today.getTime()) / 86400000)));
    setMainsDays(Math.max(0, Math.ceil((mainsDate.getTime() - today.getTime()) / 86400000)));
    setSprintDays(Math.max(0, Math.ceil((milestoneDate.getTime() - today.getTime()) / 86400000)));
    setSprintLabel(nextMilestone.label);
  }, []);

  const mrr = payingUsersInput * arpuInput;
  const arr = mrr * 12;
  const arrInr = arr * (settings.usd_inr_rate || 95.9);
  const progressPercent = Math.min(100, Math.round((payingUsersInput / TARGET_PAID_USERS) * 100));
  const leaveRemaining = computeLeaveBankRemaining(logs, settings.leave_bank_total || 28);

  return (
    <header className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-amber-500 to-rose-500 p-[1px] shadow-lg">
              <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Tracker</h1>
                <span className="text-zinc-500">|</span>
                <span className="text-sm font-semibold text-zinc-300">Alertowls Executive OS</span>
              </div>
              <p className="text-xs text-zinc-400">50-week horizon · UPSC 2027 · Venture · Conditioning · Music</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLogModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Rapid Log Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold mb-3">
            <Clock className="h-4 w-4 text-emerald-400" />
            Live Countdowns
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Prelims 2027</span>
              <span className="font-mono font-bold text-emerald-400">{prelimsDays}d</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-400">Mains 2027</span>
              <span className="font-mono font-bold text-sky-400">{mainsDays}d</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-zinc-950 border border-amber-500/20">
              <span className="text-zinc-400 flex items-center gap-1">
                <Flag className="h-3 w-3 text-amber-400" />
                Next Sprint
              </span>
              <span className="font-mono font-bold text-amber-400">{sprintDays}d</span>
            </div>
            <p className="text-[10px] text-zinc-500 truncate" title={sprintLabel}>{sprintLabel}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 lg:col-span-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-3">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              Alertowls · ₹2.5 Cr Exit Path
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {TARGET_PAID_USERS} users @ ${settings.arpu_usd}/mo
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-[10px] uppercase text-zinc-500">Paying Users</label>
              <div className="relative mt-1">
                <Users className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  min={0}
                  value={payingUsersInput}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setPayingUsersInput(val);
                    onUpdateSettings({ paying_users: val });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-2 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-500">ARPU ($)</label>
              <div className="relative mt-1">
                <DollarSign className="h-3.5 w-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={arpuInput}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setArpuInput(val);
                    onUpdateSettings({ arpu_usd: val });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-2 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500">MRR</span>
              <span className="text-base font-mono font-bold text-purple-300 block">${mrr.toLocaleString()}</span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500">ARR USD / INR</span>
              <span className="text-sm font-mono font-bold text-emerald-400 block">${arr.toLocaleString()}</span>
              <span className="text-[11px] font-mono text-amber-400">₹{(arrInr / 100000).toFixed(2)} L</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>{payingUsersInput} / {TARGET_PAID_USERS} paid users</span>
              <span className="text-emerald-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-amber-500 h-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-500">Estimated valuation multiple: 4.0× ARR</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
            <Palmtree className="h-4 w-4 text-amber-400" />
            Leave Bank
          </div>
          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-center">
            <div className="text-2xl font-black font-mono text-amber-400">
              {leaveRemaining} <span className="text-sm text-zinc-400">/ {settings.leave_bank_total}</span>
            </div>
            <p className="text-xs text-zinc-400">Days Left</p>
          </div>
        </div>
      </div>
    </header>
  );
}
