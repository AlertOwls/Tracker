'use client';

import React from 'react';
import { AppSettings, DailyLog } from '@/lib/types';
import {
  computePredictiveMetrics,
  TARGET_PAID_USERS,
  VALUATION_MULTIPLE,
  EXIT_TARGET_INR_CR,
} from '@/lib/predictive';
import { AlertTriangle, Brain, IndianRupee, Mic, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictiveBannerProps {
  logs: DailyLog[];
  settings: AppSettings;
}

export function PredictiveBanner({ logs, settings }: PredictiveBannerProps) {
  const metrics = computePredictiveMetrics(logs, settings);

  const scoreTextClass =
    metrics.scoreColor === 'emerald'
      ? 'text-emerald-400'
      : metrics.scoreColor === 'amber'
        ? 'text-amber-400'
        : 'text-rose-400';

  const airDeltaIcon =
    metrics.airProbDeltaThisWeek >= 0 ? (
      <TrendingUp className="h-3 w-3 text-emerald-400" />
    ) : (
      <TrendingDown className="h-3 w-3 text-rose-400" />
    );

  return (
    <section className="space-y-3">
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Probability &amp; Lag Engine — Live Predictive Analytics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Projected Prelims Score</p>
            <p className={cn('text-2xl font-black font-mono mt-1', scoreTextClass)}>
              {metrics.projectedPrelimsScore}{' '}
              <span className="text-sm font-normal text-zinc-500">/ 200</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">Baseline {settings.projected_prelims_base} · Target 150+</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">AIR &lt; 50 Probability</p>
            <p className="text-2xl font-black font-mono text-sky-400 mt-1">{metrics.airUnder50Probability}%</p>
            <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
              {airDeltaIcon}
              {metrics.airProbDeltaThisWeek >= 0 ? '+' : ''}
              {metrics.airProbDeltaThisWeek}% this week
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Startup Target Feasibility</p>
            <p className="text-2xl font-black font-mono text-purple-400 mt-1">{metrics.startupFeasibilityPercent}%</p>
            <p className="text-[10px] text-zinc-500 mt-1">
              {settings.paying_users} / {TARGET_PAID_USERS} users · Exit Runway: {metrics.exitRunwayLabel}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1">
              <Mic className="h-3 w-3 text-amber-400" />
              Vocal &amp; Stamina Index
            </p>
            <p className="text-2xl font-black font-mono text-amber-400 mt-1">{metrics.vocalStaminaIndex}</p>
            <p className="text-[10px] text-zinc-500 mt-1">14-day riyaz + sport consistency</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono text-zinc-400">
          <span>MRR: ${metrics.mrrUsd.toLocaleString()}</span>
          <span>ARR: ${metrics.arrUsd.toLocaleString()} · ₹{(metrics.arrInr / 100000).toFixed(2)} L</span>
          <span className="flex items-center gap-1">
            <IndianRupee className="h-3 w-3 text-amber-400" />
            Est. {VALUATION_MULTIPLE}x ARR · ₹{EXIT_TARGET_INR_CR} Cr net target
          </span>
        </div>
      </div>

      {metrics.lagAlert.active && (
        <div className="flex gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-100 text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <p>{metrics.lagAlert.message}</p>
        </div>
      )}
    </section>
  );
}
