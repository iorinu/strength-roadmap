type Props = {
  currentWeight: number | '';
  targetWeight: number | '';
  targetDate: string;
  errorMessage: string | null;
  onCurrentWeightChange: (v: number | '') => void;
  onTargetWeightChange: (v: number | '') => void;
  onTargetDateChange: (v: string) => void;
  onSubmit: () => void;
};

export function GoalForm({
  currentWeight,
  targetWeight,
  targetDate,
  errorMessage,
  onCurrentWeightChange,
  onTargetWeightChange,
  onTargetDateChange,
  onSubmit,
}: Props) {
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

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          現在の重量 (kg)
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={currentWeight}
          onChange={(e) => handleNumber(e.target.value, onCurrentWeightChange)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="例: 60"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          目標重量 (kg)
        </label>
        <input
          type="number"
          step="0.5"
          min="0"
          value={targetWeight}
          onChange={(e) => handleNumber(e.target.value, onTargetWeightChange)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="例: 80"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          達成したい日
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => onTargetDateChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      {errorMessage && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
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
