import { useMemo } from 'react';
import type {
  CalcResult,
  Difficulty,
  ExperienceLevel,
  GoalInput,
  LinePoint,
  Milestone,
} from '../types';

// 経験レベル別・週あたり伸び率（現在重量に対する % の中央値）
// 出典：Setgraph / Barbell Medicine 系の通説、筋力対数曲線
//   - Novice: 2.5–5kg/session（週あたり ~2–5% on major lifts）
//   - Intermediate: 1.25–2.5kg/1–2週（月で 5–10kg、週 ~0.5–1%）
//   - Advanced: 年 2–6% on 1RM → 週 ~0.1–0.3%
const WEEKLY_GAIN_RATE: Record<ExperienceLevel, number> = {
  beginner: 0.03,
  intermediate: 0.0075,
  advanced: 0.002,
};

// 強度（1RM比）→ セット×レップ（Prilepin's Chart ベース、軽量域は筋肥大向け）
// 出典：Prilepin's Chart（旧ソ連 Prilepin 1000人超のエリート選手データ）
const SETS_BY_INTENSITY: ReadonlyArray<{ max: number; label: string }> = [
  { max: 0.7, label: '4×10' },
  { max: 0.75, label: '5×5' },
  { max: 0.85, label: '5×3' },
  { max: 0.9, label: '4×2' },
  { max: Infinity, label: '3×1' },
];

function pickSets(intensityRatio: number): string {
  for (const tier of SETS_BY_INTENSITY) {
    if (intensityRatio <= tier.max) return tier.label;
  }
  return SETS_BY_INTENSITY[SETS_BY_INTENSITY.length - 1].label;
}

function difficultyFromRatio(ratio: number): Difficulty {
  if (ratio <= 0.7) return 'easy';
  if (ratio <= 1.0) return 'standard';
  if (ratio <= 1.3) return 'hard';
  return 'very-hard';
}

function diffInWeeks(fromIso: string, toIso: string): number {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24 * 7));
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export type CalcError =
  | 'invalid-date'
  | 'past-date'
  | 'invalid-weight'
  | 'no-gain';

export function calcMilestones(
  input: GoalInput,
): { ok: true; data: CalcResult } | { ok: false; error: CalcError } {
  const { currentWeight, targetWeight, targetDate, level } = input;

  if (
    !Number.isFinite(currentWeight) ||
    !Number.isFinite(targetWeight) ||
    currentWeight <= 0 ||
    targetWeight <= 0
  ) {
    return { ok: false, error: 'invalid-weight' };
  }
  if (targetWeight <= currentWeight) {
    return { ok: false, error: 'no-gain' };
  }
  if (!targetDate) {
    return { ok: false, error: 'invalid-date' };
  }

  const totalWeeks = diffInWeeks(todayIso(), targetDate);
  if (totalWeeks <= 0) {
    return { ok: false, error: 'past-date' };
  }

  const requiredGain = targetWeight - currentWeight;
  const weeklyTarget = requiredGain / totalWeeks;
  const realisticWeeklyGain = currentWeight * WEEKLY_GAIN_RATE[level];
  const ratio = weeklyTarget / realisticWeeklyGain;
  const difficulty = difficultyFromRatio(ratio);
  const weekStatus = difficulty;

  const milestones: Milestone[] = [];
  const idealLine: LinePoint[] = [{ week: 0, weight: currentWeight }];
  const realisticLine: LinePoint[] = [{ week: 0, weight: currentWeight }];

  for (let n = 1; n <= totalWeeks; n++) {
    const milestoneWeight = currentWeight + weeklyTarget * n;
    const intensityRatio = milestoneWeight / targetWeight;
    milestones.push({
      week: n,
      targetWeight: Math.round(milestoneWeight * 10) / 10,
      recommendedSets: pickSets(intensityRatio),
      status: weekStatus,
    });
    idealLine.push({ week: n, weight: Math.round(milestoneWeight * 10) / 10 });
    realisticLine.push({
      week: n,
      weight: Math.round((currentWeight + realisticWeeklyGain * n) * 10) / 10,
    });
  }

  return {
    ok: true,
    data: {
      totalWeeks,
      weeklyGain: Math.round(weeklyTarget * 100) / 100,
      difficulty,
      milestones,
      idealLine,
      realisticLine,
    },
  };
}

export function useCalcMilestones(
  input: GoalInput | null,
): ReturnType<typeof calcMilestones> | null {
  return useMemo(() => (input ? calcMilestones(input) : null), [input]);
}
