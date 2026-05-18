import type { ExerciseId } from '../types';
import { ExerciseTabs } from './ExerciseTabs';
import { GoalForm } from './GoalForm';

type Props = {
  exercise: ExerciseId;
  currentWeight: number | '';
  targetWeight: number | '';
  targetDate: string;
  errorMessage: string | null;
  onExerciseChange: (id: ExerciseId) => void;
  onCurrentWeightChange: (v: number | '') => void;
  onTargetWeightChange: (v: number | '') => void;
  onTargetDateChange: (v: string) => void;
  onSubmit: () => void;
};

export function InputPanel(props: Props) {
  return (
    <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <ExerciseTabs value={props.exercise} onChange={props.onExerciseChange} />
      <GoalForm
        currentWeight={props.currentWeight}
        targetWeight={props.targetWeight}
        targetDate={props.targetDate}
        errorMessage={props.errorMessage}
        onCurrentWeightChange={props.onCurrentWeightChange}
        onTargetWeightChange={props.onTargetWeightChange}
        onTargetDateChange={props.onTargetDateChange}
        onSubmit={props.onSubmit}
      />
    </aside>
  );
}
