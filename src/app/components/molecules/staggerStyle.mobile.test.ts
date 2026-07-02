// staggerStyle（src/app/components/molecules/staggerStyle.ts）の
// モバイルメニュー用 stagger 契約を固定する単体テスト（Issue #227 UI刷新 5 / TDD 先行）。
//
// #227 はモバイルメニューの項目を open トリガの CSS transition で段階表示する。
// この stagger 間隔は 1s keyframe（#224 の animationDelay 80ms）とは別系統で、
// transition-delay に流す CSS 変数 `--stagger-delay`（1項目 50ms 差）を staggerStyle が
// 単一の情報源として提供する。本テストはその index → --stagger-delay の対応を固定する。
//
// #224 由来の animationDelay（80ms）/ animationFillMode（backwards）は md 用として維持
// されることも併せて固定し、両系統が共存することを保証する。
//
// staggerStyle は type-only import のみで CSS を読まないため直接 import できる。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は --stagger-delay 未提供のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { staggerStyle } from './staggerStyle'

// CSSProperties にはカスタムプロパティのインデックスが無いため Record で受ける。
const asRecord = (index: number): Record<string, unknown> =>
  staggerStyle(index) as unknown as Record<string, unknown>

test('staggerStyle: モバイル用 --stagger-delay を index * 50ms で出力する', () => {
  // Given: リストの 3 番目（index=2）に配置される
  // When: スタイルを生成する
  const style = asRecord(2)
  // Then: 開く時の stagger 用に 1項目 50ms 差の遅延が付く
  assert.equal(style['--stagger-delay'], '100ms', 'index=2 → 100ms')
})

test('staggerStyle: 先頭（index=0）の --stagger-delay は 0ms', () => {
  // Given: リスト先頭
  // When: スタイルを生成する
  const style = asRecord(0)
  // Then: 先頭は遅延ゼロで開く時も最初に出現する
  assert.equal(style['--stagger-delay'], '0ms', 'index=0 → 0ms')
})

test('staggerStyle: 2 番目（index=1）の --stagger-delay は 50ms', () => {
  // Given: リスト 2 番目
  // When: スタイルを生成する
  const style = asRecord(1)
  // Then: 40〜60ms 範囲の 50ms 差が付く
  assert.equal(style['--stagger-delay'], '50ms', 'index=1 → 50ms')
})

test('staggerStyle: md 用の animationDelay（80ms 系）は維持する', () => {
  // Given: index=2
  // When: スタイルを生成する
  const style = staggerStyle(2)
  // Then: #224 のデスクトップ mount stagger（index * 80ms）は据え置き
  assert.equal(
    style.animationDelay,
    '160ms',
    'index=2 → 160ms（md keyframe 用）',
  )
})

test('staggerStyle: md 用の animationFillMode（backwards）は維持する', () => {
  // Given: index=1
  // When: スタイルを生成する
  const style = staggerStyle(1)
  // Then: #224 の fill-mode: backwards は据え置き
  assert.equal(
    style.animationFillMode,
    'backwards',
    'animationFillMode は backwards のまま',
  )
})
