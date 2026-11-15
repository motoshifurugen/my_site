// Issue #348: api/blog/route.tsx の応答を、ハンドラを呼んで固定する単体テスト。
//
// route は GET で getAllPosts の結果を JSON で返し、例外のときは NextResponse.error() を返す。
// tags/route.test.mjs と同じく route.tsx を typescript で JS へ変換し、
// @/app/api/utils/getPostData・next/server をモックへ張り替えて読み込む
// （node:test + typescript のみ。新しいパッケージ無し）。
// .ts で書くと Pages のビルド（route.tsx を消してから next build）が落ちるので .mjs にする。
//
// 実行: `node --import tsx --test src/app/api/blog/route.test.mjs`

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const GETPOSTDATA_MOCK = path.join(__dirname, '.getPostData.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')

// throwError のときは throw し、route の catch 節を通す。
const GETPOSTDATA_MOCK_CODE = `
export async function getAllPosts() {
  const fx = globalThis.__BLOG_TEST_FIXTURE__
  if (fx.throwError) throw new Error('read failed')
  return fx.posts
}
`

// error() は返した応答を fixture に残し、GET がそれをそのまま返したかを同一性で確かめる。
const NEXT_MOCK_CODE = `
export class NextResponse {
  constructor(body, init) {
    this.body = body
    this.status = init?.status ?? 200
  }
  async json() {
    return JSON.parse(this.body)
  }
  static json(body, init) {
    return new NextResponse(JSON.stringify(body), init)
  }
  static error() {
    const res = new NextResponse(null, { status: 0 })
    globalThis.__BLOG_TEST_FIXTURE__.errorResponse = res
    return res
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
  fs.writeFileSync(GETPOSTDATA_MOCK, GETPOSTDATA_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)

  const code = transpile(ROUTE_SRC)
    .replaceAll('@/app/api/utils/getPostData', toRel(GETPOSTDATA_MOCK))
    .replaceAll('next/server', toRel(NEXT_MOCK))
  fs.writeFileSync(ROUTE_BUILD, code)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

const setFixture = (overrides) => {
  globalThis.__BLOG_TEST_FIXTURE__ = {
    posts: [],
    throwError: false,
    errorResponse: null,
    ...overrides,
  }
  return globalThis.__BLOG_TEST_FIXTURE__
}

// route は例外のとき console.error を出す。テストの出力を汚さないよう一時的に黙らせる。
const withSilencedConsoleError = async (fn) => {
  const saved = console.error
  console.error = () => {}
  try {
    return await fn()
  } finally {
    console.error = saved
  }
}

describe('api/blog/route.tsx（Issue #348: GET の応答の固定）', () => {
  let GET

  before(async () => {
    const mod = await loadModule()
    GET = mod.GET
  })

  after(() => {
    delete globalThis.__BLOG_TEST_FIXTURE__
    for (const f of [ROUTE_BUILD, GETPOSTDATA_MOCK, NEXT_MOCK]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  it('getAllPosts が配列を返すと、その配列を JSON で返す', async () => {
    // Given: getAllPosts が記事 2 件の配列を返す
    const posts = [
      {
        slug: 'hello',
        title: 'Hello',
        date: '2026-01-01',
        tags: ['Next.js'],
        content: '# Hello',
      },
      {
        slug: 'world',
        title: 'World',
        date: '2026-02-01',
        tags: [],
        content: 'body',
      },
    ]
    setFixture({ posts })

    // When: GET を呼ぶ
    const response = await GET()

    // Then: status 200・応答の JSON は getAllPosts の配列と同じ
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), posts)
  })

  it('getAllPosts が空配列を返すと、空配列を JSON で返す', async () => {
    // Given: 記事が 1 件も無い
    setFixture({ posts: [] })

    // When: GET を呼ぶ
    const response = await GET()

    // Then: status 200・応答の JSON は []
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), [])
  })

  it('getAllPosts が例外を投げると、NextResponse.error() の結果を返す', async () => {
    // Given: getAllPosts が throw する
    const fixture = setFixture({ throwError: true })

    // When: GET を呼ぶ
    const response = await withSilencedConsoleError(() => GET())

    // Then: NextResponse.error() が返した応答そのものを返す
    assert.notEqual(fixture.errorResponse, null)
    assert.equal(response, fixture.errorResponse)
  })
})
