type Props = {
  currentMax: number | '';
  targetMax: number | '';
  currentSetWeight: number | '';
  sets: number | '';
  reps: number | '';
  targetDate: string;
  errorMessage: string | null;
  onCurrentMaxChange: (v: number | '') => void;
  onTargetMaxChange: (v: number | '') => void;
  onCurrentSetWeightChange: (v: number | '') => void;
  onSetsChange: (v: number | '') => void;
  onRepsChange: (v: number | '') => void;
  onTargetDateChange: (v: string) => void;
  onSubmit: () => void;
};

export function GoalForm(props: Props) {
  const handleNumber = (
    raw: string,
    setter: (v: number | '') => void,
  ) => {
    if (raw === '') {
      setter('');
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n)) setter(n);
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';
  const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <div>
        <label className={labelClass}>現在の MAX (1RM, kg)</label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={props.currentMax}
          onChange={(e) => handleNumber(e.target.value, props.onCurrentMaxChange)}
          className={inputClass}
          placeholder="例: 100"
        />
      </div>
      <div>
        <label className={labelClass}>目標 MAX (1RM, kg)</label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={props.targetMax}
          onChange={(e) => handleNumber(e.target.value, props.onTargetMaxChange)}
          className={inputClass}
          placeholder="例: 120"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className={labelClass}>現在のメインセット</p>
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1">
          <input
            type="number"
            step="0.5"
            min="0"
            value={props.currentSetWeight}
            onChange={(e) => handleNumber(e.target.value, props.onCurrentSetWeightChange)}
            className={inputClass}
            placeholder="kg"
          />
          <span className="px-1 text-slate-500">×</span>
          <input
            type="number"
            step="1"
            min="1"
            value={props.sets}
            onChange={(e) => handleNumber(e.target.value, props.onSetsChange)}
            className={inputClass}
            placeholder="セット"
          />
          <span className="px-1 text-slate-500">×</span>
          <input
            type="number"
            step="1"
            min="1"
            value={props.reps}
            onChange={(e) => handleNumber(e.target.value, props.onRepsChange)}
            className={inputClass}
            placeholder="レップ"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          例：80 × 5 × 5（80kg を 5セット × 5レップ）
        </p>
      </div>

      <div>
        <label className={labelClass}>達成したい日</label>
        <input
          type="date"
          value={props.targetDate}
          onChange={(e) => props.onTargetDateChange(e.target.value)}
          className={inputClass}
        />
      </div>
      {props.errorMessage && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {props.errorMessage}
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        逆算する
      </button>
    </form>
  );
}
