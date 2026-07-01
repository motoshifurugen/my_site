// フリップ統計カード（components/StatCard.tsx）の表示契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 現行 page.tsx:176-243 の StatCard を抽出する。props は { stat: StatItem; index: number }。
// カードの表裏（label は表、value は裏）はどちらも DOM 上に存在する（表裏は CSS で切替）。
// アイコン・ラベル・値が描画されることを固定する。
//
// data/stats.ts への依存を避けるため、lucide アイコンを直接用いたインライン stat で検証する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は components/StatCard.tsx が未存在のため RED、実装後に GREEN になることを期待する。

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

test('StatCard: 例外なく描画される', () => {
  // Given/When/Then: SSR で throw しない（useState は初期値のまま）
  assert.doesNotThrow(() => render())
})

test('StatCard: ラベル（表面）を表示する', () => {
  // Given/When: stat を描画
  // Then: label が出力される
  assert.ok(render().includes('Classes Taken'))
})

test('StatCard: 値（裏面）を DOM 上に描画する', () => {
  // Given/When: stat を描画
  // Then: 裏面の value も markup に含まれる（表裏は CSS 切替のため両方存在）
  assert.ok(render().includes('512 Hours'))
})

test('StatCard: アイコン（svg）を描画する', () => {
  // Given/When: lucide アイコンを持つ stat を描画
  // Then: svg 要素が出力される
  assert.ok(render().includes('<svg'))
})
