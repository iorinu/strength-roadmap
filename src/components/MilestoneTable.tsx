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
      <h2 className="mb-1 text-sm font-medium text-slate-700">
        週別マイルストーン
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        強度比 {(result.intensityRatio * 100).toFixed(1)}% を維持しながら、MAX に応じて練習重量を更新します。
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-3 py-2 font-medium">週</th>
              <th className="px-3 py-2 font-medium">目標 MAX</th>
              <th className="px-3 py-2 font-medium">練習重量</th>
              <th className="px-3 py-2 font-medium">セット×レップ</th>
              <th className="px-3 py-2 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {result.milestones.map((m) => (
              <tr key={m.week} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2 text-slate-900">Week {m.week}</td>
                <td className="px-3 py-2 text-slate-700">
                  {m.targetMax.toFixed(1)} kg
                </td>
                <td className="px-3 py-2 font-semibold text-slate-900">
                  {m.workingWeight.toFixed(1)} kg
                </td>
                <td className="px-3 py-2 text-slate-700">{m.setsReps}</td>
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
