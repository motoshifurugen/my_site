// BlogCard の影・角丸トークン統一とホバー浮き上がりの契約を固定する単体テスト
// （Issue #223 UI刷新 1/3 / TDD 先行）。
//
// #223 はカード類の角丸を rounded-lg に統一し、shadow-sm/md/lg の乱立を
// boxShadow の card / card-hover 2 トークンへ集約する。BlogCard は内部に
// <a> を持つ唯一のリンクカードのため、通常時 shadow-card に加えて
// transition + hover:shadow-card-hover + hover の軽い浮き上がりを付与する。
// 本テストはその className 契約を固定する。
//
// 既存の BlogCard.test.tsx と同じく、Node 組み込み node:test と
// react-dom/server の renderToStaticMarkup のみで構成する。CSS Module と
// next/navigation(useRouter) 依存は resolve フックでモックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は rounded/shadow-sm のままのため RED、実装後に GREEN になることを期待する。

import type { PostMeta } from '@/types/posts'
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

const post: PostMeta = {
  slug: 'hello-world',
  title: 'はじめての記事',
  date: '2026-01-01',
  tags: ['ブログ'],
}

type BlogCardComponent = React.FC<{ post: PostMeta; likeCount: number }>

let BlogCard: BlogCardComponent
before(async () => {
  BlogCard = (await import('./BlogCard'))
    .default as unknown as BlogCardComponent
})

const render = () =>
  renderToStaticMarkup(<BlogCard post={post} likeCount={1} />)

test('BlogCard: 角丸を rounded-lg に統一する', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: カードの角丸が rounded-lg に統一されている
  assert.ok(html.includes('rounded-lg'), 'rounded-lg を含む')
})

test('BlogCard: 通常時の影を shadow-card トークンに集約する', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: 通常時の影が shadow-card（-hover ではない基底トークン）である
  assert.match(html, /shadow-card(?!-hover)/, 'shadow-card を含む')
})

test('BlogCard: 旧 shadow-sm を残さない（2 段トークンへ集約）', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: 集約により shadow-sm は使われていない
  assert.ok(!html.includes('shadow-sm'), 'shadow-sm を含まない')
})

test('BlogCard: リンクカードにホバー浮き上がりの影を付与する', () => {
  // Given/When: リンクカードである BlogCard を描画する
  const html = render()
  // Then: ホバーで card-hover へ切り替わる
  assert.ok(
    html.includes('hover:shadow-card-hover'),
    'hover:shadow-card-hover を含む',
  )
})

test('BlogCard: ホバーで軽く持ち上がる（hover:-translate-y）', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: ホバー時に上方向へ移動する浮き上がり演出がある
  assert.match(html, /hover:-translate-y-/, 'hover:-translate-y- を含む')
})

test('BlogCard: 浮き上がりを滑らかにする transition が付与されている', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: transition クラスがある（影・移動を滑らかに）
  assert.ok(html.includes('transition'), 'transition を含む')
})

// --- Issue #226 UI刷新 4/4: カード見出しのスケール1段整理 ---
// タイトルは記事本文の h1 と同格には見せず、カード見出しとして1段下げる
// （text-xl md:text-2xl → text-lg md:text-xl）。見出し階層 h1 > h2 > h3 を
// カード内でも崩さないための下げ幅を固定する。

test('BlogCard: カード見出しをカード用スケール text-lg md:text-xl に1段整理する', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: モバイル text-lg / md 以上 text-xl のカード見出しスケールになる
  assert.ok(html.includes('text-lg'), 'text-lg を含む')
  assert.ok(html.includes('md:text-xl'), 'md:text-xl を含む')
})

test('BlogCard: 旧タイトルスケール text-2xl を残さない', () => {
  // Given/When: BlogCard を描画する
  const html = render()
  // Then: 本文見出し相当の大きさ（text-2xl）はカードでは使わない
  assert.ok(!html.includes('text-2xl'), 'text-2xl を含まない')
})
