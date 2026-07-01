// Issue #158 / TDD 先行: 共有レート制限モジュール rateLimit.ts の契約を検証する単体テスト。
//
// rateLimit.ts は Supabase の plpgsql 関数 check_api_rate_limit を RPC 経由で呼び、
// (ip, endpoint) 単位のウィンドウ内書込み回数を判定する。設計方針（計画 §4.1）:
//   - checkRateLimit(ip, endpoint): 許可=true / 拒否=false
//   - RATE_LIMITS に endpoint ごとの { max, windowSeconds } を集約
//   - RPC には check_api_rate_limit(ip_param, endpoint_param, max_requests, window_seconds) を渡す
//   - フェイルオープン: Supabase 未設定 / RPC エラー時は true を返す（コア機能を落とさない）
//
// 既存 tanka/route.test.mjs・likes/bulk/route.test.mjs と同じく、Node 組み込み node:test と
// devDependency の typescript のみで構成する。rateLimit.ts を JS へトランスパイルし、
// @supabase/supabase-js の import 指定子をハーミティックなモックへ張り替えて動的 import する。
//
// 実行: `node --test src/app/api/utils/rateLimit.test.mjs`
// 実装前は rateLimit.ts が未作成のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, beforeEach, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RATE_LIMIT_SRC = path.join(__dirname, 'rateLimit.ts')

const RATE_LIMIT_BUILD = path.join(__dirname, '.rateLimit.test-build.mjs')
const SUPABASE_MOCK = path.join(__dirname, '.supabase.test-mock.mjs')

// @supabase/supabase-js のモック。createClient(...).rpc(fn, params) の呼び出しを
// グローバル fixture に記録し、返す { data, error } を fixture から制御する。
const SUPABASE_MOCK_CODE = `
export function createClient(url, key) {
  const fx = () => globalThis.__RATE_LIMIT_FIXTURE__
  const f = fx()
  f.createClientCalls = (f.createClientCalls || 0) + 1
  f.createClientArgs = { url, key }
  return {
    rpc: async (fn, params) => {
      f.rpcCalls = (f.rpcCalls || 0) + 1
      f.rpcArgs = { fn, params }
      if (f.throwError) throw new Error('supabase boom')
      return { data: f.rpcData, error: f.rpcError }
    },
  }
}
`

const transpile = (srcPath) =>
  ts.transpileModule(fs.readFileSync(srcPath, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText

const toRel = (target) =>
  './' + path.relative(__dirname, target).split(path.sep).join('/')

const loadModule = async () => {
  fs.writeFileSync(SUPABASE_MOCK, SUPABASE_MOCK_CODE)
  const code = transpile(RATE_LIMIT_SRC).replaceAll(
    '@supabase/supabase-js',
    toRel(SUPABASE_MOCK),
  )
  fs.writeFileSync(RATE_LIMIT_BUILD, code)
  return import(`${RATE_LIMIT_BUILD}?t=${process.pid}`)
}

describe('api/utils/rateLimit.ts checkRateLimit（Issue #158: レート制限契約）', () => {
  let checkRateLimit
  let RATE_LIMITS
  let warnCalls

  const originalWarn = console.warn

  const setFixture = (fixture) => {
    globalThis.__RATE_LIMIT_FIXTURE__ = {
      rpcData: null,
      rpcError: null,
      throwError: false,
      createClientCalls: 0,
      rpcCalls: 0,
      ...fixture,
    }
  }

  before(async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'
    const mod = await loadModule()
    checkRateLimit = mod.checkRateLimit
    RATE_LIMITS = mod.RATE_LIMITS
  })

  beforeEach(() => {
    warnCalls = 0
    console.warn = () => {
      warnCalls += 1
    }
  })

  after(() => {
    console.warn = originalWarn
    delete globalThis.__RATE_LIMIT_FIXTURE__
    for (const f of [RATE_LIMIT_BUILD, SUPABASE_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  it('checkRateLimit / RATE_LIMITS がエクスポートされている', () => {
    assert.equal(typeof checkRateLimit, 'function')
    assert.equal(typeof RATE_LIMITS, 'object')
  })

  it('RATE_LIMITS に likes / highscore の { max, windowSeconds } が定義されている', () => {
    // Given: endpoint ごとの方針を 1 箇所に集約する設計
    // Then: likes / highscore の閾値が正の整数で存在する
    for (const key of ['likes', 'highscore']) {
      assert.ok(RATE_LIMITS[key], `${key} が定義されているべき`)
      assert.equal(Number.isInteger(RATE_LIMITS[key].max), true)
      assert.ok(RATE_LIMITS[key].max > 0)
      assert.equal(Number.isInteger(RATE_LIMITS[key].windowSeconds), true)
      assert.ok(RATE_LIMITS[key].windowSeconds > 0)
    }
  })

  it('RPC が data:true を返したら許可（true）', async () => {
    // Given: ウィンドウ内で上限未満
    // When: checkRateLimit を呼ぶ
    // Then: true（許可）
    setFixture({ rpcData: true })
    assert.equal(await checkRateLimit('203.0.113.5', 'likes'), true)
  })

  it('RPC が data:false を返したら拒否（false）', async () => {
    // Given: ウィンドウ内で上限到達
    // When: checkRateLimit を呼ぶ
    // Then: false（拒否）
    setFixture({ rpcData: false })
    assert.equal(await checkRateLimit('203.0.113.5', 'highscore'), false)
  })

  it('RPC には check_api_rate_limit と endpoint に対応する閾値が渡される', async () => {
    // Given: highscore の呼び出し
    // When: checkRateLimit を呼ぶ
    // Then: 関数名・IP・endpoint・RATE_LIMITS の閾値が RPC に渡る
    setFixture({ rpcData: true })
    await checkRateLimit('198.51.100.9', 'highscore')
    const { fn, params } = globalThis.__RATE_LIMIT_FIXTURE__.rpcArgs
    assert.equal(fn, 'check_api_rate_limit')
    assert.equal(params.ip_param, '198.51.100.9')
    assert.equal(params.endpoint_param, 'highscore')
    assert.equal(params.max_requests, RATE_LIMITS.highscore.max)
    assert.equal(params.window_seconds, RATE_LIMITS.highscore.windowSeconds)
  })

  it('RPC がエラーを返したらフェイルオープン（true）＋ warn で可視化', async () => {
    // Given: RPC が error を返す（Supabase 障害）
    // When: checkRateLimit を呼ぶ
    // Then: コア機能を落とさないため true。ただし握りつぶさず warn する
    setFixture({ rpcError: { message: 'rpc failed' } })
    assert.equal(await checkRateLimit('203.0.113.5', 'likes'), true)
    assert.ok(warnCalls >= 1, 'エラーは console.warn で可視化されるべき')
  })

  it('RPC が例外を投げてもフェイルオープン（true）＋ warn', async () => {
    // Given: RPC 呼び出しが throw
    // When: checkRateLimit を呼ぶ
    // Then: true（フェイルオープン）＋ warn
    setFixture({ throwError: true })
    assert.equal(await checkRateLimit('203.0.113.5', 'likes'), true)
    assert.ok(warnCalls >= 1)
  })
})

describe('api/utils/rateLimit.ts checkRateLimit（Supabase 未設定時）', () => {
  let checkRateLimit
  let warnCalls
  const originalWarn = console.warn
  const savedUrl = process.env.SUPABASE_URL
  const savedKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  before(async () => {
    // 環境変数を外した状態でモジュールを再ロードする
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    globalThis.__RATE_LIMIT_FIXTURE__ = {
      rpcData: null,
      rpcError: null,
      throwError: false,
      createClientCalls: 0,
      rpcCalls: 0,
    }
    fs.writeFileSync(SUPABASE_MOCK, SUPABASE_MOCK_CODE)
    const code = transpile(RATE_LIMIT_SRC).replaceAll(
      '@supabase/supabase-js',
      toRel(SUPABASE_MOCK),
    )
    fs.writeFileSync(RATE_LIMIT_BUILD, code)
    const mod = await import(`${RATE_LIMIT_BUILD}?t=${process.pid}-noenv`)
    checkRateLimit = mod.checkRateLimit
  })

  beforeEach(() => {
    warnCalls = 0
    console.warn = () => {
      warnCalls += 1
    }
  })

  after(() => {
    console.warn = originalWarn
    if (savedUrl !== undefined) process.env.SUPABASE_URL = savedUrl
    if (savedKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = savedKey
    delete globalThis.__RATE_LIMIT_FIXTURE__
    for (const f of [RATE_LIMIT_BUILD, SUPABASE_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  it('Supabase 未設定ならフェイルオープン（true）で RPC を呼ばない', async () => {
    // Given: SUPABASE_URL / SERVICE_ROLE_KEY が未設定
    // When: checkRateLimit を呼ぶ
    // Then: true（フェイルオープン）。createClient / rpc は呼ばれない
    assert.equal(await checkRateLimit('203.0.113.5', 'likes'), true)
    assert.equal(globalThis.__RATE_LIMIT_FIXTURE__.rpcCalls, 0)
    assert.equal(globalThis.__RATE_LIMIT_FIXTURE__.createClientCalls, 0)
    assert.ok(warnCalls >= 1, '設定欠如は console.warn で可視化されるべき')
  })
})
