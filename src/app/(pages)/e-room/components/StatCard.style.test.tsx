// StatCard の角丸統一・影集約の契約を固定する単体テスト
// （Issue #223 UI刷新 1/3 / TDD 先行）。
//
// #223 はカード類の角丸を rounded-lg に統一し、shadow-sm を boxShadow の
// card トークンへ集約する。StatCard は表裏 2 面（rounded-2xl + shadow-sm）を
// 持つフリップカードのため、両面が rounded-lg + shadow-card になることを固定する。
//
// 既存の StatCard.test.tsx と同じく、node:test と renderToStaticMarkup のみで構成する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は rounded-2xl/shadow-sm のままのため RED、実装後に GREEN になることを期待する。

import { BookOpen } from 'lucide-react'
import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

interface StatItem {
  icon: unknown
  label: string
  value: string
}
type StatCardProps = { stat: StatItem; index: number }

const stat: StatItem = {
  icon: BookOpen,
  label: 'Classes Taken',
  value: '512 Hours',
}

let StatCard: React.FC<StatCardProps>
before(async () => {
  StatCard = (await import('./StatCard'))
    .default as unknown as React.FC<StatCardProps>
})

const render = () => renderToStaticMarkup(<StatCard stat={stat} index={0} />)

test('StatCard: 角丸を rounded-lg に統一する', () => {
  // Given/When: StatCard を描画する
  const html = render()
  // Then: rounded-lg に統一されている
  assert.ok(html.includes('rounded-lg'), 'rounded-lg を含む')
})

test('StatCard: 旧 rounded-2xl を残さない', () => {
  // Given/When: StatCard を描画する
  const html = render()
  // Then: 角丸統一により rounded-2xl は使われていない
  assert.ok(!html.includes('rounded-2xl'), 'rounded-2xl を含まない')
})

test('StatCard: 影を shadow-card トークンに集約する', () => {
  // Given/When: StatCard を描画する
  const html = render()
  // Then: shadow-card（基底トークン）へ集約されている
  assert.match(html, /shadow-card(?!-hover)/, 'shadow-card を含む')
})

test('StatCard: 旧 shadow-sm を残さない', () => {
  // Given/When: StatCard を描画する
  const html = render()
  // Then: 集約により shadow-sm は使われていない
  assert.ok(!html.includes('shadow-sm'), 'shadow-sm を含まない')
})
