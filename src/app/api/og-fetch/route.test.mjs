// Issue #336: api/og-fetch/route.tsx の入力検査と応答を固定する単体テスト。
//
// route は url クエリで受けた外部 URL を assertPublicUrl で検査し、open-graph-scraper で
// Open Graph 情報を取って返す。SSRF の検査を外す変更や、ogs に createSafeDispatcher() を
// 渡さなくなる変更が入ったら `npm test` が落ちるように、各分岐の status・応答・呼び出しを固定する。
// tanka-likes/route.test.mjs と同じく route.tsx を typescript で JS へ変換し、
// open-graph-scraper・next/server・@/app/api/utils/validatePublicUrl をモックへ張り替えて読み込む
// （node:test + typescript のみ。新しいパッケージ無し、外部へつながない）。
//
// 実行: `node --import tsx --test src/app/api/og-fetch/route.test.mjs`

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')
const OGS_MOCK = path.join(__dirname, '.open-graph-scraper.test-mock.mjs')
const VALIDATE_MOCK = path.join(__dirname, '.validatePublicUrl.test-mock.mjs')

const FAILED_BODY = { error: 'Failed to fetch Open Graph data' }

// route の `instanceof UnsafeUrlError` はモック内のクラスと照合するので、
// UnsafeUrlError はモックの中で作って投げる（テスト側のクラスでは 400 にならない）。
const VALIDATE_MOCK_CODE = `
export class UnsafeUrlError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnsafeUrlError'
  }
}
export async function assertPublicUrl(url) {
  const fx = globalThis.__OG_FETCH_TEST_FIXTURE__
  fx.calls.push({ fn: 'assertPublicUrl', args: [url] })
  if (fx.assertError instanceof Error) throw fx.assertError
  if (fx.assertError) throw new UnsafeUrlError(fx.assertError.unsafe)
  return new URL(url)
}
export function createSafeDispatcher() {
  const fx = globalThis.__OG_FETCH_TEST_FIXTURE__
  fx.calls.push({ fn: 'createSafeDispatcher', args: [] })
  return fx.dispatcher
}
`

const OGS_MOCK_CODE = `
export default async function ogs(options) {
  const fx = globalThis.__OG_FETCH_TEST_FIXTURE__
  fx.calls.push({ fn: 'ogs', args: [options] })
  if (fx.ogsThrows) throw fx.ogsThrows
  return fx.ogsResponse
}
`

// route は NextResponse.json(body, init) だけを実行時に使う（NextRequest は型注釈のみ）。
const NEXT_MOCK_CODE = `
export class NextRequest {}
export const NextResponse = {
  json(body, init) {
    return {
      status: (init && init.status) || 200,
      async json() { return body },
    }
  },
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
  fs.writeFileSync(VALIDATE_MOCK, VALIDATE_MOCK_CODE)
  fs.writeFileSync(OGS_MOCK, OGS_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)

  const code = transpile(ROUTE_SRC)
    .replaceAll('@/app/api/utils/validatePublicUrl', toRel(VALIDATE_MOCK))
    .replaceAll('next/server', toRel(NEXT_MOCK))
    .replaceAll('open-graph-scraper', toRel(OGS_MOCK))
  fs.writeFileSync(ROUTE_BUILD, code)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

const OG_RESULT = {
  ogTitle: 'Example Title',
  ogDescription: 'Example description',
  ogImage: [{ url: 'https://example.com/og.png' }],
  success: true,
}

const setFixture = (overrides) => {
  globalThis.__OG_FETCH_TEST_FIXTURE__ = {
    assertError: undefined,
    // createSafeDispatcher() の戻り値。ogs へ同じ参照が渡るかを確かめる。
    dispatcher: { name: 'safe-dispatcher' },
    ogsThrows: undefined,
    ogsResponse: { error: false, result: OG_RESULT },
    calls: [],
    ...overrides,
  }
  return globalThis.__OG_FETCH_TEST_FIXTURE__
}

const callsOf = (fixture, fn) => fixture.calls.filter((c) => c.fn === fn)

// `?` と `&` を含めて、route がデコード後の値で検査と取得をするかを確かめる。
const TARGET_URL = 'https://example.com/page?a=1&b=2'
const URL_QUERY = `?url=${encodeURIComponent(TARGET_URL)}`

describe('api/og-fetch/route.tsx（Issue #336: 入力検査と応答の固定）', () => {
  let GET

  before(async () => {
    const mod = await loadModule()
    GET = mod.GET
  })

  after(() => {
    delete globalThis.__OG_FETCH_TEST_FIXTURE__
    for (const f of [ROUTE_BUILD, NEXT_MOCK, OGS_MOCK, VALIDATE_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  // url は本来の位置（クエリパラメータ）から渡す。
  const callGet = async (query, overrides = {}) => {
    const fixture = setFixture(overrides)
    const request = { url: `http://localhost/api/og-fetch${query}` }
    const response = await GET(request)
    return { status: response.status, body: await response.json(), fixture }
  }

  it('GET が関数としてエクスポートされている', () => {
    assert.equal(typeof GET, 'function')
  })

  it('url が無いときは 400 を返し、検査も取得もしない', async () => {
    // Given: クエリに url が無い
    // When: GET を呼ぶ
    // Then: status 400・{ error: 'Invalid URL' }・assertPublicUrl と ogs は呼ばれない
    const { status, body, fixture } = await callGet('')
    assert.equal(status, 400)
    assert.deepEqual(body, { error: 'Invalid URL' })
    assert.equal(callsOf(fixture, 'assertPublicUrl').length, 0)
    assert.equal(callsOf(fixture, 'ogs').length, 0)
  })

  it('assertPublicUrl が UnsafeUrlError を投げたら 400 とそのメッセージを返し、ogs を呼ばない', async () => {
    // Given: assertPublicUrl が UnsafeUrlError('URL resolves to a private address') を投げる
    // When: url 付きで GET を呼ぶ
    // Then: status 400・{ error: そのメッセージ }・ogs は呼ばれない
    const message = 'URL resolves to a private address'
    const { status, body, fixture } = await callGet(URL_QUERY, {
      assertError: { unsafe: message },
    })
    assert.equal(status, 400)
    assert.deepEqual(body, { error: message })
    assert.equal(callsOf(fixture, 'ogs').length, 0)
  })

  it('assertPublicUrl がほかの例外を投げたら 500 を返し、ogs を呼ばない', async () => {
    // Given: assertPublicUrl が UnsafeUrlError 以外の Error を投げる
    // When: url 付きで GET を呼ぶ
    // Then: status 500・{ error: 'Failed to fetch Open Graph data' }・検査を飛ばして ogs へ進まない
    const { status, body, fixture } = await callGet(URL_QUERY, {
      assertError: new Error('boom'),
    })
    assert.equal(status, 500)
    assert.deepEqual(body, FAILED_BODY)
    assert.equal(callsOf(fixture, 'ogs').length, 0)
  })

  it('ogs が error を返したら 500 を返す', async () => {
    // Given: 検査は通り、ogs が { error: true } を返す
    // When: url 付きで GET を呼ぶ
    // Then: status 500・{ error: 'Failed to fetch Open Graph data' }
    const { status, body } = await callGet(URL_QUERY, {
      ogsResponse: { error: true, result: { success: false } },
    })
    assert.equal(status, 500)
    assert.deepEqual(body, FAILED_BODY)
  })

  it('ogs が例外を投げたら 500 を返す', async () => {
    // Given: 検査は通り、ogs が例外を投げる
    // When: url 付きで GET を呼ぶ
    // Then: status 500・{ error: 'Failed to fetch Open Graph data' }
    const { status, body } = await callGet(URL_QUERY, {
      ogsThrows: new Error('network'),
    })
    assert.equal(status, 500)
    assert.deepEqual(body, FAILED_BODY)
  })

  it('成功したら 200 と ogs の result をそのまま返す', async () => {
    // Given: 検査は通り、ogs が { error: false, result } を返す
    // When: url 付きで GET を呼ぶ
    // Then: status 200・応答は result と一致する
    const { status, body } = await callGet(URL_QUERY)
    assert.equal(status, 200)
    assert.deepStrictEqual(body, OG_RESULT)
  })

  it('ogs へ url・timeout: 5・createSafeDispatcher() の戻り値を渡す', async () => {
    // Given: 検査は通る
    // When: url 付きで GET を呼ぶ
    // Then: ogs の引数は { url, timeout: 5, fetchOptions: { dispatcher } } で、
    //       dispatcher は createSafeDispatcher() が 1 回だけ返した値と同じ参照
    const { fixture } = await callGet(URL_QUERY)
    const ogsCalls = callsOf(fixture, 'ogs')
    assert.equal(ogsCalls.length, 1)
    const [options] = ogsCalls[0].args
    assert.deepEqual(options, {
      url: TARGET_URL,
      timeout: 5,
      fetchOptions: { dispatcher: fixture.dispatcher },
    })
    assert.equal(options.fetchOptions.dispatcher, fixture.dispatcher)
    assert.equal(callsOf(fixture, 'createSafeDispatcher').length, 1)
  })

  it('ogs より先に、受けた url で assertPublicUrl を呼ぶ', async () => {
    // Given: 検査は通る
    // When: url 付きで GET を呼ぶ
    // Then: assertPublicUrl はデコード後の url で 1 回呼ばれ、その位置は ogs より前
    const { fixture } = await callGet(URL_QUERY)
    const assertCalls = callsOf(fixture, 'assertPublicUrl')
    assert.equal(assertCalls.length, 1)
    assert.deepEqual(assertCalls[0].args, [TARGET_URL])
    const order = fixture.calls.map((c) => c.fn)
    const assertIndex = order.indexOf('assertPublicUrl')
    const ogsIndex = order.indexOf('ogs')
    assert.ok(ogsIndex !== -1, 'ogs が呼ばれていない')
    assert.ok(
      assertIndex < ogsIndex,
      `assertPublicUrl が ogs より後に呼ばれた: ${order.join(' → ')}`,
    )
  })
})
