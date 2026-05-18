import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CalcResult } from '../types';

type Props = { result: CalcResult };

export function ProgressChart({ result }: Props) {
  const data = result.idealLine.map((p, i) => ({
    week: p.week,
    目標: p.weight,
    現実的: result.realisticLine[i]?.weight,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-medium text-slate-700">進捗グラフ</h2>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: '週', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="目標"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="現実的"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
