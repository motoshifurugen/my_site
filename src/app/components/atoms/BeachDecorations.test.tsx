// ビーチ装飾コンポーネント（Issue #228 UI刷新 6 / TDD 先行）の契約を固定する単体テスト。
//
// #228 要件2 はライトモードのフッター上端に「上に飛び出す」ビーチの小物（浮き輪・くまで 等）を
// インライン SVG で描画する。装飾は次を満たす必要がある:
//   - aria-hidden="true"（支援技術から隠す純装飾）
//   - pointer-events-none（クリック不可・レイアウトシフトを起こさない）
//   - absolute 配置（通常フローに影響しない＝レイアウトシフト防止）
//   - dark:hidden（ダークモードの夜フッターを崩さないよう非表示）
// 本テストは BeachDecorations のルート要素が持つこれらの契約を固定する。SVG の見た目
// （浮き輪/くまでの形状）はテスト対象にせず、機械検証可能なアクセシビリティ/配置契約に絞る。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は BeachDecorations が未作成のため import エラーで RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// css import があってもテストが落ちないよう解決フックを張る（既存テストと同方針）
const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
`
register(
  'data:text/javascript,' + encodeURIComponent(resolveHook),
  import.meta.url,
)
;(globalThis as Record<string, unknown>).React = React

let BeachDecorations: React.FC
before(async () => {
  BeachDecorations = (await import('./BeachDecorations'))
    .default as unknown as React.FC
}) // ← import エラー時は before が失敗し、全サブテストが RED になる

const render = (): string => renderToStaticMarkup(<BeachDecorations />)

// 先頭のルート開始タグを取り出す（ルート要素に付いた属性/クラスを個別検証するため）
const rootTag = (html: string): string => {
  const match = html.match(/^<[^>]+>/)
  assert.ok(match, 'ルート要素の開始タグが存在する')
  return match![0]
}

test('BeachDecorations: 例外なく描画される', () => {
  // Given/When/Then: SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

test('BeachDecorations: ルートが aria-hidden="true" で支援技術から隠される', () => {
  // Given/When: 装飾を描画する
  const root = rootTag(render())
  // Then: 純装飾のためアクセシビリティツリーから除外される
  assert.ok(root.includes('aria-hidden="true"'), 'aria-hidden="true" を持つ')
})

test('BeachDecorations: ルートが pointer-events-none でクリック不可である', () => {
  // Given/When: 装飾を描画する
  const root = rootTag(render())
  // Then: ポインタイベントを受けない（クリック不可・操作阻害しない）
  assert.ok(root.includes('pointer-events-none'), 'pointer-events-none を持つ')
})

test('BeachDecorations: ルートが absolute 配置でレイアウトに影響しない', () => {
  // Given/When: 装飾を描画する
  const root = rootTag(render())
  // Then: 通常フロー外に配置しレイアウトシフトを起こさない
  assert.ok(root.includes('absolute'), 'absolute を持つ')
})

test('BeachDecorations: ルートが dark:hidden でダークモードでは非表示になる', () => {
  // Given/When: 装飾を描画する
  const root = rootTag(render())
  // Then: 夜フッターを崩さないよう装飾はダークで隠す
  assert.ok(root.includes('dark:hidden'), 'dark:hidden を持つ')
})
