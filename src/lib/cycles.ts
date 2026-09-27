import { CycleInfo } from './types';
import { CYCLE_ROADMAP } from '@/data/roadmap';

export function generate13Cycles(targetDateStr: string = '2026-09-27'): CycleInfo[] {
  const startDate = new Date('2026-09-28T00:00:00');
  const targetDate = new Date(targetDateStr + 'T00:00:00');

  const cycles: CycleInfo[] = [];

  for (let i = 0; i < 13; i++) {
    const cycleStart = new Date(startDate);
    cycleStart.setDate(startDate.getDate() + i * 28);

    const cycleEnd = new Date(cycleStart);
    cycleEnd.setDate(cycleStart.getDate() + 27);

    const startIso = cycleStart.toISOString().split('T')[0];
    const endIso = cycleEnd.toISOString().split('T')[0];

    const isCurrent =
      (i === 0 && targetDate < cycleStart) ||
      (targetDate >= cycleStart && targetDate <= cycleEnd);

    const roadmap = CYCLE_ROADMAP[i];
    cycles.push({
      number: i + 1,
      name: roadmap ? `Cycle ${i + 1}: ${roadmap.title}` : `Cycle ${i + 1}`,
      startDate: startIso,
      endDate: endIso,
      isCurrent,
    });
  }

  return cycles;
}

export function getCurrentCycle(dateStr: string): number {
  const cycles = generate13Cycles(dateStr);
  const current = cycles.find((c) => c.isCurrent);
  return current ? current.number : 1;
}
