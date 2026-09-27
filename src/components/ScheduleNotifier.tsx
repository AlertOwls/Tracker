'use client';

import { useEffect, useState } from 'react';
import { DailyLog } from '@/lib/types';
import { SCHEDULE_ARCHETYPES, getArchetypeForDate } from '@/lib/schedules';
import {
  findDueTasks,
  markNotifiedToday,
  todayDateStr,
  wasNotifiedToday,
} from '@/lib/schedule-notifications';
import { toast } from 'sonner';
import { Bell, BellOff } from 'lucide-react';

interface ScheduleNotifierProps {
  todayLog: DailyLog | null;
  onOpenLogModal: () => void;
  onPromptTask: (taskId: string) => void;
}

export function ScheduleNotifier({ todayLog, onOpenLogModal, onPromptTask }: ScheduleNotifierProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported in this browser');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      toast.success('Schedule reminders enabled');
    }
  };

  useEffect(() => {
    const tick = () => {
      const dateStr = todayDateStr();
      const archetype = getArchetypeForDate(new Date(dateStr + 'T12:00:00'));
      const items = SCHEDULE_ARCHETYPES[archetype].items;
      const checkboxes = todayLog?.date === dateStr ? todayLog.schedule_checkboxes || {} : {};
      const due = findDueTasks(items, checkboxes, 15);

      for (const task of due) {
        const slotKey = `${dateStr}:${task.id}`;
        if (wasNotifiedToday(slotKey)) continue;
        markNotifiedToday(slotKey);

        const message = `Time for: ${task.title} (${task.time})`;
        if (permission === 'granted') {
          new Notification('Tracker · Task check-in', {
            body: message,
            tag: slotKey,
            icon: '/icon.svg',
          });
        }
        toast.message('Task check-in', {
          description: message,
          action: {
            label: 'Mark done',
            onClick: () => onPromptTask(task.id),
          },
        });
      }
    };

    const interval = setInterval(tick, 30_000);
    tick();
    return () => clearInterval(interval);
  }, [todayLog, onPromptTask, permission]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
      <span className="text-zinc-400 flex items-center gap-1.5">
        <Bell className="h-3.5 w-3.5 text-amber-400" />
        Schedule reminders ping during each task window (every ~30s check).
      </span>
      <button
        type="button"
        onClick={requestPermission}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
      >
        {permission === 'granted' ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
        Enable browser notifications
      </button>
      <button
        type="button"
        onClick={onOpenLogModal}
        className="text-emerald-400 hover:text-emerald-300 font-medium"
      >
        End-of-day log
      </button>
    </div>
  );
}
