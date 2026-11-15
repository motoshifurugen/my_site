// Issue #340: api/tags/route.tsx の絞り込みと応答を固定する単体テスト。
//
// route は GET で Supabase の tags を tag_dictionary ごと読み、category と search で絞り込んで整形する。
// 分岐を壊す変更が入ったら `npm test` が落ちるように、各分岐の status と応答を固定する。
// tanka-likes/route.test.mjs と同じく route.tsx を typescript で JS へ変換し、
// @supabase/supabase-js・next/server をモックへ張り替えて読み込む
// （node:test + typescript のみ。新しいパッケージ無し、本物の Supabase へつながない）。
//
// 実行: `node --import tsx --test src/app/api/tags/route.test.mjs`

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

// from() ごとに 1 件の呼び出し記録を作り、order・eq・or の引数を積む。
// route は builder 自体を await するので、query を thenable にする。
// throwError のときは reject し、await query が throw する経路（catch 節）を通す。
const SUPABASE_MOCK_CODE = `
export function createClient() {
  return {
    from(table) {
      const fx = globalThis.__TAGS_TEST_FIXTURE__
      const call = { table, orders: [], eqs: [], ors: [] }
      fx.calls.push(call)
      const query = {
        select() {
          return query
        },
        order(column, options) {
          call.orders.push([column, options])
          return query
        },
        eq(column, value) {
          call.eqs.push([column, value])
          return query
        },
        or(filter) {
          call.ors.push(filter)
          return query
        },
        then(resolve, reject) {
          if (fx.throwError) {
            return Promise.reject(new Error('network down')).then(resolve, reject)
          }
          return Promise.resolve(fx.result).then(resolve, reject)
        },
      }
      return query
    },
  }
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
  fs.writeFileSync(SUPABASE_MOCK, SUPABASE_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)

  const code = transpile(ROUTE_SRC)
    .replaceAll('@supabase/supabase-js', toRel(SUPABASE_MOCK))
    .replaceAll('next/server', toRel(NEXT_MOCK))
  fs.writeFileSync(ROUTE_BUILD, code)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

const setFixture = (overrides) => {
  globalThis.__TAGS_TEST_FIXTURE__ = {
    result: { data: [], error: null },
    throwError: false,
    calls: [],
    ...overrides,
  }
  return globalThis.__TAGS_TEST_FIXTURE__
}

const ENV_KEYS = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

const withoutEnv = async (key, fn) => {
  const saved = process.env[key]
  delete process.env[key]
  try {
    await fn()
  } finally {
    process.env[key] = saved
  }
}

describe('api/tags/route.tsx（Issue #340: 絞り込みと応答の固定）', () => {
  let GET

  before(async () => {
    process.env.SUPABASE_URL = 'http://supabase.test'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    const mod = await loadModule()
    GET = mod.GET
  })

  after(() => {
    delete globalThis.__TAGS_TEST_FIXTURE__
    for (const f of [ROUTE_BUILD, SUPABASE_MOCK, NEXT_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  // category / search は本来の位置（クエリパラメータ）から渡す。
  const callGet = async (params, overrides = {}) => {
    const fixture = setFixture(overrides)
    const query = new URLSearchParams(params).toString()
    const request = {
      url: `http://localhost/api/tags${query ? `?${query}` : ''}`,
    }
    const response = await GET(request)
    return { status: response.status, body: await response.json(), fixture }
  }

  it('GET が関数としてエクスポートされている', () => {
    assert.equal(typeof GET, 'function')
  })

  for (const key of ENV_KEYS) {
    it(`${key} が無いときは 500 を返し、Supabase を読まない`, async () => {
      // Given: 環境変数の片方だけが欠けている
      // When: GET を呼ぶ
      // Then: status 500・{ error: 'Supabase configuration is missing' }・from() は呼ばれない
      await withoutEnv(key, async () => {
        const { status, body, fixture } = await callGet({})
        assert.equal(status, 500)
        assert.deepEqual(body, { error: 'Supabase configuration is missing' })
        assert.equal(fixture.calls.length, 0)
      })
    })
  }

  it('Supabase が error を返したら 500 を返す', async () => {
    // Given: tags の取得が error を返す
    // When: GET を呼ぶ
    // Then: status 500・{ error: 'Failed to fetch tags data' }
    const { status, body } = await callGet(
      {},
      { result: { data: null, error: { message: 'boom' } } },
    )
    assert.equal(status, 500)
    assert.deepEqual(body, { error: 'Failed to fetch tags data' })
  })

  it('取得中に例外が出たら 500 を返す', async () => {
    // Given: await query が throw する
    // When: GET を呼ぶ
    // Then: status 500・{ error: 'Internal server error' }
    const { status, body } = await callGet({}, { throwError: true })
    assert.equal(status, 500)
    assert.deepEqual(body, { error: 'Internal server error' })
  })

  it('成功時は created_at を createdAt に、tag_dictionary を keywords に直して返す', async () => {
    // Given: tag_dictionary を持つ行（応答に出さない updated_at も含む）
    // When: GET を呼ぶ
    // Then: status 200・決めた 7 項目だけを持つ tags を返す
    const { status, body } = await callGet(
      {},
      {
        result: {
          data: [
            {
              id: 1,
              name: 'React',
              slug: 'react',
              category: 'frontend',
              description: 'UI ライブラリ',
              created_at: '2026-01-01T00:00:00Z',
              updated_at: '2026-02-01T00:00:00Z',
              tag_dictionary: [
                { keyword: 'react', match_type: 'exact', priority: 10 },
                { keyword: 'jsx', match_type: 'partial', priority: 5 },
              ],
            },
          ],
          error: null,
        },
      },
    )
    assert.equal(status, 200)
    assert.deepEqual(body, {
      tags: [
        {
          id: 1,
          name: 'React',
          slug: 'react',
          category: 'frontend',
          description: 'UI ライブラリ',
          createdAt: '2026-01-01T00:00:00Z',
          keywords: [
            { keyword: 'react', matchType: 'exact', priority: 10 },
            { keyword: 'jsx', matchType: 'partial', priority: 5 },
          ],
        },
      ],
    })
  })

  it('成功時に tag_dictionary が無い行は keywords を [] にする', async () => {
    // Given: tag_dictionary を持たない行と、tag_dictionary が null の行
    // When: GET を呼ぶ
    // Then: status 200・どちらの行も keywords は []
    const { status, body } = await callGet(
      {},
      {
        result: {
          data: [
            {
              id: 2,
              name: 'Go',
              slug: 'go',
              category: 'backend',
              description: null,
              created_at: '2026-03-01T00:00:00Z',
            },
            {
              id: 3,
              name: 'Rust',
              slug: 'rust',
              category: 'backend',
              description: 'システム言語',
              created_at: '2026-04-01T00:00:00Z',
              tag_dictionary: null,
            },
          ],
          error: null,
        },
      },
    )
    assert.equal(status, 200)
    assert.deepEqual(body, {
      tags: [
        {
          id: 2,
          name: 'Go',
          slug: 'go',
          category: 'backend',
          description: null,
          createdAt: '2026-03-01T00:00:00Z',
          keywords: [],
        },
        {
          id: 3,
          name: 'Rust',
          slug: 'rust',
          category: 'backend',
          description: 'システム言語',
          createdAt: '2026-04-01T00:00:00Z',
          keywords: [],
        },
      ],
    })
  })

  it('category があれば eq("category", category) で絞り込み、or は呼ばない', async () => {
    // Given: クエリに category=frontend
    // When: GET を呼ぶ
    // Then: eq は [['category', 'frontend']]・or は呼ばれない
    const { status, fixture } = await callGet({ category: 'frontend' })
    assert.equal(status, 200)
    assert.equal(fixture.calls.length, 1)
    assert.deepEqual(fixture.calls[0].eqs, [['category', 'frontend']])
    assert.deepEqual(fixture.calls[0].ors, [])
  })

  it('search があれば name と description の ilike を or で絞り込み、eq は呼ばない', async () => {
    // Given: クエリに search=react
    // When: GET を呼ぶ
    // Then: or は ['name.ilike.%react%,description.ilike.%react%']・eq は呼ばれない
    // search の値はエスケープされずにそのまま文字列へ入る。直しは別の Issue で扱い、
    // ここでは今の組み立て方を固定する。
    const { status, fixture } = await callGet({ search: 'react' })
    assert.equal(status, 200)
    assert.equal(fixture.calls.length, 1)
    assert.deepEqual(fixture.calls[0].ors, [
      'name.ilike.%react%,description.ilike.%react%',
    ])
    assert.deepEqual(fixture.calls[0].eqs, [])
  })

  it('category も search も無いときは eq も or も呼ばない', async () => {
    // Given: クエリパラメータが無い
    // When: GET を呼ぶ
    // Then: status 200・eq と or はどちらも呼ばれない
    const { status, fixture } = await callGet({})
    assert.equal(status, 200)
    assert.equal(fixture.calls.length, 1)
    assert.deepEqual(fixture.calls[0].eqs, [])
    assert.deepEqual(fixture.calls[0].ors, [])
  })

  it('tags テーブルを name の昇順で読む', async () => {
    // Given: クエリパラメータが無い
    // When: GET を呼ぶ
    // Then: from('tags') を 1 回呼び、order('name', { ascending: true }) をつなぐ
    const { fixture } = await callGet({})
    assert.equal(fixture.calls.length, 1)
    assert.equal(fixture.calls[0].table, 'tags')
    assert.deepEqual(fixture.calls[0].orders, [['name', { ascending: true }]])
  })
})
