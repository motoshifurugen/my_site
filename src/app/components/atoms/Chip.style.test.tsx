// Chip を Tags と角丸・パディング・フォントサイズで統一する className 契約を
// 固定する単体テスト（Issue #225 UI刷新 3/3 / TDD 先行）。
//
// #225 は Chip の角丸を rounded-xl → rounded-full に、フォントを md:text-sm 併用から
// text-xs 単一へ統一する（Tags と揃える）。Chip は React のみに依存し CSS Module も
// next/* も import しないため追加の resolve フックは不要。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は rounded-xl / md:text-sm のままのため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

let Chip: React.FC<{ children: React.ReactNode; className?: string }>
before(async () => {
  Chip = (await import('./Chip')).default as unknown as React.FC<{
    children: React.ReactNode
    className?: string
  }>
})

const render = (): string =>
  renderToStaticMarkup(<Chip className="bg-gray">サンプル</Chip>)

test('Chip: 角丸を rounded-full に統一する', () => {
  // Given/When: Chip を描画する
  const html = render()
  // Then: 角丸が rounded-full に統一されている（Tags と揃える）
  assert.ok(html.includes('rounded-full'), 'rounded-full を含む')
})

test('Chip: 旧角丸 rounded-xl を残さない', () => {
  // Given/When: Chip を描画する
  const html = render()
  // Then: 旧来の rounded-xl は使われていない
  assert.ok(!html.includes('rounded-xl'), 'rounded-xl を含まない')
})

test('Chip: フォントサイズを text-xs に統一し md:text-sm を残さない', () => {
  // Given/When: Chip を描画する
  const html = render()
  // Then: md:text-sm は使わず text-xs 単一に統一されている
  assert.ok(!html.includes('md:text-sm'), 'md:text-sm を含まない')
  assert.ok(html.includes('text-xs'), 'text-xs を含む')
})

test('Chip: パディングを Tags と同一の px-3 py-1 に統一する', () => {
  // Given/When: Chip を描画する
  const html = render()
  // Then: Tags と同じ px-3 py-1（Issue #225 完了条件のパディング統一）
  assert.ok(html.includes('px-3'), 'px-3 を含む')
  assert.ok(html.includes('py-1'), 'py-1 を含む')
  // Then: Tags と食い違う旧値（px-2.5 / py-1.5）を残さない
  assert.ok(!html.includes('px-2.5'), 'px-2.5 を含まない')
  assert.ok(!html.includes('py-1.5'), 'py-1.5 を含まない')
})

test('Chip: 渡した className はパススルーされる', () => {
  // Given/When: className を渡して Chip を描画する
  const html = render()
  // Then: 呼び出し元の色指定などがそのまま反映される
  assert.ok(html.includes('bg-gray'), '渡した className を含む')
})
