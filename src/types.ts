export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProgressCurve = 'linear' | 'gentle' | 'standard' | 'steep';

export type ExerciseId =
  | 'bench-press'
  | 'squat'
  | 'deadlift'
  | 'overhead-press'
  | 'barbell-row';

export type Difficulty = 'easy' | 'standard' | 'hard' | 'very-hard';

export type Milestone = {
  week: number;
  targetMax: number;       // その週時点の MAX（1RM）目安
  workingWeight: number;   // 実際に練習する重量
  setsReps: string;        // "5×5" など、全週固定
  status: Difficulty;
};

export type LinePoint = { week: number; weight: number };

export type CalcResult = {
  totalWeeks: number;
  weeklyGain: number;          // MAX の週あたり増量 (kg)
  difficulty: Difficulty;
  intensityRatio: number;      // 現在のセット重量 / 現在のMAX（実際の強度比）
  recommendedRatio: number;    // 入力レップ数に対する推奨 1RM 比（Prilepin ベース）
  goalRecommendedWeight: number; // 目標 MAX × recommendedRatio（適正練習重量）
  milestones: Milestone[];
  idealLine: LinePoint[];      // MAX ベース：入力目標ライン
  realisticLine: LinePoint[];  // MAX ベース：経験レベル基準ライン
};

export type GoalInput = {
  exercise: ExerciseId;
  currentMax: number;        // 現在の MAX (1RM)
  targetMax: number;         // 目標の MAX (1RM)
  currentSetWeight: number;  // 現在のメインセットで扱っている重量 (kg)
  sets: number;              // セット数
  reps: number;              // レップ数
  targetDate: string;        // ISO yyyy-mm-dd
  level: ExperienceLevel;
  progressCurve: ProgressCurve; // 週次の進度カーブ
};
