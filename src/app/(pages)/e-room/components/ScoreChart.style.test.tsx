// ScoreChart の角丸統一・影集約の契約を固定する単体テスト
// （Issue #223 UI刷新 1/3 / TDD 先行）。
//
// #223 はカード類の角丸を rounded-lg に統一し、shadow-sm を boxShadow の
// card トークンへ集約する。ScoreChart の外枠パネル（rounded-2xl + shadow-sm）が
// rounded-lg + shadow-card になることを固定する。データ描画（色・ラベル等）は
// 既存 ScoreChart.test.tsx が担保するため、本テストは外枠のトークンのみを対象とする。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は rounded-2xl/shadow-sm のままのため RED、実装後に GREEN になることを期待する。

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

const config: ScoreChartConfig = {
  title: 'Sample Chart',
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
  colors: {
    Overall: '#008080',
    Listening: '#4A90E2',
    Reading: '#50C878',
    Writing: '#FF8C00',
    Speaking: '#9B59B6',
  },
  minScore: 3,
  maxScore: 9,
  gridLines: [3, 4, 5, 6, 7, 8, 9],
  labels: [3, 6, 9],
  targetScore: 6,
  labelDecimals: 1,
}

let ScoreChart: React.FC<{ config: ScoreChartConfig }>
before(async () => {
  ScoreChart = (await import('./ScoreChart')).default as unknown as React.FC<{
    config: ScoreChartConfig
  }>
})

const render = () => renderToStaticMarkup(<ScoreChart config={config} />)

test('ScoreChart: 外枠の角丸を rounded-lg に統一する', () => {
  // Given/When: ScoreChart を描画する
  const html = render()
  // Then: rounded-lg に統一されている
  assert.ok(html.includes('rounded-lg'), 'rounded-lg を含む')
})

test('ScoreChart: 旧 rounded-2xl を残さない', () => {
  // Given/When: ScoreChart を描画する
  const html = render()
  // Then: 角丸統一により rounded-2xl は使われていない
  assert.ok(!html.includes('rounded-2xl'), 'rounded-2xl を含まない')
})

test('ScoreChart: 外枠の影を shadow-card トークンに集約する', () => {
  // Given/When: ScoreChart を描画する
  const html = render()
  // Then: shadow-card（基底トークン）へ集約されている
  assert.match(html, /shadow-card(?!-hover)/, 'shadow-card を含む')
})

test('ScoreChart: 旧 shadow-sm を残さない', () => {
  // Given/When: ScoreChart を描画する
  const html = render()
  // Then: 集約により shadow-sm は使われていない
  assert.ok(!html.includes('shadow-sm'), 'shadow-sm を含まない')
})
