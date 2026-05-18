import { EXPERIENCE_LEVELS } from '../constants/exercises';
import type { ExperienceLevel } from '../types';

type Props = {
  level: ExperienceLevel;
  onLevelChange: (level: ExperienceLevel) => void;
};

export function Header({ level, onLevelChange }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          strength-roadmap
        </h1>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          経験レベル
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as ExperienceLevel)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
