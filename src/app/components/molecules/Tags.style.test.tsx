// Tags のトークン化（日本語ハードコードの色分岐をマップ化・rounded-full 淡色地＋
// 濃色文字）の className 契約を固定する単体テスト（Issue #225 UI刷新 3/3 / TDD 先行）。
//
// #225 は Tags の見た目を rounded → rounded-full、text-xxs → text-xs、
// bg-teal/bg-orange の濃色地＋白文字 → 淡色地＋濃色文字へ更新する。色分岐は
// `ブログ`/`短編小説` を特別扱い（orange 系）し、他はデフォルト（teal-50 系）にする。
// 本テストは「タグ種別ごとに異なる淡色トークンが付く」という観測可能な振る舞いを固定する
// （三項ハードコードか Record マップかという内部実装ではなく、レンダリング結果を検証する）。
//
// 既存の BlogCard.style.test.tsx と同じく、node:test と renderToStaticMarkup で構成し、
// next/navigation(useRouter) は resolve フックでモックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は rounded / text-xxs / 濃色地のままのため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const navMock =
  'data:text/javascript,' +
  encodeURIComponent(
    'export function useRouter(){return {push(){},replace(){},prefetch(){},back(){},forward(){},refresh(){}}}',
  )

const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/navigation') {
    return { url: ${JSON.stringify(navMock)}, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
`
register(
  'data:text/javascript,' + encodeURIComponent(resolveHook),
  import.meta.url,
)
;(globalThis as Record<string, unknown>).React = React

let Tags: React.FC<{ tags: string[] }>
before(async () => {
  Tags = (await import('./Tags')).default as unknown as React.FC<{
    tags: string[]
  }>
})

const renderTags = (tags: string[]): string =>
  renderToStaticMarkup(<Tags tags={tags} />)

test('Tags: 角丸を rounded-full にする', () => {
  // Given/When: 技術タグを描画する
  const html = renderTags(['React'])
  // Then: 角丸が rounded-full になっている
  assert.ok(html.includes('rounded-full'), 'rounded-full を含む')
})

test('Tags: 旧極小フォント text-xxs を残さない', () => {
  // Given/When: 技術タグを描画する
  const html = renderTags(['React'])
  // Then: text-xxs は使わず text-xs に統一されている
  assert.ok(!html.includes('text-xxs'), 'text-xxs を含まない')
  assert.ok(html.includes('text-xs'), 'text-xs を含む')
})

test('Tags: 濃色地＋白文字（text-main-white）をやめる', () => {
  // Given/When: 技術タグを描画する
  const html = renderTags(['React'])
  // Then: 淡色地＋濃色文字化に伴い白文字固定は使われていない
  assert.ok(!html.includes('text-main-white'), 'text-main-white を含まない')
})

test('Tags: デフォルトタグは teal 系の淡色地になる', () => {
  // Given/When: `ブログ`/`短編小説` 以外のタグを描画する
  const html = renderTags(['React'])
  // Then: デフォルトは teal 淡色地（bg-teal-50）が付く
  assert.ok(html.includes('bg-teal-50'), 'bg-teal-50 を含む')
})

test('Tags: パディングを Chip と同一の px-3 py-1 に統一する', () => {
  // Given/When: 技術タグを描画する
  const html = renderTags(['React'])
  // Then: Chip と同じ px-3 py-1（Issue #225 完了条件のパディング統一）
  assert.ok(html.includes('px-3'), 'px-3 を含む')
  assert.ok(html.includes('py-1'), 'py-1 を含む')
  // Then: Chip と食い違う旧値（px-2.5 / py-1.5）を残さない
  assert.ok(!html.includes('px-2.5'), 'px-2.5 を含まない')
  assert.ok(!html.includes('py-1.5'), 'py-1.5 を含まない')
})

test('Tags: `ブログ` は orange 系の色になる（デフォルトと分岐する）', () => {
  // Given/When: 特別扱いする `ブログ` タグを描画する
  const html = renderTags(['ブログ'])
  // Then: orange 系トークンが付き、teal デフォルトにはならない
  assert.ok(html.includes('orange'), 'orange 系トークンを含む')
  assert.ok(
    !html.includes('bg-teal-50'),
    'デフォルトの bg-teal-50 にはならない',
  )
})

test('Tags: `短編小説` も `ブログ` と同じ orange 系分岐になる', () => {
  // Given/When: 特別扱いする `短編小説` タグを描画する
  const html = renderTags(['短編小説'])
  // Then: orange 系トークンが付く
  assert.ok(html.includes('orange'), 'orange 系トークンを含む')
})

// --- Issue #226 UI刷新 4/4: 近接バランス（上下マージンを配置側へ委譲） ---
// タグ群は「直前の見出し/本文と関連の高い要素」であり、コンポーネント内蔵の
// my-6（上下24px）は関連度に対して間延びする。上下マージンは配置側（呼び出し元）で
// 制御し、Tags 自身は横並びレイアウトのみを担う。

test('Tags: 内蔵の縦マージン my-6 を撤去する（余白は配置側で制御）', () => {
  // Given/When: 技術タグを描画する
  const html = renderTags(['React'])
  // Then: コンポーネントが上下マージンを抱え込まない
  assert.ok(!html.includes('my-6'), 'my-6 を含まない')
})

test('Tags: 横並びレイアウト（flex flex-wrap gap-2）は維持する', () => {
  // Given/When: 技術タグを描画する
  const html = renderTags(['React'])
  // Then: my-6 撤去後も折り返し可能な横並びは保つ
  assert.ok(html.includes('flex'), 'flex を含む')
  assert.ok(html.includes('flex-wrap'), 'flex-wrap を含む')
  assert.ok(html.includes('gap-2'), 'gap-2 を含む')
})
