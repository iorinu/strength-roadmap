import { DIFFICULTY_LABEL } from '../constants/exercises';
import type { CalcResult, Difficulty } from '../types';

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  standard: 'bg-sky-100 text-sky-700',
  hard: 'bg-amber-100 text-amber-700',
  'very-hard': 'bg-rose-100 text-rose-700',
};

type Props = { result: CalcResult };

export function MetricCards({ result }: Props) {
  const lastMilestone = result.milestones[result.milestones.length - 1];
  const intensityPct = (result.intensityRatio * 100).toFixed(0);
  const recommendedPct = (result.recommendedRatio * 100).toFixed(0);

  // 現在の強度比 vs 推奨強度比の評価
  const diff = result.intensityRatio - result.recommendedRatio;
  let strengthHint: { label: string; color: string };
  if (Math.abs(diff) < 0.05) {
    strengthHint = { label: '現在の強度比は適正', color: 'text-emerald-600' };
  } else if (diff < 0) {
    strengthHint = {
      label: `現在の強度比は推奨より低め (${intensityPct}% / 推奨 ${recommendedPct}%)`,
      color: 'text-sky-600',
    };
  } else {
    strengthHint = {
      label: `現在の強度比は推奨より高め (${intensityPct}% / 推奨 ${recommendedPct}%)`,
      color: 'text-amber-600',
    };
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="残り週数" value={`${result.totalWeeks} 週`} />
        <Card
          label="週あたり増量目安"
          value={`${result.weeklyGain.toFixed(2)} kg`}
        />
        <Card
          label="目標達成時の練習重量"
          value={`${lastMilestone.workingWeight.toFixed(1)} kg`}
          sub={`${lastMilestone.setsReps}（現在の強度比 ${intensityPct}% 維持）`}
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">達成難易度</p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-lg font-semibold ${DIFFICULTY_COLOR[result.difficulty]}`}
          >
            {DIFFICULTY_LABEL[result.difficulty]}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
        <p className="text-sm font-medium text-indigo-900">
          {lastMilestone.setsReps} の適正重量（推奨 {recommendedPct}% 1RM）
        </p>
        <p className="mt-1 text-3xl font-semibold text-indigo-900">
          {result.goalRecommendedWeight.toFixed(1)} kg
          <span className="ml-2 text-base font-normal text-indigo-700">
            （目標 MAX 達成時）
          </span>
        </p>
        <p className={`mt-2 text-sm ${strengthHint.color}`}>
          {strengthHint.label}
        </p>
        <p className="mt-3 text-xs text-indigo-700/80">
          ※ NSCA Training Load Chart (Landers, 1984) 準拠。レップ数のみで判定し、セット数は加味していません。
        </p>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
