// 記事 API（GET /api/blog/[slug]）が Next 16 の route 引数から slug を受け取る配線を固定する
// 静的検査テスト（Issue #173 / TDD 先行）。
//
// Next 16 では route ハンドラの第 2 引数の params が Promise になる。今の route は
// `const { slug } = params` で受けるため、slug が undefined になり isValidSlug が例外を投げる。
// route は params を Promise<{ slug: string }> と型付けし、`const { slug } = await params` で
// 受け取る。
//
// route を import して呼ぶ形にはしない。CI の Pages ビルドは next build の前に
// src/app/api/**/route.ts(x) を消し、next build は tsconfig の include（**/*.ts）にある
// このテストも型検査する。route を import すると、消えたモジュールを探して Pages ビルドが落ちる。
// だから page.seo.test.ts と同じく、ソースの静的検査で契約を固定する。空白・改行・末尾カンマは
// Prettier の整形で変わりうるので、比較前に空白を取り除く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は params を同期オブジェクトとして読むため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const route = readFileSync(new URL('./route.tsx', import.meta.url), 'utf8')

function getHandlerSource(source: string): string {
  const start = source.indexOf('const GET')
  const end = source.indexOf('export const generateStaticParams')
  assert.ok(start >= 0 && end > start, 'GET ハンドラ本体を抽出できる')
  return source.slice(start, end).replace(/\s+/g, '')
}

const handler = getHandlerSource(route)

test('GET /api/blog/[slug]: params を Promise<{ slug: string }> と型付けする', () => {
  // Given/When: GET の第 2 引数の型
  // Then: Next 16 の route 引数の形に合わせる
  assert.ok(handler.includes('{params}:{params:Promise<{slug:string}>}'))
})

test('GET /api/blog/[slug]: params を await してから slug を取り出す', () => {
  // Given/When: GET の本体
  // Then: Promise を待ってから slug を受け取る
  assert.ok(handler.includes('const{slug}=awaitparams'))
})

test('GET /api/blog/[slug]: 受け取った slug をパストラバーサル対策の検査に通す', () => {
  // Given/When: GET の本体
  // Then: 記事を読む前に isValidSlug で slug を確かめる処理を保つ
  assert.ok(handler.includes('if(!isValidSlug(slug))'))
  assert.ok(
    handler.indexOf('if(!isValidSlug(slug))') <
      handler.indexOf('getPostBySlug(slug)'),
  )
})
