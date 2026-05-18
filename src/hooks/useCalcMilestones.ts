import { useMemo } from 'react';
import type {
  CalcResult,
  Difficulty,
  ExperienceLevel,
  GoalInput,
  LinePoint,
  Milestone,
} from '../types';

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

// レップ数 → 推奨 1RM 比（Prilepin's Chart の reps/set ゾーン中央値）
// 「N レップを複数セット持続可能な強度」の目安。1セット限界の RM 換算より少し控えめ。
function recommendedRatioForReps(reps: number): number {
  if (reps <= 2) return 0.88;   // 86–90% 域
  if (reps <= 4) return 0.805;  // 76–85% 域
  if (reps <= 6) return 0.725;  // 70–75% 域
  if (reps <= 10) return 0.65;  // 筋肥大域
  return 0.55;                  // 高レップ域
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
  const { currentMax, targetMax, currentSetWeight, sets, reps, targetDate, level } = input;

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
  const goalRecommendedWeight = round1(targetMax * recommendedRatio);

  const milestones: Milestone[] = [];
  const idealLine: LinePoint[] = [{ week: 0, weight: currentMax }];
  const realisticLine: LinePoint[] = [{ week: 0, weight: currentMax }];

  for (let n = 1; n <= totalWeeks; n++) {
    const max = currentMax + weeklyTarget * n;
    milestones.push({
      week: n,
      targetMax: round1(max),
      workingWeight: round1(max * intensityRatio),
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
