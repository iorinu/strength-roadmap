import type { ExerciseId } from '../types';

export const EXERCISES: ReadonlyArray<{ id: ExerciseId; name: string }> = [
  { id: 'bench-press', name: 'ベンチプレス' },
  { id: 'squat', name: 'スクワット' },
  { id: 'deadlift', name: 'デッドリフト' },
  { id: 'overhead-press', name: 'オーバーヘッドプレス' },
  { id: 'barbell-row', name: 'バーベルロウ' },
];

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
