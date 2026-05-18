import { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultPanel } from './components/ResultPanel';
import { calcMilestones, type CalcError } from './hooks/useCalcMilestones';
import type { CalcResult, ExerciseId, ExperienceLevel } from './types';

const ERROR_MESSAGE: Record<CalcError, string> = {
  'invalid-weight': 'MAX は 0 より大きい数値を入力してください',
  'no-gain': '目標 MAX は現在 MAX より大きくしてください',
  'invalid-set-weight': '現在のセット重量は MAX 以下の正の数値で入力してください',
  'invalid-sets-reps': 'セット数・レップ数は 1 以上の整数で入力してください',
  'invalid-date': '達成日を入力してください',
  'past-date': '達成日は明日以降を指定してください',
};

function App() {
  const [exercise, setExercise] = useState<ExerciseId>('bench-press');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [currentMax, setCurrentMax] = useState<number | ''>('');
  const [targetMax, setTargetMax] = useState<number | ''>('');
  const [currentSetWeight, setCurrentSetWeight] = useState<number | ''>('');
  const [sets, setSets] = useState<number | ''>('');
  const [reps, setReps] = useState<number | ''>('');
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<CalcResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (
      currentMax === '' ||
      targetMax === '' ||
      currentSetWeight === '' ||
      sets === '' ||
      reps === ''
    ) {
      setErrorMessage('すべての項目を入力してください');
      setResult(null);
      return;
    }
    const r = calcMilestones({
      exercise,
      currentMax,
      targetMax,
      currentSetWeight,
      sets,
      reps,
      targetDate,
      level,
    });
    if (r.ok) {
      setErrorMessage(null);
      setResult(r.data);
    } else {
      setErrorMessage(ERROR_MESSAGE[r.error]);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header level={level} onLevelChange={setLevel} />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <InputPanel
            exercise={exercise}
            currentMax={currentMax}
            targetMax={targetMax}
            currentSetWeight={currentSetWeight}
            sets={sets}
            reps={reps}
            targetDate={targetDate}
            errorMessage={errorMessage}
            onExerciseChange={setExercise}
            onCurrentMaxChange={setCurrentMax}
            onTargetMaxChange={setTargetMax}
            onCurrentSetWeightChange={setCurrentSetWeight}
            onSetsChange={setSets}
            onRepsChange={setReps}
            onTargetDateChange={setTargetDate}
            onSubmit={handleSubmit}
          />
          <ResultPanel result={result} />
        </div>
      </main>
    </div>
  );
}

export default App;
