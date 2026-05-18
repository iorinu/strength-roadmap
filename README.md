# strength-roadmap

**Live:** https://strength-roadmap.vercel.app/

目標重量 × 達成日を入力すると、週ごとのマイルストーンを科学的根拠つきで逆算するダッシュボード型 SPA。

## 機能

- 5 種目に対応：ベンチプレス / スクワット / デッドリフト / オーバーヘッドプレス / バーベルロウ
- **現在の MAX**・**目標 MAX**・**達成日**・**現在のメインセット (重量 × セット × レップ)** を入力 →
  - 達成までの週数 / 週あたり MAX 増量 / 達成難易度 / 適正重量
  - 週別マイルストーン（目標 MAX / 練習重量 / セット × レップ / 難易度）
  - Recharts による進捗グラフ（理想ライン vs 経験レベル基準ライン）
- 種目別の最小増量（上半身 2.5kg / 下半身 5kg）に丸めた練習重量
- NSCA Training Load Chart (Landers, 1984) に基づくレップ数→1RM 比換算
- 結果エリアを **PNG / PDF でエクスポート** 可能

## 技術スタック

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite` プラグイン)
- Recharts（グラフ）
- html-to-image + jsPDF（PNG/PDF エクスポート）
- Vercel（ホスティング、`git push` で自動デプロイ）

## ローカル開発

```bash
npm install
npm run dev      # 開発サーバー (http://localhost:5173)
npm run build    # 型チェック + 本番ビルド
npm run preview  # ビルド成果物のプレビュー
npm run lint     # ESLint
```

## プロジェクト構成

```
src/
├── App.tsx                       # state 管理 + レイアウト
├── main.tsx
├── index.css                     # Tailwind import のみ
├── types.ts                      # 共通型
├── constants/
│   └── exercises.ts              # 種目プリセット / 最小増量
├── hooks/
│   └── useCalcMilestones.ts      # 逆算ロジック (純粋関数 + useMemo)
├── utils/
│   └── exportResult.ts           # PNG / PDF エクスポート
└── components/
    ├── Header.tsx                # 経験レベル選択
    ├── InputPanel.tsx
    │   ├── ExerciseTabs.tsx
    │   └── GoalForm.tsx
    └── ResultPanel.tsx
        ├── MetricCards.tsx
        ├── ProgressChart.tsx
        └── MilestoneTable.tsx
```

## 計算ロジックの根拠

`src/hooks/useCalcMilestones.ts` に集約。

- **週あたり MAX 伸び率**（経験レベル別）：
  - Novice 3% / Intermediate 0.75% / Advanced 0.2%
  - 出典：Setgraph / Barbell Medicine 系の通説、筋力対数曲線
- **強度比固定スケーリング**：
  - 強度比 = 現在のセット重量 ÷ 現在 MAX
  - 各週の練習重量 = その週の MAX × 強度比（強度比は全週一定）
- **レップ数 → 推奨 1RM 比**：
  - NSCA Training Load Chart (Landers, J. *NSCA J* 6(6):60-61, 1984)
  - NSCA *Essentials of Strength and Conditioning* Table 17.7 に収録
  - セット数は加味しない単発限界 RM ベース
- **種目別の最小増量**：
  - 上半身（ベンチ / OHP / ロウ）：2.5kg
  - 下半身（スクワット / デッドリフト）：5kg
  - 出典：StrongLifts 5×5 / Starting Strength の一般的推奨値

## ライセンス

未設定。
