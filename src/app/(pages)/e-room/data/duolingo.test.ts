// Duolingo スコアチャート設定（data/duolingo.ts）のデータ契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// Duolingo のデータ・色・軸設定は page.tsx から data/duolingo.ts の
// `DUOLINGO_CHART: ScoreChartConfig` へ移設される。リファクタリングでは描画結果を
// 変えないため、移設後も元の値と完全一致することを固定する。
//
// 期待値の出所（現行 page.tsx）:
//   - DUOLINGO_TESTS（有効 2 件, 4/6 と 11/1。11/30 はコメントアウト済みで描画されない）
//                                        … page.tsx:106-131
//   - DUOLINGO_SKILL_COLORS             … page.tsx:133-139
//   - DuolingoChart の軸設定             … page.tsx:692-720,802
//
// 重要: コメントアウト済み 11/30 データ（page.tsx:123-130）は現状描画されないため、
// 移行後も含めない（tests.length === 2 を固定する）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は data/duolingo.ts が未存在のため RED、実装後に GREEN になることを期待する。

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

let DUOLINGO_CHART: ScoreChartConfig
before(async () => {
  DUOLINGO_CHART = (await import('./duolingo'))
    .DUOLINGO_CHART as ScoreChartConfig
})

test('duolingo: タイトルは "Duolingo English Test Score Progress"', () => {
  // Given/When/Then: 現行 <h3>（page.tsx:725）と同一
  assert.equal(DUOLINGO_CHART.title, 'Duolingo English Test Score Progress')
})

test('duolingo: 有効な受験データは 2 件（11/30 は復活させない）', () => {
  // Given/When/Then: コメントアウト済みデータを除いた 2 件のみ
  assert.equal(DUOLINGO_CHART.tests.length, 2)
})

test('duolingo: 先頭データ（4/6）の全スキル値が一致する', () => {
  // Given/When: 先頭要素
  const first = DUOLINGO_CHART.tests[0]
  // Then: page.tsx:107-114 と一致
  assert.deepEqual(first, {
    date: '4/6',
    Overall: 71.25,
    Listening: 70,
    Reading: 85,
    Writing: 60,
    Speaking: 70,
  })
})

test('duolingo: 末尾データ（11/1）の全スキル値が一致する', () => {
  // Given/When: 末尾要素
  const last = DUOLINGO_CHART.tests[1]
  // Then: page.tsx:115-122 と一致
  assert.deepEqual(last, {
    date: '11/1',
    Overall: 91.25,
    Listening: 85,
    Reading: 110,
    Writing: 90,
    Speaking: 80,
  })
})

test('duolingo: スキル色は現行 DUOLINGO_SKILL_COLORS と完全一致する', () => {
  // Given/When/Then: page.tsx:133-139 の値（IELTS と同値）
  assert.deepEqual(DUOLINGO_CHART.colors, {
    Overall: '#008080',
    Listening: '#4A90E2',
    Reading: '#50C878',
    Writing: '#FF8C00',
    Speaking: '#9B59B6',
  })
})

test('duolingo: スコア軸の範囲は 40〜140', () => {
  // Given/When/Then: page.tsx:692-693
  assert.equal(DUOLINGO_CHART.minScore, 40)
  assert.equal(DUOLINGO_CHART.maxScore, 140)
})

test('duolingo: Y 軸グリッド線は現行の配列と一致する', () => {
  // Given/When/Then: page.tsx:718 と一致
  assert.deepEqual(
    DUOLINGO_CHART.gridLines,
    [40, 50, 60, 70, 80, 90, 100, 110, 115, 120, 130, 140],
  )
})

test('duolingo: Y 軸ラベルは 20 刻み（40〜140）', () => {
  // Given/When/Then: page.tsx:720 と一致
  assert.deepEqual(DUOLINGO_CHART.labels, [40, 60, 80, 100, 120, 140])
})

test('duolingo: 目標スコア（goal 線）は 115', () => {
  // Given/When/Then: page.tsx:802
  assert.equal(DUOLINGO_CHART.targetScore, 115)
})

test('duolingo: Y 軸ラベルの小数桁は 0（整数表示）', () => {
  // Given/When/Then: 現行は {score}（整数, page.tsx:795）
  assert.equal(DUOLINGO_CHART.labelDecimals, 0)
})
