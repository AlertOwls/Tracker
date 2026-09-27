'use client';

import React, { useRef } from 'react';
import { AppSettings, DailyLog } from '@/lib/types';
import { exportBackup, restoreBackup, BackupPayload } from '@/lib/storage';
import { TARGET_PAID_USERS } from '@/lib/predictive';
import { fetchWeeklyArtifacts } from '@/lib/artifact-storage';
import { Download, Upload, Settings2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SettingsPanelProps {
  settings: AppSettings;
  logs: DailyLog[];
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onRestore: (logs: DailyLog[], settings: AppSettings) => void;
}

export function SettingsPanel({ settings, logs, onUpdateSettings, onRestore }: SettingsPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleBackup = async () => {
    const artifacts = await fetchWeeklyArtifacts();
    const payload = { ...exportBackup(logs, settings), artifacts };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup downloaded');
  };

  const handleRestoreFile = async (file: File) => {
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BackupPayload;
      if (!payload.logs || !payload.settings) {
        throw new Error('Invalid backup format');
      }
      const restored = await restoreBackup(payload);
      onRestore(restored.logs, restored.settings);
      toast.success('Backup restored', { description: `${restored.logs.length} logs loaded.` });
    } catch {
      toast.error('Restore failed', { description: 'Invalid JSON backup file.' });
    }
  };

  return (
    <section className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Settings2 className="h-4 w-4 text-zinc-400" />
        <h2 className="text-base font-bold text-white">Settings &amp; Data Management</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-semibold">Projected Prelims Base</label>
          <input
            type="number"
            step="0.1"
            value={settings.projected_prelims_base}
            onChange={(e) => onUpdateSettings({ projected_prelims_base: parseFloat(e.target.value) || 155 })}
            className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-semibold">Leave Bank Total</label>
          <input
            type="number"
            value={settings.leave_bank_total}
            onChange={(e) => onUpdateSettings({ leave_bank_total: parseInt(e.target.value, 10) || 28 })}
            className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-semibold">USD / INR Rate</label>
          <input
            type="number"
            step="0.01"
            value={settings.usd_inr_rate}
            onChange={(e) => onUpdateSettings({ usd_inr_rate: parseFloat(e.target.value) || 95.9 })}
            className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-semibold">Paying Users (target {TARGET_PAID_USERS})</label>
          <input
            type="number"
            value={settings.paying_users}
            onChange={(e) => onUpdateSettings({ paying_users: parseInt(e.target.value, 10) || 0 })}
            className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-zinc-500 font-semibold">ARPU (USD/mo)</label>
          <input
            type="number"
            step="0.5"
            value={settings.arpu_usd}
            onChange={(e) => onUpdateSettings({ arpu_usd: parseFloat(e.target.value) || 15 })}
            className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => void handleBackup()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30"
        >
          <Download className="h-4 w-4" />
          1-Click JSON Backup
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-600/30"
        >
          <Upload className="h-4 w-4" />
          Restore from JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleRestoreFile(file);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </section>
  );
}
