// api/tanka/route.tsx の整形契約を検証する単体テスト（Issue #163 / TDD 先行）。
//
// #163 は route.tsx の map callback `tagRelation: any` をはじめとする any を排除し、
// 共有ドメイン型（TankaData / TankaTag / TankaResponse / TankaPagination）で
// レスポンス契約を型付けする変更。本テストは「型のみの変更で実行時挙動が不変である」
// ことを保証するため、route が Supabase 行（snake_case・ネストした tanka_tags）を
// ドメイン形（camelCase・{ tanka, pagination } エンベロープ）へ整形する契約を固定する。
// この整形結果こそが新しい型が形式化するもの（producer=route / consumer=tanka/page）。
//
// 本リポジトリは JS テストランナー未導入のため、既存の getPostData.test.mjs /
// page.server.test.mjs と同様に Node 組み込み `node:test` と devDependency の
// `typescript` のみで構成する（新規パッケージ無し）。route.tsx は `@supabase/supabase-js`
// と `next/server` に依存するため、実コードをインメモリで JS へトランスパイルし、
// それらの import 指定子をハーミティックなモックへ張り替えて動的 import する。
//
// 実行: プロジェクトルートで `node --test src/app/api/tanka/route.test.mjs`
// 実装前後で挙動は不変のため、現行コードでも本テストは GREEN になることを期待する
// （契約の固定が目的。any 排除でこの契約が壊れないことを保証する）。

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const SUPABASE_MOCK = path.join(__dirname, '.supabase.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')

// Supabase クライアントのモック。チェーン（from→select→order→range）の終端 range が
// グローバル fixture を解決する。fixture を差し替えることで data/error/count を制御する。
const SUPABASE_MOCK_CODE = `
export function createClient() {
  const builder = {
    from() { return builder },
    select() { return builder },
    order() { return builder },
    range() {
      const fx = globalThis.__TANKA_TEST_FIXTURE__
      return Promise.resolve({ data: fx.data, error: fx.error, count: fx.count })
    },
  }
  return builder
}
`

// next/server のモック。route は NextResponse.json(body, init) のみ実行時に使用する
// （NextRequest は型注釈のみでトランスパイル時に消える）。
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
  fs.writeFileSync(SUPABASE_MOCK, SUPABASE_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)

  const code = transpile(ROUTE_SRC)
    .replaceAll('@supabase/supabase-js', toRel(SUPABASE_MOCK))
    .replaceAll('next/server', toRel(NEXT_MOCK))
  fs.writeFileSync(ROUTE_BUILD, code)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

// 代表的な Supabase 行（snake_case・ネストした tanka_tags）。
const buildRow = (overrides = {}) => ({
  tweet_id: '1234567890',
  author_id: 'author-1',
  created_at: '2026-01-01T00:00:00Z',
  extracted_at: '2026-01-02T00:00:00Z',
  original_text: '元のツイート本文',
  tanka: '古池や蛙飛び込む水の音',
  tanka_tags: [
    {
      score: 0.9,
      assigned_by: 'model-x',
      assigned_at: '2026-01-03T00:00:00Z',
      tags: {
        id: 7,
        name: '春',
        slug: 'spring',
        category: 'season',
        description: '季節の春',
      },
    },
  ],
  ...overrides,
})

describe('api/tanka/route.tsx GET（Issue #163: 整形契約の固定）', () => {
  let GET

  // query は本来の位置（クエリパラメータ）から渡す。fixture で data/error/count を制御する。
  const callGet = async (query, fixture) => {
    globalThis.__TANKA_TEST_FIXTURE__ = fixture
    const request = { url: `http://localhost/api/tanka${query}` }
    const response = await GET(request)
    return { status: response.status, body: await response.json() }
  }

  before(async () => {
    process.env.SUPABASE_URL = 'http://supabase.test'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    const mod = await loadModule()
    GET = mod.GET
  })

  after(() => {
    delete globalThis.__TANKA_TEST_FIXTURE__
    for (const f of [ROUTE_BUILD, SUPABASE_MOCK, NEXT_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  it('GET が関数としてエクスポートされている', () => {
    assert.equal(typeof GET, 'function')
  })

  it('成功時は { tanka, pagination } エンベロープを返す（TankaResponse 契約）', async () => {
    // Given: 1 行・count=1 の Supabase レスポンス
    // When: GET を呼ぶ
    // Then: status 200 で tanka(配列) と pagination(オブジェクト) を持つ
    const { status, body } = await callGet('', {
      data: [buildRow()],
      error: null,
      count: 1,
    })
    assert.equal(status, 200)
    assert.deepEqual(Object.keys(body).sort(), ['pagination', 'tanka'])
    assert.ok(Array.isArray(body.tanka))
    assert.equal(typeof body.pagination, 'object')
  })

  it('Supabase 行をドメイン形（camelCase）の TankaData へ整形する', async () => {
    // Given: snake_case の行 1 件
    // When: GET を呼ぶ
    // Then: tweet_id→id/tweetId、original_text→originalText 等へ写像される
    const { body } = await callGet('', {
      data: [buildRow()],
      error: null,
      count: 1,
    })
    const item = body.tanka[0]
    assert.equal(item.id, '1234567890')
    assert.equal(item.tweetId, '1234567890')
    assert.equal(item.tanka, '古池や蛙飛び込む水の音')
    assert.equal(item.originalText, '元のツイート本文')
    assert.equal(item.createdAt, '2026-01-01T00:00:00Z')
    assert.equal(item.extractedAt, '2026-01-02T00:00:00Z')
    assert.ok(Array.isArray(item.tags))
  })

  it('tanka_tags の各リレーションを TankaTag 形へ整形する（tagRelation の any 排除対象）', async () => {
    // Given: tags をネストした tanka_tags リレーション 1 件
    // When: GET を呼ぶ
    // Then: tags.* と score/assigned_by/assigned_at が TankaTag の全フィールドへ写像される
    const { body } = await callGet('', {
      data: [buildRow()],
      error: null,
      count: 1,
    })
    const tag = body.tanka[0].tags[0]
    assert.deepEqual(tag, {
      id: 7,
      name: '春',
      slug: 'spring',
      category: 'season',
      description: '季節の春',
      score: 0.9,
      assignedBy: 'model-x',
      assignedAt: '2026-01-03T00:00:00Z',
    })
  })

  it('tanka_tags が null の行は tags を空配列にする', async () => {
    // Given: tanka_tags が null の行
    // When: GET を呼ぶ
    // Then: tags は [] になる（|| [] フォールバック挙動の維持）
    const { body } = await callGet('', {
      data: [buildRow({ tanka_tags: null })],
      error: null,
      count: 1,
    })
    assert.deepEqual(body.tanka[0].tags, [])
  })

  it('page/limit をクエリパラメータから読み、pagination を算出する', async () => {
    // Given: ?page=2&limit=5 と count=11
    // When: GET を呼ぶ
    // Then: currentPage=2・totalItems=11・totalPages=3・hasNext=true・hasPrev=true
    const { body } = await callGet('?page=2&limit=5', {
      data: [buildRow()],
      error: null,
      count: 11,
    })
    assert.deepEqual(body.pagination, {
      currentPage: 2,
      totalItems: 11,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })
  })

  it('クエリ未指定時は page=1・limit=12 を既定値として使う', async () => {
    // Given: クエリ無し・count=12
    // When: GET を呼ぶ
    // Then: currentPage=1・totalPages=1・hasNext=false・hasPrev=false
    const { body } = await callGet('', {
      data: [buildRow()],
      error: null,
      count: 12,
    })
    assert.equal(body.pagination.currentPage, 1)
    assert.equal(body.pagination.totalPages, 1)
    assert.equal(body.pagination.hasNext, false)
    assert.equal(body.pagination.hasPrev, false)
  })

  it('最終ページでは hasNext=false・hasPrev=true になる', async () => {
    // Given: ?page=2&limit=5 と count=6（総 2 ページ）
    // When: GET を呼ぶ
    // Then: hasNext=false・hasPrev=true
    const { body } = await callGet('?page=2&limit=5', {
      data: [buildRow()],
      error: null,
      count: 6,
    })
    assert.equal(body.pagination.totalPages, 2)
    assert.equal(body.pagination.hasNext, false)
    assert.equal(body.pagination.hasPrev, true)
  })

  it('data が空配列なら tanka=[]・totalItems=0 を返す', async () => {
    // Given: data=[]・count=0
    // When: GET を呼ぶ
    // Then: 空の tanka と 0 件のページネーション
    const { body } = await callGet('', { data: [], error: null, count: 0 })
    assert.deepEqual(body.tanka, [])
    assert.equal(body.pagination.totalItems, 0)
    assert.equal(body.pagination.totalPages, 0)
    assert.equal(body.pagination.hasNext, false)
    assert.equal(body.pagination.hasPrev, false)
  })

  it('data が null（行なし）でも tanka=[] を返す（|| [] フォールバック）', async () => {
    // Given: data=null・count=null
    // When: GET を呼ぶ
    // Then: tanka=[]・totalItems=0
    const { body } = await callGet('', {
      data: null,
      error: null,
      count: null,
    })
    assert.deepEqual(body.tanka, [])
    assert.equal(body.pagination.totalItems, 0)
  })

  it('Supabase エラー時は 500 と固定メッセージを返す', async () => {
    // Given: error を含むレスポンス
    // When: GET を呼ぶ
    // Then: status 500・error='Failed to fetch tanka data'
    const { status, body } = await callGet('', {
      data: null,
      error: { message: 'boom' },
      count: null,
    })
    assert.equal(status, 500)
    assert.equal(body.error, 'Failed to fetch tanka data')
  })

  it('Supabase 設定が無いときは 500 を返す（クライアント生成前に弾く）', async () => {
    // Given: 環境変数が欠落している
    // When: GET を呼ぶ
    // Then: status 500・error='Supabase configuration is missing'
    const savedUrl = process.env.SUPABASE_URL
    const savedKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    try {
      const { status, body } = await callGet('', {
        data: [buildRow()],
        error: null,
        count: 1,
      })
      assert.equal(status, 500)
      assert.equal(body.error, 'Supabase configuration is missing')
    } finally {
      process.env.SUPABASE_URL = savedUrl
      process.env.SUPABASE_SERVICE_ROLE_KEY = savedKey
    }
  })
})
