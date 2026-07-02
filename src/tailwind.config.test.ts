// デザイントークン刷新（Issue #223 UI刷新 1/3 / TDD 先行）の契約を固定する単体テスト。
//
// 本 Issue は tailwind.config.ts の値差し替えのみで全体のトーンを調整する:
//   - teal.DEFAULT は CSS 標準色 "teal"(#008080) から離れたブランド青緑へ
//   - orange は CSS 標準色 "darkorange"(#FF8C00) から柔らかいアンバーへ
//   - night-teal(#388E8E) / night-orange(#E69500) も新トーンへ整合
//   - teal の 50〜900 スケールを重複なく再生成
//   - theme.extend.boxShadow に card / card-hover の 2 トークンを新設
//     （eslint-plugin-tailwindcss no-custom-classname 回避のため config 定義が前提）
// クラス名は変えないため、契約は config が公開する「値」に対して固定する。
//
// 具体的な新色は Issue 上「例」であり実装者の裁量に委ねられるため、
// 個別 hex の一致ではなく「旧値から変わったこと」「トークンが存在すること」を検証する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は旧値のままのため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import config from '../tailwind.config'

const extend = (config.theme as { extend?: Record<string, unknown> }).extend

const getColors = (): Record<string, unknown> => {
  assert.ok(extend, 'theme.extend が定義されている')
  const colors = extend.colors as Record<string, unknown> | undefined
  assert.ok(colors, 'theme.extend.colors が定義されている')
  return colors
}

const isHex = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

test('teal.DEFAULT: CSS標準色 teal(#008080) から差し替えられている', () => {
  // Given: config の teal（DEFAULT + スケールを持つオブジェクト）
  const teal = getColors().teal as Record<string, string>
  // When/Then: DEFAULT がブランド色へ変わり、素の #008080 ではない
  assert.ok(teal, 'teal が定義されている')
  assert.ok(isHex(teal.DEFAULT), 'teal.DEFAULT が #RRGGBB 形式である')
  assert.notEqual(
    teal.DEFAULT.toLowerCase(),
    '#008080',
    'teal.DEFAULT は CSS 標準色 teal ではない',
  )
})

test('orange: CSS標準色 darkorange(#FF8C00) から柔らかいアンバーへ差し替えられている', () => {
  // Given/When: config の orange（スカラー値）
  const orange = getColors().orange
  // Then: #FF8C00 ではない有効な hex
  assert.ok(isHex(orange), 'orange が #RRGGBB 形式である')
  assert.notEqual(
    (orange as string).toLowerCase(),
    '#ff8c00',
    'orange は darkorange ではない',
  )
})

test('night-teal: 旧値(#388E8E)から新トーンへ整合されている', () => {
  // Given/When: ダークモード用 night-teal
  const nightTeal = getColors()['night-teal']
  // Then: 旧値から変わった有効な hex
  assert.ok(isHex(nightTeal), 'night-teal が #RRGGBB 形式である')
  assert.notEqual(
    (nightTeal as string).toLowerCase(),
    '#388e8e',
    'night-teal は旧値から変わっている',
  )
})

test('night-orange: 旧値(#E69500)から新トーンへ整合されている', () => {
  // Given/When: ダークモード用 night-orange
  const nightOrange = getColors()['night-orange']
  // Then: 旧値から変わった有効な hex
  assert.ok(isHex(nightOrange), 'night-orange が #RRGGBB 形式である')
  assert.notEqual(
    (nightOrange as string).toLowerCase(),
    '#e69500',
    'night-orange は旧値から変わっている',
  )
})

test('teal スケール(50〜900): 9 段すべて存在し重複なく再生成されている', () => {
  // Given: teal オブジェクトのスケールキー
  const teal = getColors().teal as Record<string, string>
  const scaleKeys = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ]
  // When/Then: 各段が有効な hex で、値がすべて相異なる（現状の重複を解消）
  const values: string[] = []
  for (const key of scaleKeys) {
    const shade = teal[key]
    assert.ok(isHex(shade), `teal.${key} が #RRGGBB 形式である`)
    values.push(shade.toLowerCase())
  }
  const unique = new Set(values)
  assert.equal(
    unique.size,
    scaleKeys.length,
    'teal スケールに重複した色が存在しない',
  )
})

test('boxShadow: card / card-hover の 2 トークンが定義されている', () => {
  // Given: theme.extend.boxShadow
  assert.ok(extend, 'theme.extend が定義されている')
  const boxShadow = extend.boxShadow as Record<string, string> | undefined
  // When/Then: card と card-hover が非空の文字列で存在する
  assert.ok(boxShadow, 'theme.extend.boxShadow が定義されている')
  assert.equal(typeof boxShadow.card, 'string', 'boxShadow.card が文字列である')
  assert.ok(boxShadow.card.length > 0, 'boxShadow.card が非空である')
  assert.equal(
    typeof boxShadow['card-hover'],
    'string',
    'boxShadow.card-hover が文字列である',
  )
  assert.ok(
    boxShadow['card-hover'].length > 0,
    'boxShadow.card-hover が非空である',
  )
})

test('boxShadow: card と card-hover は別々のエレベーション（同一値ではない）', () => {
  // Given/When: 2 トークン
  const boxShadow = extend?.boxShadow as Record<string, string> | undefined
  assert.ok(boxShadow, 'theme.extend.boxShadow が定義されている')
  // Then: 通常影と浮き上がり影は異なる（浮き上がり演出のため）
  assert.notEqual(
    boxShadow.card,
    boxShadow['card-hover'],
    'card と card-hover は異なる影である',
  )
})
