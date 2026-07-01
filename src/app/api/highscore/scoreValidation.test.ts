// Issue #158 / TDD 先行: ハイスコア検証の純粋関数 scoreValidation.ts の契約を固定する。
//
// 現行 route.tsx の POST は `typeof score !== 'number'` のみで検証しており、
// typeof NaN === 'number' / typeof Infinity === 'number' のため NaN・Infinity・
// 負値・巨大値・小数がすべて型チェックを通過して Issue 本文を上書きできてしまう。
// isValidScore はこの穴を塞ぎ、「0 以上 MAX_HIGH_SCORE 以下の整数」のみを受理する。
//
// 実行: `npm test`（node --import tsx --test）。実装前は import で RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isValidScore, MAX_HIGH_SCORE } from './scoreValidation'

test('MAX_HIGH_SCORE は上限として 100000（正の整数）である', () => {
  // Given: 計画で定義された安全上限
  // Then: 正の整数の 100000
  assert.equal(MAX_HIGH_SCORE, 100_000)
  assert.equal(Number.isInteger(MAX_HIGH_SCORE), true)
})

test('isValidScore: 0 は有効', () => {
  // Given: 下限値 0
  // When: 検証する
  // Then: 受理される
  assert.equal(isValidScore(0), true)
})

test('isValidScore: 通常の正の整数は有効', () => {
  // Given: 人間のプレイで到達しうるスコア
  // Then: 受理される
  assert.equal(isValidScore(42), true)
  assert.equal(isValidScore(1), true)
})

test('isValidScore: 上限 MAX_HIGH_SCORE ちょうどは有効（境界値）', () => {
  // Given: 上限境界
  // Then: 受理される
  assert.equal(isValidScore(MAX_HIGH_SCORE), true)
})

test('isValidScore: MAX_HIGH_SCORE + 1 は無効（境界値）', () => {
  // Given: 上限を 1 超えた値
  // Then: 拒否される（巨大値偽装の拒否）
  assert.equal(isValidScore(MAX_HIGH_SCORE + 1), false)
})

test('isValidScore: 負値は無効', () => {
  // Given: 負のスコア
  // Then: 拒否される
  assert.equal(isValidScore(-1), false)
  assert.equal(isValidScore(-100), false)
})

test('isValidScore: 小数は無効', () => {
  // Given: 非整数
  // Then: 拒否される
  assert.equal(isValidScore(1.5), false)
  assert.equal(isValidScore(0.1), false)
})

test('isValidScore: NaN は無効（typeof の穴を塞ぐ）', () => {
  // Given: NaN（typeof NaN === 'number'）
  // Then: 拒否される
  assert.equal(isValidScore(NaN), false)
})

test('isValidScore: Infinity / -Infinity は無効（typeof の穴を塞ぐ）', () => {
  // Given: 無限大（typeof Infinity === 'number'）
  // Then: 拒否される
  assert.equal(isValidScore(Infinity), false)
  assert.equal(isValidScore(-Infinity), false)
})

test('isValidScore: 巨大値（Number.MAX_VALUE）は無効', () => {
  // Given: 明らかな偽装の巨大値
  // Then: 拒否される
  assert.equal(isValidScore(Number.MAX_VALUE), false)
  assert.equal(isValidScore(1e12), false)
})

test('isValidScore: number 以外の型は無効', () => {
  // Given: 数値でない入力（外部 JSON からの改ざん）
  // Then: すべて拒否される
  assert.equal(isValidScore('42'), false)
  assert.equal(isValidScore(null), false)
  assert.equal(isValidScore(undefined), false)
  assert.equal(isValidScore(true), false)
  assert.equal(isValidScore({}), false)
  assert.equal(isValidScore([]), false)
})
