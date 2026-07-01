// 設定駆動スコアチャート（components/ScoreChart.tsx）の表示契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 現行 page.tsx の Chart(457-682) と DuolingoChart(684-907) はほぼ同一の SVG 描画で、
// 差分はタイトル / データ / min-max / グリッド線・ラベル / 目標線の値 / ラベル小数桁 / 色のみ。
// これらを 1 つの ScoreChart({ config: ScoreChartConfig }) に統合する。
// 本テストは「同一コンポーネントが config によって IELTS 相当 / Duolingo 相当の両方を
// 現行と同じ出力で描き分ける」ことを固定する（描画結果を変えないリファクタリングの担保）。
//
// データモジュール（data/ielts.ts 等）とは独立に検証するため、代表的な差分を持つ
// インライン config で描画契約のみを確認する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は components/ScoreChart.tsx が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

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

const SKILL_COLORS: Record<SkillType, string> = {
  Overall: '#008080',
  Listening: '#4A90E2',
  Reading: '#50C878',
  Writing: '#FF8C00',
  Speaking: '#9B59B6',
}

// IELTS 相当（labelDecimals=1, target=6）のインライン config
const configDecimal: ScoreChartConfig = {
  title: 'Decimal Chart',
  tests: [
    {
      date: 'DA',
      Overall: 5,
      Listening: 5,
      Reading: 5,
      Writing: 5,
      Speaking: 5,
    },
    {
      date: 'DB',
      Overall: 7,
      Listening: 7,
      Reading: 7,
      Writing: 7,
      Speaking: 7,
    },
  ],
  colors: SKILL_COLORS,
  minScore: 3,
  maxScore: 9,
  gridLines: [3, 4, 5, 6, 7, 8, 9],
  labels: [3, 6, 9],
  targetScore: 6,
  labelDecimals: 1,
}

// Duolingo 相当（labelDecimals=0, target=115）のインライン config
const configInteger: ScoreChartConfig = {
  title: 'Integer Chart',
  tests: [
    {
      date: 'EA',
      Overall: 60,
      Listening: 60,
      Reading: 60,
      Writing: 60,
      Speaking: 60,
    },
    {
      date: 'EB',
      Overall: 90,
      Listening: 90,
      Reading: 90,
      Writing: 90,
      Speaking: 90,
    },
  ],
  colors: SKILL_COLORS,
  minScore: 40,
  maxScore: 140,
  gridLines: [40, 60, 80, 100, 115, 120, 140],
  labels: [40, 60, 80],
  targetScore: 115,
  labelDecimals: 0,
}

let ScoreChart: React.FC<{ config: ScoreChartConfig }>
before(async () => {
  ScoreChart = (await import('./ScoreChart')).default as unknown as React.FC<{
    config: ScoreChartConfig
  }>
})

const render = (config: ScoreChartConfig) =>
  renderToStaticMarkup(<ScoreChart config={config} />)

test('ScoreChart: config 描画で例外を投げない', () => {
  // Given/When/Then: 両 config とも throw しない
  assert.doesNotThrow(() => render(configDecimal))
  assert.doesNotThrow(() => render(configInteger))
})

test('ScoreChart: config.title を見出しに表示する', () => {
  // Given/When: 異なる title の 2 config を同一コンポーネントで描画
  // Then: それぞれの title が出力される（描き分けの担保）
  assert.ok(render(configDecimal).includes('Decimal Chart'))
  assert.ok(render(configInteger).includes('Integer Chart'))
})

test('ScoreChart: 凡例に 5 スキル名をすべて表示する', () => {
  // Given/When: IELTS 相当 config を描画
  const html = render(configDecimal)
  // Then: 現行 Legend と同じ 5 スキル名
  for (const skill of [
    'Overall',
    'Listening',
    'Reading',
    'Writing',
    'Speaking',
  ]) {
    assert.ok(html.includes(skill), `${skill} が凡例に含まれる`)
  }
})

test('ScoreChart: X 軸に config.tests の日付を表示する', () => {
  // Given/When: 日付 DA/DB を持つ config
  const html = render(configDecimal)
  // Then: 各受験日ラベルが出力される
  assert.ok(html.includes('>DA<'))
  assert.ok(html.includes('>DB<'))
})

test('ScoreChart: labelDecimals=1 のとき Y 軸ラベルを小数第1位で表示する', () => {
  // Given/When: labelDecimals=1 の config（labels: 3,6,9）
  const html = render(configDecimal)
  // Then: toFixed(1) 相当で '3.0' / '9.0' が出力される
  assert.ok(html.includes('>3.0<'))
  assert.ok(html.includes('>9.0<'))
})

test('ScoreChart: labelDecimals=0 のとき Y 軸ラベルを整数で表示する', () => {
  // Given/When: labelDecimals=0 の config（labels: 40,60,80）
  const html = render(configInteger)
  // Then: '40' は整数のまま。'40.0' のような小数表記にはしない
  assert.ok(html.includes('>40<'))
  assert.ok(!html.includes('>40.0<'))
})

test('ScoreChart: 目標線（goal ラベル）を表示する', () => {
  // Given/When: targetScore を持つ config
  // Then: 現行と同じ 'goal' ラベルを両 config で描く
  assert.ok(render(configDecimal).includes('goal'))
  assert.ok(render(configInteger).includes('goal'))
})

test('ScoreChart: 目標線・グリッド線の色を現行と同じ値で描く', () => {
  // Given/When: config を描画
  const html = render(configDecimal)
  // Then: 目標線 #FF6B6B / グリッド線 #E5E7E6（page.tsx と同一）
  assert.ok(html.includes('#FF6B6B'))
  assert.ok(html.includes('#E5E7E6'))
})

test('ScoreChart: データ線に config.colors の色を用いる', () => {
  // Given/When: Overall 色 #008080 を含む config
  const html = render(configDecimal)
  // Then: スキル色がストロークとして出力される
  assert.ok(html.includes('#008080'))
})
