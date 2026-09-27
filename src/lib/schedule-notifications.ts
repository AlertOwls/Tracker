import { ScheduleItem } from './types';

export function parseScheduleStartTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPm = match[3].toUpperCase() === 'PM';
  if (isPm && hours !== 12) hours += 12;
  if (!isPm && hours === 12) hours = 0;
  return { hours, minutes };
}

export function minutesSinceMidnight(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

export function nowMinutesLocal(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export function todayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

const NOTIFIED_KEY = 'tracker_notified_slots';

export function wasNotifiedToday(slotKey: string): boolean {
  if (typeof window === 'undefined') return true;
  const raw = sessionStorage.getItem(NOTIFIED_KEY);
  const map: Record<string, string> = raw ? JSON.parse(raw) : {};
  return map[slotKey] === todayDateStr();
}

export function markNotifiedToday(slotKey: string): void {
  if (typeof window === 'undefined') return;
  const raw = sessionStorage.getItem(NOTIFIED_KEY);
  const map: Record<string, string> = raw ? JSON.parse(raw) : {};
  map[slotKey] = todayDateStr();
  sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify(map));
}

export function findDueTasks(
  items: ScheduleItem[],
  checkboxes: Record<string, boolean>,
  windowMinutes = 12
): ScheduleItem[] {
  const now = nowMinutesLocal();
  const due: ScheduleItem[] = [];

  for (const item of items) {
    if (checkboxes[item.id]) continue;
    const parsed = parseScheduleStartTime(item.time);
    if (!parsed) continue;
    const start = minutesSinceMidnight(parsed.hours, parsed.minutes);
    if (now >= start && now < start + windowMinutes) {
      due.push(item);
    }
  }

  return due;
}
