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
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card label="残り週数" value={`${result.totalWeeks} 週`} />
      <Card
        label="週あたり増量目安"
        value={`${result.weeklyGain.toFixed(2)} kg`}
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
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
