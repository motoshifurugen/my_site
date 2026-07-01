// Fun Stats データ（data/stats.ts）の契約を固定する単体テスト（Issue #162 / TDD 先行）。
//
// STATS（8 件のフリップカード用データ）は page.tsx から data/stats.ts へ移設される。
// 各要素は { icon: LucideIcon; label: string; value: string }。リファクタリングでは
// 表示文言を変えないため、ラベル・値・件数・順序が現行（page.tsx:159-172）と一致することを固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は data/stats.ts が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'

interface StatItem {
  icon: unknown
  label: string
  value: string
}

let STATS: StatItem[]
before(async () => {
  STATS = (await import('./stats')).STATS as StatItem[]
})

test('stats: 件数は 8', () => {
  // Given/When/Then: page.tsx:159-172 の 8 件
  assert.equal(STATS.length, 8)
})

test('stats: 各要素は icon（定義済み）と label/value（非空文字列）を持つ', () => {
  // Given/When: 全要素
  // Then: icon はコンポーネント（関数 or forwardRef オブジェクト）、label/value は非空文字列
  for (const stat of STATS) {
    assert.ok(stat.icon != null, 'icon が定義されている')
    assert.ok(['function', 'object'].includes(typeof stat.icon))
    assert.equal(typeof stat.label, 'string')
    assert.ok(stat.label.length > 0)
    assert.equal(typeof stat.value, 'string')
    assert.ok(stat.value.length > 0)
  }
})

test('stats: label と value の並びが現行と完全一致する', () => {
  // Given/When: icon を除いた表示テキスト列
  const text = STATS.map(({ label, value }) => ({ label, value }))
  // Then: page.tsx:159-172 と一致（順序込み）
  assert.deepEqual(text, [
    { label: 'Classes Taken', value: '512 Hours' },
    { label: 'Beers Consumed', value: '112 Bottles' },
    { label: 'Typhoons Encountered', value: '3' },
    { label: 'Watermelons Eaten', value: '34 Slices' },
    { label: 'Favorite Phrase', value: '"once in a blue moon"' },
    { label: 'Hardest Word to Pronounce', value: '"walk / work"' },
    { label: 'SUNBURN LEVEL', value: 'well-done' },
    { label: 'STREET DOGS THAT IGNORED ME', value: '256 Dogs' },
  ])
})
