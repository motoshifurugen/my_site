// ゲームの結果画面のハイスコア取得と更新 resolveHighScore（Issue #379）の単体テスト。
// DOM のテストライブラリが無いため、GameOverPanel ではなく取り出した関数を globalThis.fetch の差し替えで確かめる。
// null を返すことが、結果画面がハイスコアを null にすることに対応する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveHighScore } from './resolveHighScore'

const API_BASE = 'https://api.example.test'

type Call = { url: string; init?: RequestInit }

const stubFetch = (
  get: () => Promise<Response>,
  post: () => Promise<Response>,
): { calls: Call[] } => {
  const calls: Call[] = []
  globalThis.fetch = ((input: string, init?: RequestInit) => {
    calls.push({ url: input, init })
    return init?.method === 'POST' ? post() : get()
  }) as typeof fetch
  return { calls }
}

const withStubs = async (
  get: () => Promise<Response>,
  post: () => Promise<Response>,
  body: (calls: Call[]) => Promise<void>,
): Promise<void> => {
  const originalFetch = globalThis.fetch
  const { calls } = stubFetch(get, post)
  try {
    await body(calls)
  } finally {
    globalThis.fetch = originalFetch
  }
}

const okResponse = (body: unknown): Promise<Response> =>
  Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))

const postNotExpected = (): Promise<Response> =>
  Promise.reject(new Error('POST を送らないはずのケースで POST が送られた'))

const postCalls = (calls: Call[]): Call[] =>
  calls.filter((call) => call.init?.method === 'POST')

test('resolveHighScore: GET は apiBase/highscore に送る', async () => {
  // Given
  await withStubs(
    () => okResponse({ highScore: 10 }),
    postNotExpected,
    async (calls) => {
      // When
      await resolveHighScore(API_BASE, 5)
      // Then
      assert.deepEqual(
        calls.map((call) => call.url),
        [`${API_BASE}/highscore`],
      )
    },
  )
})

test('resolveHighScore: GET が { highScore: 10 }、score が 5 なら { highScore: 10, isNewRecord: false } を返し、POST を送らない', async () => {
  // Given
  await withStubs(
    () => okResponse({ highScore: 10 }),
    postNotExpected,
    async (calls) => {
      // When
      const result = await resolveHighScore(API_BASE, 5)
      // Then
      assert.deepEqual(result, { highScore: 10, isNewRecord: false })
      assert.equal(postCalls(calls).length, 0)
    },
  )
})

test('resolveHighScore: GET が { highScore: 10 }、score が 10 なら { highScore: 10, isNewRecord: false } を返し、POST を送らない', async () => {
  // Given: score がハイスコアと同じ
  await withStubs(
    () => okResponse({ highScore: 10 }),
    postNotExpected,
    async (calls) => {
      // When
      const result = await resolveHighScore(API_BASE, 10)
      // Then
      assert.deepEqual(result, { highScore: 10, isNewRecord: false })
      assert.equal(postCalls(calls).length, 0)
    },
  )
})

test('resolveHighScore: GET が { highScore: 10 }、score が 12、POST が { highScore: 12 } なら { highScore: 12, isNewRecord: true } を返す', async () => {
  // Given
  await withStubs(
    () => okResponse({ highScore: 10 }),
    () => okResponse({ highScore: 12 }),
    async () => {
      // When
      const result = await resolveHighScore(API_BASE, 12)
      // Then
      assert.deepEqual(result, { highScore: 12, isNewRecord: true })
    },
  )
})

test('resolveHighScore: 新記録なら POST を 1 回だけ apiBase/highscore に送り、body が {"score":12} である', async () => {
  // Given
  await withStubs(
    () => okResponse({ highScore: 10 }),
    () => okResponse({ highScore: 12 }),
    async (calls) => {
      // When
      await resolveHighScore(API_BASE, 12)
      // Then
      const posts = postCalls(calls)
      assert.equal(posts.length, 1)
      assert.equal(posts[0].url, `${API_BASE}/highscore`)
      assert.equal(posts[0].init?.body, '{"score":12}')
    },
  )
})

test('resolveHighScore: 新記録の POST は Content-Type: application/json を付けて送る', async () => {
  // Given
  await withStubs(
    () => okResponse({ highScore: 10 }),
    () => okResponse({ highScore: 12 }),
    async (calls) => {
      // When
      await resolveHighScore(API_BASE, 12)
      // Then
      const [post] = postCalls(calls)
      assert.deepEqual(post.init?.headers, {
        'Content-Type': 'application/json',
      })
    },
  )
})

test('resolveHighScore: GET が {}、score が 3、POST が {} なら { highScore: 3, isNewRecord: true } を返す', async () => {
  // Given: どちらの応答にも highScore が無い
  await withStubs(
    () => okResponse({}),
    () => okResponse({}),
    async () => {
      // When
      const result = await resolveHighScore(API_BASE, 3)
      // Then
      assert.deepEqual(result, { highScore: 3, isNewRecord: true })
    },
  )
})

test('resolveHighScore: GET が {}、score が 0 なら { highScore: 0, isNewRecord: false } を返し、POST を送らない', async () => {
  // Given: 応答に highScore が無く、score も 0
  await withStubs(
    () => okResponse({}),
    postNotExpected,
    async (calls) => {
      // When
      const result = await resolveHighScore(API_BASE, 0)
      // Then
      assert.deepEqual(result, { highScore: 0, isNewRecord: false })
      assert.equal(postCalls(calls).length, 0)
    },
  )
})

test('resolveHighScore: fetch が例外を投げるとき、例外を外へ漏らさず null を返す', async () => {
  // Given
  await withStubs(
    () => Promise.reject(new TypeError('Failed to fetch')),
    () => Promise.reject(new TypeError('Failed to fetch')),
    async () => {
      // When
      const pending = resolveHighScore(API_BASE, 5)
      // Then
      await assert.doesNotReject(pending)
      assert.equal(await pending, null)
    },
  )
})

test('resolveHighScore: 新記録の POST が例外を投げるとき、例外を外へ漏らさず null を返す', async () => {
  // Given: GET は成功し、更新の途中で失敗する
  await withStubs(
    () => okResponse({ highScore: 10 }),
    () => Promise.reject(new TypeError('Failed to fetch')),
    async () => {
      // When
      const pending = resolveHighScore(API_BASE, 12)
      // Then
      await assert.doesNotReject(pending)
      assert.equal(await pending, null)
    },
  )
})

test('resolveHighScore: GET の応答が JSON として読めないとき、例外を外へ漏らさず null を返す', async () => {
  // Given
  await withStubs(
    () => Promise.resolve(new Response('not json', { status: 200 })),
    postNotExpected,
    async () => {
      // When
      const pending = resolveHighScore(API_BASE, 5)
      // Then
      await assert.doesNotReject(pending)
      assert.equal(await pending, null)
    },
  )
})
