import { EXERCISES } from '../constants/exercises';
import type { ExerciseId } from '../types';

type Props = {
  value: ExerciseId;
  onChange: (id: ExerciseId) => void;
};

export function ExerciseTabs({ value, onChange }: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">種目</p>
      <div className="flex flex-wrap gap-2">
        {EXERCISES.map((ex) => {
          const active = ex.id === value;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => onChange(ex.id)}
              className={
                active
                  ? 'rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm'
                  : 'rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
              }
            >
              {ex.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
