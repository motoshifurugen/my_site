// ブログ検索インデックスを JSON ファイルとして書き出す静的ルートハンドラ
// （/blog/search-index.json / Issue #7 / TDD 先行）の契約を固定する単体テスト。
//
// - dynamic = 'force-static' を公開する。output: export のビルドでも事前レンダリングされ、
//   out/blog/search-index.json として出力される
// - GET は buildPostSearchIndex() の結果を JSON で返す
// - CI の Pages ビルドは src/app/api/**/route.ts(x) を消すため、src/app/api の外に置く
// - slug の動的セグメント [slug] と重ならない（isValidSlug は '.' を許さない）
//
// NextResponse.json は node（node --import tsx）上でも動くので、route を直接 import して呼ぶ。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は route.ts / searchIndex.ts が無いため import エラーで RED、実装後に GREEN。

import { isValidSlug } from '@/app/api/utils/getPostData'
import assert from 'node:assert/strict'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { buildPostSearchIndex } from '../searchIndex'
import { GET, dynamic } from './route'

test('search-index.json: dynamic を force-static にして、ビルド時に書き出す', () => {
  // Given/When/Then
  assert.equal(dynamic, 'force-static')
})

test('search-index.json: GET は 200 と JSON を返す', async () => {
  // Given/When
  const response = await GET()
  // Then
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type') ?? '', /application\/json/)
})

test('search-index.json: GET の本文は buildPostSearchIndex() の結果と等しい', async () => {
  // Given
  const expected = await buildPostSearchIndex()
  // When
  const response = await GET()
  const body = await response.json()
  // Then
  assert.ok(Array.isArray(body), '配列を返す（エンベロープで包まない）')
  assert.deepEqual(body, expected)
})

test('search-index.json: Pages ビルドで消されないよう src/app/api の外に置く', () => {
  // Given: このテストと同じフォルダにある route.ts
  const routeDir = path.dirname(fileURLToPath(import.meta.url))
  const apiDir = path.resolve(process.cwd(), 'src', 'app', 'api')
  // Then
  assert.ok(
    !routeDir.startsWith(apiDir + path.sep),
    `${routeDir} は ${apiDir} の下にない`,
  )
})

test('search-index.json: 記事の slug としては扱われない（[slug] と重ならない）', () => {
  // Given/When/Then: '.' を含む名前は slug として受け付けない
  assert.equal(isValidSlug('search-index.json'), false)
})
