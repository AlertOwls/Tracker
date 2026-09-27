import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DailyLog, AppSettings } from './types';

const INITIAL_SETTINGS: AppSettings = {
  id: 1,
  paying_users: 54,
  arpu_usd: 15,
  usd_inr_rate: 95.9,
  leave_bank_total: 28,
  projected_prelims_base: 155,
};

function normalizeLog(item: Record<string, unknown>): DailyLog {
  const legacyPhysicalMusic = Boolean(item.physical_music_done);
  const founderDone = Boolean(item.founder_done);
  return {
    id: String(item.id ?? `log-${item.date}`),
    date: String(item.date),
    weight: item.weight != null ? Number(item.weight) : null,
    sleep_hours: item.sleep_hours != null ? Number(item.sleep_hours) : null,
    founder_done: founderDone,
    founder_minutes:
      item.founder_minutes != null ? Number(item.founder_minutes) : founderDone ? 60 : 0,
    upsc_done: item.upsc_done != null ? Boolean(item.upsc_done) : Boolean(item.upsc_topic),
    upsc_topic: item.upsc_topic != null ? String(item.upsc_topic) : null,
    physical_done:
      item.physical_done != null ? Boolean(item.physical_done) : legacyPhysicalMusic,
    music_done: item.music_done != null ? Boolean(item.music_done) : legacyPhysicalMusic,
    day_status: (item.day_status as DailyLog['day_status']) || 'On-Track',
    notes: item.notes != null ? String(item.notes) : null,
    schedule_checkboxes: (item.schedule_checkboxes as Record<string, boolean>) || {},
    created_at: item.created_at as string | undefined,
    updated_at: item.updated_at as string | undefined,
  };
}

function toSupabaseRow(log: DailyLog) {
  return {
    date: log.date,
    weight: log.weight,
    sleep_hours: log.sleep_hours,
    founder_done: log.founder_done,
    founder_minutes: log.founder_minutes,
    upsc_done: log.upsc_done,
    upsc_topic: log.upsc_topic,
    physical_done: log.physical_done,
    music_done: log.music_done,
    day_status: log.day_status,
    notes: log.notes,
    schedule_checkboxes: log.schedule_checkboxes,
  };
}

const INITIAL_LOGS: DailyLog[] = [
  {
    id: 'demo-1',
    date: '2026-09-27',
    weight: 64.5,
    sleep_hours: 7.5,
    founder_done: true,
    founder_minutes: 180,
    upsc_done: true,
    upsc_topic: 'Polity: Preamble & Fundamental Rights Architecture',
    physical_done: true,
    music_done: true,
    day_status: 'On-Track',
    notes: 'Strong Sunday execution. CSAT mock scored 112/200. Prepared 15 boiled eggs.',
    schedule_checkboxes: { 'sun-1': true, 'sun-2': true, 'sun-3': true, 'sun-4': true, 'sun-5': true },
  },
  {
    id: 'demo-2',
    date: '2026-09-26',
    weight: 64.7,
    sleep_hours: 7.0,
    founder_done: true,
    founder_minutes: 240,
    upsc_done: true,
    upsc_topic: 'Modern History: Non-Cooperation Movement & Swarajists',
    physical_done: false,
    music_done: true,
    day_status: 'On-Track',
    notes: 'Alertowls War Room: Shipped new webhook alert integration.',
    schedule_checkboxes: { 'sat-1': true, 'sat-2': true, 'sat-3': true, 'sat-4': true, 'sat-5': true },
  },
  {
    id: 'demo-3',
    date: '2026-09-25',
    weight: 64.8,
    sleep_hours: 6.8,
    founder_done: true,
    founder_minutes: 60,
    upsc_done: true,
    upsc_topic: 'Economics: Monetary Policy & Repo Rate Mechanisms',
    physical_done: false,
    music_done: false,
    day_status: 'Recovered',
    notes: 'WFH sprint completed. Missed badminton due to rain, recovered with evening static reading.',
    schedule_checkboxes: { 'wfh-1': true, 'wfh-4': true, 'wfh-7': true, 'wfh-8': true },
  },
  {
    id: 'demo-4',
    date: '2026-09-24',
    weight: 65.0,
    sleep_hours: 7.2,
    founder_done: true,
    founder_minutes: 60,
    upsc_done: true,
    upsc_topic: 'Geography: Indian Climate Systems & Monsoons',
    physical_done: true,
    music_done: true,
    day_status: 'On-Track',
    notes: 'In-Office day went smoothly. Tiago drive pleasant. Riyaz 45m focused on Raag Bhairav.',
    schedule_checkboxes: { 'io-1': true, 'io-2': true, 'io-3': true, 'io-6': true, 'io-7': true },
  },
  {
    id: 'demo-5',
    date: '2026-09-21',
    weight: 65.4,
    sleep_hours: 6.5,
    founder_done: false,
    founder_minutes: 0,
    upsc_done: false,
    upsc_topic: 'Environment: Biodiversity Hotspots',
    physical_done: false,
    music_done: false,
    day_status: 'Leave',
    notes: 'Family event leave taken.',
    schedule_checkboxes: {},
  },
];

const LOCAL_STORAGE_LOGS_KEY = 'tracker_daily_logs_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'tracker_app_settings_v2';
const LOCAL_STORAGE_BACKUP_KEY = 'tracker_backup_snapshot';

export async function fetchDailyLogs(): Promise<DailyLog[]> {
  if (typeof window === 'undefined') return INITIAL_LOGS;

  const localData = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
  let logs: DailyLog[] = localData
    ? JSON.parse(localData).map((item: Record<string, unknown>) => normalizeLog(item))
    : INITIAL_LOGS;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        logs = data.map((item) => normalizeLog(item as Record<string, unknown>));
        localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
      }
    } catch (e) {
      console.warn('Supabase fetch logs failed, using local storage fallback:', e);
    }
  }

  return logs;
}

export async function saveDailyLog(log: Partial<DailyLog> & { date: string }): Promise<DailyLog> {
  const localData = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
  let logs: DailyLog[] = localData
    ? JSON.parse(localData).map((item: Record<string, unknown>) => normalizeLog(item))
    : INITIAL_LOGS;

  const existingIndex = logs.findIndex((l) => l.date === log.date);
  let updatedLog: DailyLog;

  if (existingIndex >= 0) {
    const prev = logs[existingIndex];
    updatedLog = normalizeLog({
      ...prev,
      ...log,
      schedule_checkboxes: {
        ...prev.schedule_checkboxes,
        ...(log.schedule_checkboxes || {}),
      },
    });
    logs[existingIndex] = updatedLog;
  } else {
    updatedLog = normalizeLog({
      id: log.id || `log-${Date.now()}`,
      date: log.date,
      weight: log.weight ?? null,
      sleep_hours: log.sleep_hours ?? null,
      founder_done: log.founder_done ?? false,
      founder_minutes: log.founder_minutes ?? (log.founder_done ? 60 : 0),
      upsc_done: log.upsc_done ?? false,
      upsc_topic: log.upsc_topic ?? null,
      physical_done: log.physical_done ?? false,
      music_done: log.music_done ?? false,
      day_status: log.day_status || 'On-Track',
      notes: log.notes ?? null,
      schedule_checkboxes: log.schedule_checkboxes || {},
    });
    logs.unshift(updatedLog);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('daily_logs').upsert(toSupabaseRow(updatedLog), { onConflict: 'date' });
    } catch (e) {
      console.warn('Supabase upsert failed:', e);
    }
  }

  return updatedLog;
}

export async function fetchAppSettings(): Promise<AppSettings> {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;

  const localData = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  let settings: AppSettings = localData
    ? { ...INITIAL_SETTINGS, ...JSON.parse(localData) }
    : INITIAL_SETTINGS;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).single();

      if (!error && data) {
        settings = {
          id: 1,
          paying_users: Number(data.paying_users) || 50,
          arpu_usd: Number(data.arpu_usd) || 15,
          usd_inr_rate: Number(data.usd_inr_rate) || 95.9,
          leave_bank_total: Number(data.leave_bank_total) || 28,
          projected_prelims_base: Number(data.projected_prelims_base) || 155,
        };
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      }
    } catch (e) {
      console.warn('Supabase fetch settings failed, using local storage fallback:', e);
    }
  }

  return settings;
}

export async function saveAppSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
  const current = await fetchAppSettings();
  const updated: AppSettings = {
    ...current,
    ...newSettings,
    id: 1,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('app_settings').upsert({
        id: 1,
        paying_users: updated.paying_users,
        arpu_usd: updated.arpu_usd,
        usd_inr_rate: updated.usd_inr_rate,
        leave_bank_total: updated.leave_bank_total,
        projected_prelims_base: updated.projected_prelims_base,
      });
    } catch (e) {
      console.warn('Supabase update settings failed:', e);
    }
  }

  return updated;
}

export function computeLeaveBankRemaining(logs: DailyLog[], totalBank: number = 28): number {
  const leaveCount = logs.filter((l) => l.day_status === 'Leave').length;
  return Math.max(0, totalBank - leaveCount);
}

export interface BackupPayload {
  version: 2;
  exportedAt: string;
  logs: DailyLog[];
  settings: AppSettings;
}

export function exportBackup(logs: DailyLog[], settings: AppSettings): BackupPayload {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    logs,
    settings,
  };
}

export async function restoreBackup(payload: BackupPayload): Promise<{ logs: DailyLog[]; settings: AppSettings }> {
  const logs = payload.logs.map((l) => normalizeLog(l as unknown as Record<string, unknown>));
  const settings = { ...INITIAL_SETTINGS, ...payload.settings };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(payload));
  }

  if (isSupabaseConfigured()) {
    try {
      for (const log of logs) {
        await supabase.from('daily_logs').upsert(toSupabaseRow(log), { onConflict: 'date' });
      }
      await supabase.from('app_settings').upsert({
        id: 1,
        paying_users: settings.paying_users,
        arpu_usd: settings.arpu_usd,
        usd_inr_rate: settings.usd_inr_rate,
        leave_bank_total: settings.leave_bank_total,
        projected_prelims_base: settings.projected_prelims_base,
      });
    } catch (e) {
      console.warn('Supabase restore failed:', e);
    }
  }

  return { logs, settings };
}
