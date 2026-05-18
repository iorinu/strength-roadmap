export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseId =
  | 'bench-press'
  | 'squat'
  | 'deadlift'
  | 'overhead-press'
  | 'barbell-row';

export type Difficulty = 'easy' | 'standard' | 'hard' | 'very-hard';

export type Milestone = {
  week: number;
  targetWeight: number;
  recommendedSets: string;
  status: Difficulty;
};

export type LinePoint = { week: number; weight: number };

export type CalcResult = {
  totalWeeks: number;
  weeklyGain: number;
  difficulty: Difficulty;
  milestones: Milestone[];
  idealLine: LinePoint[];
  realisticLine: LinePoint[];
};

export type GoalInput = {
  exercise: ExerciseId;
  currentWeight: number;
  targetWeight: number;
  targetDate: string;
  level: ExperienceLevel;
};
