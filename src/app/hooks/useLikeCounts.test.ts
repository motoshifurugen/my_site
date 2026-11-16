// useLikeCounts の取得処理 fetchLikeCounts（Issue #360）の単体テスト。
// DOM のテストライブラリが無いため、フック本体ではなく取得処理を globalThis.fetch の差し替えで確かめる。
// 失敗時に null を返すことが、フックが「いいね数を更新しない」ことに対応する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchLikeCounts } from './useLikeCounts'

const API_URL = 'https://api.example.test'

const stubFetch = (
  respond: () => Promise<Response>,
): { calledUrls: string[] } => {
  const calledUrls: string[] = []
  globalThis.fetch = ((input: string) => {
    calledUrls.push(input)
    return respond()
  }) as typeof fetch
  return { calledUrls }
}

const withStubs = async (
  respond: () => Promise<Response>,
  body: (calledUrls: string[]) => Promise<void>,
): Promise<void> => {
  const originalFetch = globalThis.fetch
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL
  process.env.NEXT_PUBLIC_API_URL = API_URL
  const { calledUrls } = stubFetch(respond)
  try {
    await body(calledUrls)
  } finally {
    globalThis.fetch = originalFetch
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl
    }
  }
}

const okResponse = (body: unknown): Promise<Response> =>
  Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))

test('fetchLikeCounts: likes/bulk に slug をカンマ区切りで渡して 1 回だけ fetch する', async () => {
  // Given
  await withStubs(
    () => okResponse({ likes: { a: 3, b: 0 } }),
    async (calledUrls) => {
      // When
      await fetchLikeCounts(['a', 'b'])
      // Then
      assert.deepEqual(calledUrls, [`${API_URL}/likes/bulk?articleIds=a,b`])
    },
  )
})

test('fetchLikeCounts: 応答が ok なら応答の likes を返す', async () => {
  // Given
  await withStubs(
    () => okResponse({ likes: { a: 3, b: 0 } }),
    async () => {
      // When
      const result = await fetchLikeCounts(['a', 'b'])
      // Then
      assert.deepEqual(result, { a: 3, b: 0 })
    },
  )
})

test('fetchLikeCounts: 応答が ok でなければ null を返す（いいね数を更新しない）', async () => {
  // Given
  await withStubs(
    () =>
      Promise.resolve(new Response('Internal Server Error', { status: 500 })),
    async () => {
      // When
      const result = await fetchLikeCounts(['a', 'b'])
      // Then
      assert.equal(result, null)
    },
  )
})

test('fetchLikeCounts: fetch が reject しても例外を外へ漏らさず null を返す', async (t) => {
  // Given
  t.mock.method(console, 'error', () => {})
  await withStubs(
    () => Promise.reject(new TypeError('Failed to fetch')),
    async () => {
      // When
      const pending = fetchLikeCounts(['a', 'b'])
      // Then
      await assert.doesNotReject(pending)
      assert.equal(await pending, null)
    },
  )
})

test('fetchLikeCounts: 応答が ok でも JSON として読めなければ例外を外へ漏らさず null を返す', async (t) => {
  // Given
  t.mock.method(console, 'error', () => {})
  await withStubs(
    () => Promise.resolve(new Response('not json', { status: 200 })),
    async () => {
      // When
      const pending = fetchLikeCounts(['a', 'b'])
      // Then
      await assert.doesNotReject(pending)
      assert.equal(await pending, null)
    },
  )
})
