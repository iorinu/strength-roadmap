import type { CalcResult } from '../types';
import { MetricCards } from './MetricCards';
import { MilestoneTable } from './MilestoneTable';
import { ProgressChart } from './ProgressChart';

type Props = { result: CalcResult | null };

export function ResultPanel({ result }: Props) {
  if (!result) {
    return (
      <section className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-sm text-slate-500">
        左側で目標を入力し「逆算する」を押してください
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <MetricCards result={result} />
      <ProgressChart result={result} />
      <MilestoneTable result={result} />
    </section>
  );
}
