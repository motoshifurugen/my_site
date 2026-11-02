// usePostSearchIndex の取得処理 fetchPostSearchIndex（Issue #7）の単体テスト。
// DOM のテストライブラリが無いため、フック本体ではなく取得処理を globalThis.fetch の差し替えで確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import type { PostSearchEntry } from '@/types/posts'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchPostSearchIndex } from './usePostSearchIndex'

const INDEX_URL = '/my_site/blog/search-index.json'

const entries: PostSearchEntry[] = [
  {
    slug: 'first-post',
    title: '最初の記事',
    date: '2026-01-01',
    tags: ['Next.js'],
    excerpt: '本文の冒頭',
  },
]

const stubFetch = (response: Response): { calledUrls: string[] } => {
  const calledUrls: string[] = []
  globalThis.fetch = ((input: string) => {
    calledUrls.push(input)
    return Promise.resolve(response)
  }) as typeof fetch
  return { calledUrls }
}

test('fetchPostSearchIndex: 渡した URL に fetch する', async () => {
  // Given
  const original = globalThis.fetch
  const { calledUrls } = stubFetch(
    new Response(JSON.stringify(entries), { status: 200 }),
  )
  try {
    // When
    await fetchPostSearchIndex(INDEX_URL)
    // Then
    assert.deepEqual(calledUrls, [INDEX_URL])
  } finally {
    globalThis.fetch = original
  }
})

test('fetchPostSearchIndex: 応答が ok なら一覧を返す', async () => {
  // Given
  const original = globalThis.fetch
  stubFetch(new Response(JSON.stringify(entries), { status: 200 }))
  try {
    // When
    const result = await fetchPostSearchIndex(INDEX_URL)
    // Then
    assert.deepEqual(result, entries)
  } finally {
    globalThis.fetch = original
  }
})

test('fetchPostSearchIndex: 応答が ok でなければ HTTP ステータスで reject する', async () => {
  // Given
  const original = globalThis.fetch
  stubFetch(new Response('Not Found', { status: 404 }))
  try {
    // When/Then
    await assert.rejects(fetchPostSearchIndex(INDEX_URL), /HTTP 404/)
  } finally {
    globalThis.fetch = original
  }
})
