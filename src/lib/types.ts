export type DayStatus = 'On-Track' | 'Leave' | 'Recovered' | 'Slip';

export interface DailyLog {
  id: string;
  date: string;
  weight: number | null;
  sleep_hours: number | null;
  founder_done: boolean;
  founder_minutes: number;
  upsc_done: boolean;
  upsc_topic: string | null;
  physical_done: boolean;
  music_done: boolean;
  day_status: DayStatus;
  notes: string | null;
  schedule_checkboxes: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface AppSettings {
  id: number;
  paying_users: number;
  arpu_usd: number;
  usd_inr_rate: number;
  leave_bank_total: number;
  projected_prelims_base: number;
  created_at?: string;
  updated_at?: string;
}

export type ScheduleArchetype = 'in-office' | 'wfh' | 'saturday' | 'sunday';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  duration: string;
  category?: 'health' | 'work' | 'study' | 'leisure' | 'routine';
}

export interface CycleInfo {
  number: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
