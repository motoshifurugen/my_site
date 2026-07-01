// IELTS スコアチャート設定（data/ielts.ts）のデータ契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 本 Issue は e-room/page.tsx（1099 行）の責務分割リファクタリング。IELTS のデータ・
// 色・軸設定は page.tsx から data/ielts.ts の `IELTS_CHART: ScoreChartConfig` へ移設される。
// リファクタリングでは描画結果を一切変えないため、移設後も元の値と完全一致することを固定する。
//
// 期待値の出所（現行 page.tsx）:
//   - IELTS_TESTS（8 件, 8/28〜12/05）  … page.tsx:31-96
//   - SKILL_COLORS                      … page.tsx:98-104
//   - Chart の軸設定（min/max/grid/label/target/decimals）… page.tsx:465-495,577
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は data/ielts.ts が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'

type SkillType = 'Overall' | 'Listening' | 'Reading' | 'Writing' | 'Speaking'
interface ScoreTest {
  date: string
  Overall: number
  Listening: number
  Reading: number
  Writing: number
  Speaking: number
}
interface ScoreChartConfig {
  title: string
  tests: ScoreTest[]
  colors: Record<SkillType, string>
  minScore: number
  maxScore: number
  gridLines: number[]
  labels: number[]
  targetScore: number
  labelDecimals: number
}

let IELTS_CHART: ScoreChartConfig
before(async () => {
  IELTS_CHART = (await import('./ielts')).IELTS_CHART as ScoreChartConfig
})

test('ielts: タイトルは "IELTS Score Progress"', () => {
  // Given/When: IELTS_CHART 設定
  // Then: 現行 <h3> と同一のタイトル
  assert.equal(IELTS_CHART.title, 'IELTS Score Progress')
})

test('ielts: 受験データは 8 件', () => {
  // Given/When/Then: IELTS_TESTS は 8/28〜12/05 の 8 件
  assert.equal(IELTS_CHART.tests.length, 8)
})

test('ielts: 先頭データ（8/28）の全スキル値が一致する', () => {
  // Given/When: 先頭要素
  const first = IELTS_CHART.tests[0]
  // Then: page.tsx:32-39 と一致
  assert.deepEqual(first, {
    date: '8/28',
    Overall: 4.38,
    Listening: 4.5,
    Reading: 4.0,
    Writing: 4.5,
    Speaking: 4.5,
  })
})

test('ielts: 末尾データ（12/05）の全スキル値が一致する', () => {
  // Given/When: 末尾要素
  const last = IELTS_CHART.tests[7]
  // Then: page.tsx:88-95 と一致
  assert.deepEqual(last, {
    date: '12/05',
    Overall: 6.38,
    Listening: 7.0,
    Reading: 5.5,
    Writing: 6.5,
    Speaking: 6.5,
  })
})

test('ielts: 全受験日が現行の順序どおり並ぶ', () => {
  // Given/When: 日付列
  const dates = IELTS_CHART.tests.map((t) => t.date)
  // Then: page.tsx の登場順を維持
  assert.deepEqual(dates, [
    '8/28',
    '9/12',
    '9/26',
    '10/10',
    '10/24',
    '11/7',
    '11/21',
    '12/05',
  ])
})

test('ielts: スキル色は現行 SKILL_COLORS と完全一致する', () => {
  // Given/When/Then: page.tsx:98-104 の値
  assert.deepEqual(IELTS_CHART.colors, {
    Overall: '#008080',
    Listening: '#4A90E2',
    Reading: '#50C878',
    Writing: '#FF8C00',
    Speaking: '#9B59B6',
  })
})

test('ielts: スコア軸の範囲は 3.0〜9.0', () => {
  // Given/When/Then: page.tsx:465-466
  assert.equal(IELTS_CHART.minScore, 3.0)
  assert.equal(IELTS_CHART.maxScore, 9.0)
})

test('ielts: Y 軸グリッド線は 0.5 刻み（3.0〜9.0）', () => {
  // Given/When/Then: page.tsx:491-493 と一致
  assert.deepEqual(
    IELTS_CHART.gridLines,
    [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0],
  )
})

test('ielts: Y 軸ラベルは 1.0 刻み（3.0〜9.0）', () => {
  // Given/When/Then: page.tsx:495 と一致
  assert.deepEqual(IELTS_CHART.labels, [3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0])
})

test('ielts: 目標スコア（goal 線）は 6.5', () => {
  // Given/When/Then: page.tsx:577
  assert.equal(IELTS_CHART.targetScore, 6.5)
})

test('ielts: Y 軸ラベルの小数桁は 1（toFixed(1) 相当）', () => {
  // Given/When/Then: 現行は score.toFixed(1)（page.tsx:570）
  assert.equal(IELTS_CHART.labelDecimals, 1)
})
