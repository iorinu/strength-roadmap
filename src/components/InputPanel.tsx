import type { ExerciseId } from '../types';
import { ExerciseTabs } from './ExerciseTabs';
import { GoalForm } from './GoalForm';

type Props = {
  exercise: ExerciseId;
  currentMax: number | '';
  targetMax: number | '';
  currentSetWeight: number | '';
  sets: number | '';
  reps: number | '';
  targetDate: string;
  errorMessage: string | null;
  onExerciseChange: (id: ExerciseId) => void;
  onCurrentMaxChange: (v: number | '') => void;
  onTargetMaxChange: (v: number | '') => void;
  onCurrentSetWeightChange: (v: number | '') => void;
  onSetsChange: (v: number | '') => void;
  onRepsChange: (v: number | '') => void;
  onTargetDateChange: (v: string) => void;
  onSubmit: () => void;
};

export function InputPanel(props: Props) {
  return (
    <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <ExerciseTabs value={props.exercise} onChange={props.onExerciseChange} />
      <GoalForm
        currentMax={props.currentMax}
        targetMax={props.targetMax}
        currentSetWeight={props.currentSetWeight}
        sets={props.sets}
        reps={props.reps}
        targetDate={props.targetDate}
        errorMessage={props.errorMessage}
        onCurrentMaxChange={props.onCurrentMaxChange}
        onTargetMaxChange={props.onTargetMaxChange}
        onCurrentSetWeightChange={props.onCurrentSetWeightChange}
        onSetsChange={props.onSetsChange}
        onRepsChange={props.onRepsChange}
        onTargetDateChange={props.onTargetDateChange}
        onSubmit={props.onSubmit}
      />
    </aside>
  );
}
