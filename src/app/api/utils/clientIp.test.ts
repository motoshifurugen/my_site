// Issue #158 / TDD 先行: 共有 util clientIp.ts の getClientIP 契約を固定する。
//
// getClientIP は現在 tanka-likes/route.tsx にローカル定義されている実装
// （x-forwarded-for 先頭 → x-real-ip → 127.0.0.1 フォールバック）を共有 util へ
// 集約したもの。レート制限の IP キーとして likes/highscore/tanka-likes から共用する。
//
// 実行: `npm test`（node --import tsx --test）。実装前は import で RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getClientIP } from './clientIp'

// getClientIP は request.headers.get(name) のみ使用する。
// Web 標準 Headers を持つ最小オブジェクトで NextRequest を代替する。
const makeRequest = (headers: Record<string, string>) =>
  ({ headers: new Headers(headers) }) as unknown as Parameters<
    typeof getClientIP
  >[0]

test('x-forwarded-for が単一 IP のときはその IP を返す', () => {
  // Given: x-forwarded-for に 1 つの IP
  // When: 解決する
  // Then: その IP
  assert.equal(
    getClientIP(makeRequest({ 'x-forwarded-for': '203.0.113.5' })),
    '203.0.113.5',
  )
})

test('x-forwarded-for がカンマ区切りのときは先頭（クライアント）IP を返す', () => {
  // Given: プロキシ経由で複数 IP が連結
  // When: 解決する
  // Then: 先頭のクライアント IP のみ
  assert.equal(
    getClientIP(
      makeRequest({
        'x-forwarded-for': '203.0.113.5, 70.41.3.18, 150.172.238.178',
      }),
    ),
    '203.0.113.5',
  )
})

test('x-forwarded-for 先頭 IP の前後空白はトリムされる', () => {
  // Given: 空白付きの値
  // When: 解決する
  // Then: トリムされた IP
  assert.equal(
    getClientIP(
      makeRequest({ 'x-forwarded-for': '  203.0.113.5 , 70.41.3.18' }),
    ),
    '203.0.113.5',
  )
})

test('x-forwarded-for が無く x-real-ip があるときは x-real-ip を返す', () => {
  // Given: x-forwarded-for 無し、x-real-ip あり
  // When: 解決する
  // Then: x-real-ip の値
  assert.equal(
    getClientIP(makeRequest({ 'x-real-ip': '198.51.100.9' })),
    '198.51.100.9',
  )
})

test('x-forwarded-for が x-real-ip より優先される', () => {
  // Given: 両ヘッダが存在
  // When: 解決する
  // Then: x-forwarded-for が優先
  assert.equal(
    getClientIP(
      makeRequest({
        'x-forwarded-for': '203.0.113.5',
        'x-real-ip': '198.51.100.9',
      }),
    ),
    '203.0.113.5',
  )
})

test('どちらのヘッダも無いときは 127.0.0.1 にフォールバックする', () => {
  // Given: IP 系ヘッダ無し
  // When: 解決する
  // Then: ローカルホストへフォールバック
  assert.equal(getClientIP(makeRequest({})), '127.0.0.1')
})
