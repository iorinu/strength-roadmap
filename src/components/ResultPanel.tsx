import { useRef, useState } from 'react';
import type { CalcResult } from '../types';
import { exportAsPdf, exportAsPng } from '../utils/exportResult';
import { MetricCards } from './MetricCards';
import { MilestoneTable } from './MilestoneTable';
import { ProgressChart } from './ProgressChart';

type Props = { result: CalcResult | null };

function buildFilename(ext: 'png' | 'pdf'): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `strength-roadmap-${ymd}.${ext}`;
}

export function ResultPanel({ result }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<null | 'png' | 'pdf'>(null);
  const [error, setError] = useState<string | null>(null);

  if (!result) {
    return (
      <section className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-sm text-slate-500">
        左側で目標を入力し「逆算する」を押してください
      </section>
    );
  }

  const handleExport = async (kind: 'png' | 'pdf') => {
    const node = captureRef.current;
    if (!node || exporting) return;
    setExporting(kind);
    setError(null);
    try {
      const filename = buildFilename(kind);
      if (kind === 'png') {
        await exportAsPng(node, filename);
      } else {
        await exportAsPdf(node, filename);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存に失敗しました');
    } finally {
      setExporting(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting === 'png' ? '生成中…' : '画像で保存'}
        </button>
        <button
          type="button"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting === 'pdf' ? '生成中…' : 'PDF で保存'}
        </button>
      </div>
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div ref={captureRef} className="space-y-6">
        <MetricCards result={result} />
        <ProgressChart result={result} />
        <MilestoneTable result={result} />
      </div>
    </section>
  );
}
