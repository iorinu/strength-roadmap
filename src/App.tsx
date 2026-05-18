import { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultPanel } from './components/ResultPanel';
import { calcMilestones, type CalcError } from './hooks/useCalcMilestones';
import type { CalcResult, ExerciseId, ExperienceLevel } from './types';

const ERROR_MESSAGE: Record<CalcError, string> = {
  'invalid-weight': '重量は0より大きい数値を入力してください',
  'no-gain': '目標重量は現在重量より大きくしてください',
  'invalid-date': '達成日を入力してください',
  'past-date': '達成日は明日以降を指定してください',
};

function App() {
  const [exercise, setExercise] = useState<ExerciseId>('bench-press');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [currentWeight, setCurrentWeight] = useState<number | ''>('');
  const [targetWeight, setTargetWeight] = useState<number | ''>('');
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<CalcResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (currentWeight === '' || targetWeight === '') {
      setErrorMessage('重量を入力してください');
      setResult(null);
      return;
    }
    const r = calcMilestones({
      exercise,
      currentWeight,
      targetWeight,
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
            currentWeight={currentWeight}
            targetWeight={targetWeight}
            targetDate={targetDate}
            errorMessage={errorMessage}
            onExerciseChange={setExercise}
            onCurrentWeightChange={setCurrentWeight}
            onTargetWeightChange={setTargetWeight}
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
