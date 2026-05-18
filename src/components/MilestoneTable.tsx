import { DIFFICULTY_LABEL } from '../constants/exercises';
import type { CalcResult, Difficulty } from '../types';

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  standard: 'bg-sky-100 text-sky-700',
  hard: 'bg-amber-100 text-amber-700',
  'very-hard': 'bg-rose-100 text-rose-700',
};

type Props = { result: CalcResult };

export function MilestoneTable({ result }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-medium text-slate-700">
        週別マイルストーン
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-3 py-2 font-medium">週</th>
              <th className="px-3 py-2 font-medium">目標重量</th>
              <th className="px-3 py-2 font-medium">推奨セット</th>
              <th className="px-3 py-2 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {result.milestones.map((m) => (
              <tr key={m.week} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2 text-slate-900">Week {m.week}</td>
                <td className="px-3 py-2 text-slate-900">
                  {m.targetWeight.toFixed(1)} kg
                </td>
                <td className="px-3 py-2 text-slate-700">{m.recommendedSets}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[m.status]}`}
                  >
                    {DIFFICULTY_LABEL[m.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
