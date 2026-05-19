import { useMemo } from 'react';
import { MIN_INCREMENT } from '../constants/exercises';
import type {
  CalcResult,
  Difficulty,
  ExperienceLevel,
  GoalInput,
  LinePoint,
  Milestone,
  ProgressCurve,
} from '../types';

// 週次の進度カーブ。n=0 で 0、n=totalWeeks で 1 になるよう正規化されている。
// 線形以外は前半に多く伸ばし、後半は緩やかになる（実際の筋トレ伸びに近い対数的カーブ）。
function progressAt(
  n: number,
  totalWeeks: number,
  curve: ProgressCurve,
): number {
  if (n <= 0) return 0;
  if (n >= totalWeeks) return 1;
  const t = n / totalWeeks;
  switch (curve) {
    case 'linear':
      return t;
    case 'gentle':
      return Math.pow(t, 0.85);
    case 'standard':
      return Math.log(1 + n) / Math.log(1 + totalWeeks);
    case 'steep':
      return Math.sqrt(t);
  }
}

// 経験レベル別・週あたり MAX 伸び率（現在 MAX に対する % の中央値）
// 出典：Setgraph / Barbell Medicine 系の通説、筋力対数曲線
//   - Novice: 2.5–5kg/session（週あたり ~2–5% on major lifts）
//   - Intermediate: 1.25–2.5kg/1–2週（月で 5–10kg、週 ~0.5–1%）
//   - Advanced: 年 2–6% on 1RM → 週 ~0.1–0.3%
const WEEKLY_GAIN_RATE: Record<ExperienceLevel, number> = {
  beginner: 0.03,
  intermediate: 0.0075,
  advanced: 0.002,
};

function difficultyFromRatio(ratio: number): Difficulty {
  if (ratio <= 0.7) return 'easy';
  if (ratio <= 1.0) return 'standard';
  if (ratio <= 1.3) return 'hard';
  return 'very-hard';
}

// レップ数 → 推奨 1RM 比
// 出典：NSCA Training Load Chart (Landers, J. NSCA J 6(6):60-61, 1984)
//   NSCA Essentials of Strength and Conditioning Table 17.7 に収録、CSCS 試験範囲。
// 注意：セット数は加味しない「単発限界 RM」ベースの値。
const NSCA_REPS_TO_1RM: Record<number, number> = {
  1: 1.0,
  2: 0.95,
  3: 0.93,
  4: 0.9,
  5: 0.87,
  6: 0.85,
  7: 0.83,
  8: 0.8,
  9: 0.77,
  10: 0.75,
  11: 0.725, // 10 と 12 の線形補間（NSCA 表にはないが連続性のため）
  12: 0.7,
};

function recommendedRatioForReps(reps: number): number {
  if (reps <= 1) return 1.0;
  const hit = NSCA_REPS_TO_1RM[reps];
  if (hit !== undefined) return hit;
  // 12 reps を超える場合は 1 rep ごとに 2.5pt 下げる外挿 (下限 50%)
  return Math.max(0.5, 0.7 - 0.025 * (reps - 12));
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
  | 'no-gain'
  | 'invalid-set-weight'
  | 'invalid-sets-reps';

export function calcMilestones(
  input: GoalInput,
): { ok: true; data: CalcResult } | { ok: false; error: CalcError } {
  const {
    currentMax,
    targetMax,
    currentSetWeight,
    sets,
    reps,
    targetDate,
    level,
    progressCurve,
  } = input;

  if (
    !Number.isFinite(currentMax) ||
    !Number.isFinite(targetMax) ||
    currentMax <= 0 ||
    targetMax <= 0
  ) {
    return { ok: false, error: 'invalid-weight' };
  }
  if (targetMax <= currentMax) {
    return { ok: false, error: 'no-gain' };
  }
  if (
    !Number.isFinite(currentSetWeight) ||
    currentSetWeight <= 0 ||
    currentSetWeight > currentMax
  ) {
    return { ok: false, error: 'invalid-set-weight' };
  }
  if (
    !Number.isInteger(sets) ||
    !Number.isInteger(reps) ||
    sets <= 0 ||
    reps <= 0
  ) {
    return { ok: false, error: 'invalid-sets-reps' };
  }
  if (!targetDate) {
    return { ok: false, error: 'invalid-date' };
  }

  const totalWeeks = diffInWeeks(todayIso(), targetDate);
  if (totalWeeks <= 0) {
    return { ok: false, error: 'past-date' };
  }

  const requiredGain = targetMax - currentMax;
  const weeklyTarget = requiredGain / totalWeeks;
  const realisticWeeklyGain = currentMax * WEEKLY_GAIN_RATE[level];
  const ratio = weeklyTarget / realisticWeeklyGain;
  const difficulty = difficultyFromRatio(ratio);
  const intensityRatio = currentSetWeight / currentMax;
  const recommendedRatio = recommendedRatioForReps(reps);
  const setsReps = `${sets}×${reps}`;

  const round1 = (n: number) => Math.round(n * 10) / 10;
  const increment = MIN_INCREMENT[input.exercise];
  const roundToIncrement = (w: number) =>
    Math.round(w / increment) * increment;
  const goalRecommendedWeight = roundToIncrement(targetMax * recommendedRatio);

  const milestones: Milestone[] = [];
  const idealLine: LinePoint[] = [{ week: 0, weight: currentMax }];
  const realisticLine: LinePoint[] = [{ week: 0, weight: currentMax }];

  for (let n = 1; n <= totalWeeks; n++) {
    const max =
      currentMax + requiredGain * progressAt(n, totalWeeks, progressCurve);
    milestones.push({
      week: n,
      targetMax: round1(max),
      workingWeight: roundToIncrement(max * intensityRatio),
      setsReps,
      status: difficulty,
    });
    idealLine.push({ week: n, weight: round1(max) });
    realisticLine.push({
      week: n,
      weight: round1(currentMax + realisticWeeklyGain * n),
    });
  }

  return {
    ok: true,
    data: {
      totalWeeks,
      weeklyGain: Math.round(weeklyTarget * 100) / 100,
      difficulty,
      intensityRatio,
      recommendedRatio,
      goalRecommendedWeight,
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
