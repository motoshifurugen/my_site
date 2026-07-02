import type { CSSProperties } from 'react'

// ヘッダー各ボタンを左から順に段階表示するための遅延ステップ（ms）。
// この値がヘッダー stagger 全体の間隔を決める単一の情報源。
const STAGGER_STEP_MS = 80

// モバイルメニューを open トリガの CSS transition で段階表示する際の遅延ステップ（ms）。
// 1s keyframe（STAGGER_STEP_MS）とは別系統で、transition-delay に流す
// CSS 変数 --stagger-delay の間隔を決める単一の情報源（1項目 50ms 差）。
const MOBILE_STAGGER_STEP_MS = 50

// index に応じた stagger 用インラインスタイルを返す。
// - md（デスクトップ）用: 1s keyframe を index * 80ms 遅らせて mount 時に段階表示。
//   遅延中は fadeInUp の 0% 状態を保持するため fill-mode を backwards にする
//   （未指定だと遅延中に一瞬フル表示されてしまう）。
// - モバイル用: open トリガの transition-delay に流す --stagger-delay（index * 50ms）。
export const staggerStyle = (index: number): CSSProperties =>
  ({
    animationDelay: `${index * STAGGER_STEP_MS}ms`,
    animationFillMode: 'backwards',
    '--stagger-delay': `${index * MOBILE_STAGGER_STEP_MS}ms`,
  }) as CSSProperties
