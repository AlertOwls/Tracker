'use client';

import React, { useState, useEffect } from 'react';
import { DailyLog, DayStatus } from '@/lib/types';
import {
  X,
  Calendar,
  Scale,
  Moon,
  Rocket,
  Music,
  Dumbbell,
  BookOpen,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingLogs: DailyLog[];
  onSaveLog: (log: Partial<DailyLog> & { date: string }) => void;
  initialDate?: string;
}

export function DailyLogModal({
  isOpen,
  onClose,
  existingLogs,
  onSaveLog,
  initialDate,
}: DailyLogModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(initialDate || todayStr);
  const [weight, setWeight] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<string>('');
  const [founderDone, setFounderDone] = useState<boolean>(false);
  const [founderMinutes, setFounderMinutes] = useState<string>('60');
  const [upscDone, setUpscDone] = useState<boolean>(false);
  const [physicalDone, setPhysicalDone] = useState<boolean>(false);
  const [musicDone, setMusicDone] = useState<boolean>(false);
  const [upscTopic, setUpscTopic] = useState<string>('');
  const [dayStatus, setDayStatus] = useState<DayStatus>('On-Track');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    const existing = existingLogs.find((l) => l.date === date);
    if (existing) {
      setWeight(existing.weight !== null ? String(existing.weight) : '');
      setSleepHours(existing.sleep_hours !== null ? String(existing.sleep_hours) : '');
      setFounderDone(existing.founder_done || false);
      setFounderMinutes(String(existing.founder_minutes ?? (existing.founder_done ? 60 : 0)));
      setUpscDone(existing.upsc_done || false);
      setPhysicalDone(existing.physical_done || false);
      setMusicDone(existing.music_done || false);
      setUpscTopic(existing.upsc_topic || '');
      setDayStatus(existing.day_status || 'On-Track');
      setNotes(existing.notes || '');
    } else {
      setWeight('');
      setSleepHours('');
      setFounderDone(false);
      setFounderMinutes('60');
      setUpscDone(false);
      setPhysicalDone(false);
      setMusicDone(false);
      setUpscTopic('');
      setDayStatus('On-Track');
      setNotes('');
    }
  }, [date, existingLogs]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(founderMinutes, 10) || 0;

    onSaveLog({
      date,
      weight: weight ? parseFloat(weight) : null,
      sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
      founder_done: founderDone || minutes > 0,
      founder_minutes: minutes,
      upsc_done: upscDone,
      physical_done: physicalDone,
      music_done: musicDone,
      upsc_topic: upscTopic || null,
      day_status: dayStatus,
      notes: notes || null,
    });

    toast.success(`Log saved for ${date}`);
    onClose();
  };

  const getStatusBadge = (status: DayStatus) => {
    switch (status) {
      case 'On-Track':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Leave':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Recovered':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Slip':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 px-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white font-mono">Rapid Daily Logger</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Scale className="h-3.5 w-3.5 text-emerald-400" />
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="64.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                Sleep (hrs)
              </label>
              <input
                type="number"
                step="0.25"
                placeholder="7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Founder', on: founderDone, set: setFounderDone, icon: Rocket, color: 'purple' },
              { label: 'UPSC', on: upscDone, set: setUpscDone, icon: BookOpen, color: 'sky' },
              { label: 'Physical', on: physicalDone, set: setPhysicalDone, icon: Dumbbell, color: 'emerald' },
              { label: 'Music', on: musicDone, set: setMusicDone, icon: Music, color: 'amber' },
            ].map(({ label, on, set, icon: Icon, color }) => (
              <button
                key={label}
                type="button"
                onClick={() => set(!on)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all border-zinc-800 ${
                  on ? 'bg-zinc-900 ring-1 ring-emerald-500/40' : 'bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${on ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
                <CheckCircle2 className={`h-4 w-4 ${on ? 'text-emerald-400' : 'text-zinc-600'}`} />
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Founder minutes</label>
            <input
              type="number"
              min={0}
              value={founderMinutes}
              onChange={(e) => setFounderMinutes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-mono text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Day Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['On-Track', 'Leave', 'Recovered', 'Slip'] as DayStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setDayStatus(status)}
                  className={`py-2 rounded-xl text-xs font-semibold border ${
                    dayStatus === status ? getStatusBadge(status) : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">UPSC topic / PYQs</label>
            <input
              type="text"
              value={upscTopic}
              onChange={(e) => setUpscTopic(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
              <FileText className="h-3.5 w-3.5" />
              Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-zinc-400">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
