import { AppSettings, DailyLog } from './types';

export const PROGRAM_START = '2026-09-28';
export const PRELIMS_DATE = '2027-05-23';
export const TARGET_PAID_USERS = 625;
export const FOUNDER_HOURS_PER_WEEK = 10.5;
export const AIR_BASE_PROBABILITY = 85.0;
export const VALUATION_MULTIPLE = 4.0;
export const EXIT_TARGET_INR_CR = 2.5;

export interface PredictiveMetrics {
  projectedPrelimsScore: number;
  airUnder50Probability: number;
  airProbDeltaThisWeek: number;
  startupFeasibilityPercent: number;
  vocalStaminaIndex: number;
  mrrUsd: number;
  arrUsd: number;
  arrInr: number;
  exitRunwayLabel: string;
  exitDelayDays: number;
  lagAlert: {
    active: boolean;
    message: string;
    pointsLost: number;
    recoveryHours: number;
  };
  scoreColor: 'emerald' | 'amber' | 'rose';
}

function parseDate(iso: string): Date {
  return new Date(iso + 'T00:00:00');
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function isWeekday(d: Date): boolean {
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

function isSaturday(d: Date): boolean {
  return d.getDay() === 6;
}

function eachDayInclusive(start: string, end: string): string[] {
  const days: string[] = [];
  const cur = parseDate(start);
  const last = parseDate(end);
  while (cur <= last) {
    days.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function logByDate(logs: DailyLog[]): Map<string, DailyLog> {
  return new Map(logs.map((l) => [l.date, l]));
}

export function computePredictiveMetrics(
  logs: DailyLog[],
  settings: AppSettings,
  asOfDate: string = new Date().toISOString().split('T')[0],
  includeWeekDelta = true
): PredictiveMetrics {
  const baseScore = settings.projected_prelims_base ?? 155;
  let score = baseScore;
  let airProb = AIR_BASE_PROBABILITY;
  let consecutiveMissed = 0;
  let totalPointsLost = 0;

  const byDate = logByDate(logs);
  const timeline = eachDayInclusive(PROGRAM_START, asOfDate);

  for (const dateStr of timeline) {
    const d = parseDate(dateStr);
    const log = byDate.get(dateStr);
    const isFuture = dateStr > asOfDate;

    if (isFuture) continue;

    if (log?.upsc_done) {
      score = Math.min(160, score + 0.15);
      consecutiveMissed = 0;
      continue;
    }

    const excused = log?.day_status === 'Leave';
    const missedWeekday = isWeekday(d) && !excused && (!log || !log.upsc_done);
    if (missedWeekday) {
      consecutiveMissed += 1;
      const multiplier = consecutiveMissed >= 2 ? Math.pow(1.35, consecutiveMissed) : 1;
      const markPenalty = 2.5 * multiplier;
      const probPenalty = 3.8 * multiplier;
      score -= markPenalty;
      airProb -= probPenalty;
      totalPointsLost += markPenalty;
    } else if (!missedWeekday) {
      consecutiveMissed = 0;
    }

    if (isSaturday(d) && !excused) {
      const weekendMissed =
        !log ||
        !log.upsc_done ||
        !(log.schedule_checkboxes?.['sat-4'] ?? log.upsc_done);
      if (weekendMissed) {
        score -= 4.0;
        totalPointsLost += 4.0;
      }
    }
  }

  score = Math.max(0, Math.min(200, score));
  airProb = Math.max(0, Math.min(100, airProb));

  let airProbDelta = 0;
  if (includeWeekDelta) {
    const weekAgo = parseDate(asOfDate);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const metricsWeekAgo = computePredictiveMetrics(logs, settings, formatDate(weekAgo), false);
    airProbDelta = airProb - metricsWeekAgo.airUnder50Probability;
  }

  const mrrUsd = settings.paying_users * settings.arpu_usd;
  const arrUsd = mrrUsd * 12;
  const arrInr = arrUsd * settings.usd_inr_rate;

  const programDays = eachDayInclusive(PROGRAM_START, asOfDate).length;
  const weeksElapsed = Math.max(programDays / 7, 1 / 7);
  const expectedFounderMinutes = weeksElapsed * FOUNDER_HOURS_PER_WEEK * 60;
  const loggedFounderMinutes = logs
    .filter((l) => l.date >= PROGRAM_START && l.date <= asOfDate)
    .reduce((sum, l) => sum + (l.founder_minutes || (l.founder_done ? 60 : 0)), 0);

  const hoursRatio = expectedFounderMinutes > 0 ? loggedFounderMinutes / expectedFounderMinutes : 0;
  const userRatio = settings.paying_users / TARGET_PAID_USERS;
  const startupFeasibilityPercent = Math.min(
    100,
    Math.round((hoursRatio * 0.45 + userRatio * 0.55) * 100)
  );

  const minutesBehind = Math.max(0, expectedFounderMinutes - loggedFounderMinutes);
  const exitDelayDays = Math.round(minutesBehind / (FOUNDER_HOURS_PER_WEEK * 60 / 7));
  const exitRunwayLabel =
    exitDelayDays <= 0 && settings.paying_users >= TARGET_PAID_USERS * 0.9
      ? 'On-Track'
      : exitDelayDays <= 0
        ? 'On-Track'
        : `Delayed by ${exitDelayDays} Days`;

  const last14 = eachDayInclusive(
    formatDate((() => {
      const x = parseDate(asOfDate);
      x.setDate(x.getDate() - 13);
      return x;
    })()),
    asOfDate
  );

  let riyazHits = 0;
  let physicalHits = 0;
  for (const day of last14) {
    const log = byDate.get(day);
    if (!log) continue;
    const riyaz =
      log.music_done ||
      log.schedule_checkboxes?.['io-2'] ||
      log.schedule_checkboxes?.['sat-1'];
    const physical =
      log.physical_done ||
      log.schedule_checkboxes?.['wfh-2'] ||
      log.schedule_checkboxes?.['sun-1'] ||
      log.schedule_checkboxes?.['io-7'];
    if (riyaz) riyazHits += 1;
    if (physical) physicalHits += 1;
  }
  const vocalStaminaIndex = Math.round(((riyazHits + physicalHits) / (last14.length * 2)) * 100);

  const lagActive = totalPointsLost > 0;
  const recoveryHours = Math.max(1, Math.ceil(totalPointsLost / 4));

  let scoreColor: 'emerald' | 'amber' | 'rose' = 'emerald';
  if (score < 125) scoreColor = 'rose';
  else if (score < 145) scoreColor = 'amber';

  return {
    projectedPrelimsScore: Math.round(score * 10) / 10,
    airUnder50Probability: Math.round(airProb * 10) / 10,
    airProbDeltaThisWeek: Math.round(airProbDelta * 10) / 10,
    startupFeasibilityPercent,
    vocalStaminaIndex,
    mrrUsd,
    arrUsd,
    arrInr,
    exitRunwayLabel,
    exitDelayDays,
    lagAlert: {
      active: lagActive,
      message: lagActive
        ? `Lag Detected: Missing UPSC / weekend deep blocks reduced projected Prelims score by −${totalPointsLost.toFixed(1)} points. Complete ~${recoveryHours} hours on Saturday to recover.`
        : '',
      pointsLost: totalPointsLost,
      recoveryHours,
    },
    scoreColor,
  };
}
