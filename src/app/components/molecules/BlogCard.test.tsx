// BlogCard の likeCount 受け渡し契約を固定する単体テスト（Issue #166 / TDD 先行）。
//
// #166 は記事一覧のいいね数取得を「カード単位の N+1 client fetch」から
// 「一覧でまとめて1リクエスト」へ移す変更。BlogCard は自前で fetch する
// useLikeCount を廃止し、親（BlogGrid）から likeCount: number を props で受け取り
// それをそのまま表示する責務に変わる。本テストはその新しい入力契約
// （producer=BlogGrid / consumer=BlogCard）を固定する。
//
// 既存の CopyButton.test.tsx / MessageBoard.test.tsx と同様に、Node 組み込み
// node:test と react-dom/server の renderToStaticMarkup のみで構成する（新規パッケージ無し）。
// BlogCard は CSS Module と next/navigation(useRouter) に依存するため、resolve フックで
// .css を空モジュールへ、next/navigation をハーミティックなモックへ張り替えてから動的 import する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は likeCount prop を表示しないため RED、実装後に GREEN になることを期待する。

import type { PostMeta } from '@/types/posts'
import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// next/navigation の useRouter は AppRouter コンテキスト外で呼ぶと throw するため、
// 描画に支障しない push のみ持つモックへ差し替える。.css は空モジュールへ落とす。
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

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
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

test('BlogCard: props で渡された likeCount をそのまま表示する', () => {
  // Given: 親から likeCount=42 を渡す
  // When: BlogCard を描画する
  const html = renderToStaticMarkup(<BlogCard post={post} likeCount={42} />)
  // Then: 42 が描画される（自前 fetch ではなく props を表示）
  assert.match(html, />\s*42\s*</)
})

test('BlogCard: likeCount=0（境界値）を表示する', () => {
  // Given: likeCount=0
  // When: BlogCard を描画する
  const html = renderToStaticMarkup(<BlogCard post={post} likeCount={0} />)
  // Then: 0 が描画される
  assert.match(html, />\s*0\s*</)
})

test('BlogCard: 記事タイトルを描画する', () => {
  // Given: title を持つ post
  // When: BlogCard を描画する
  const html = renderToStaticMarkup(<BlogCard post={post} likeCount={3} />)
  // Then: タイトルが本文に含まれる
  assert.ok(html.includes('はじめての記事'))
})

test('BlogCard: 描画中に自前 fetch を行わない（取得は親が一括で担う）', () => {
  // Given: fetch を呼んだら検知するスパイ
  const original = globalThis.fetch
  let fetchCalls = 0
  globalThis.fetch = (() => {
    fetchCalls += 1
    return Promise.reject(new Error('BlogCard must not fetch'))
  }) as typeof fetch
  try {
    // When: BlogCard を描画する
    const html = renderToStaticMarkup(<BlogCard post={post} likeCount={7} />)
    // Then: fetch は一度も呼ばれず、props の likeCount を表示する
    assert.equal(fetchCalls, 0)
    assert.match(html, />\s*7\s*</)
  } finally {
    globalThis.fetch = original
  }
})
