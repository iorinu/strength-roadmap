import type { ExerciseId } from '../types';

export const EXERCISES: ReadonlyArray<{ id: ExerciseId; name: string }> = [
  { id: 'bench-press', name: 'ベンチプレス' },
  { id: 'squat', name: 'スクワット' },
  { id: 'deadlift', name: 'デッドリフト' },
  { id: 'overhead-press', name: 'オーバーヘッドプレス' },
  { id: 'barbell-row', name: 'バーベルロウ' },
];

// 種目別の最小増量 (kg)。
// 上半身・小筋群 (ベンチ/OHP/ロウ) は 2.5kg、下半身・大筋群 (スクワット/デッドリフト) は 5kg。
// 出典：StrongLifts 5×5 / Starting Strength の一般的な推奨値。
export const MIN_INCREMENT: Record<ExerciseId, number> = {
  'bench-press': 2.5,
  squat: 5,
  deadlift: 5,
  'overhead-press': 2.5,
  'barbell-row': 2.5,
};

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', name: '初心者（〜6ヶ月）' },
  { id: 'intermediate', name: '中級者（6ヶ月〜2年）' },
  { id: 'advanced', name: '上級者（2年以上）' },
] as const;

export const DIFFICULTY_LABEL = {
  easy: '余裕',
  standard: '標準',
  hard: 'やや高め',
  'very-hard': '困難',
} as const;
