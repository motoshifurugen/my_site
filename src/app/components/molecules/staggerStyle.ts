import type { CSSProperties } from 'react'

// ヘッダー各ボタンを左から順に段階表示するための遅延ステップ（ms）。
// この値がヘッダー stagger 全体の間隔を決める単一の情報源。
const STAGGER_STEP_MS = 80

// index に応じた stagger 用インラインスタイルを返す。
// 遅延中は fadeInUp の 0% 状態を保持するため fill-mode を backwards にする
// （未指定だと遅延中に一瞬フル表示されてしまう）。
export const staggerStyle = (index: number): CSSProperties => ({
  animationDelay: `${index * STAGGER_STEP_MS}ms`,
  animationFillMode: 'backwards',
})
