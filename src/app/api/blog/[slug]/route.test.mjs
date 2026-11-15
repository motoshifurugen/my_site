// Issue #348: api/blog/[slug]/route.tsx の応答を、ハンドラを呼んで固定する単体テスト。
//
// route は GET で slug を isValidSlug で確かめ、不正なら 404 を返してパストラバーサルを防ぐ。
// 正しい slug なら getPostBySlug の記事を 200 で返し、空の値なら 404 を返す。
// route.params.test.ts はソースを文字列として読む検査なので、ここではハンドラを呼んで確かめる。
//
// tags/route.test.mjs と同じく route.tsx を typescript で JS へ変換し、
// @/app/api/utils/getPostData・next/server をモックへ張り替えて読み込む
// （node:test + typescript のみ。新しいパッケージ無し）。
// isValidSlug だけは本物の getPostData.tsx を変換して使う。規則をモックに写すと、
// モックを試すだけになるため。
// .ts で書くと Pages のビルド（route.tsx を消してから next build）が落ちるので .mjs にする。
//
// 存在しない slug の応答（今は getPostBySlug が throw して 500）はここでは固定しない。
//
// 実行: `node --import tsx --test "src/app/api/blog/[slug]/route.test.mjs"`

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROUTE_SRC = path.join(__dirname, 'route.tsx')
const ROUTE_BUILD = path.join(__dirname, '.route.test-build.mjs')
const GETPOSTDATA_SRC = path.join(
  __dirname,
  '..',
  '..',
  'utils',
  'getPostData.tsx',
)
// utils/getPostData.test.mjs は utils/ に同名の成果物を書く。並列実行で互いに消さないよう、
// こちらは [slug]/ に置く。
const GETPOSTDATA_BUILD = path.join(__dirname, '.getPostData.test-build.mjs')
const GETPOSTDATA_MOCK = path.join(__dirname, '.getPostData.test-mock.mjs')
const NEXT_MOCK = path.join(__dirname, '.next-server.test-mock.mjs')

const transpile = (srcPath) =>
  ts.transpileModule(fs.readFileSync(srcPath, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText

const toRel = (target) =>
  './' + path.relative(__dirname, target).split(path.sep).join('/')

const GETPOSTDATA_MOCK_CODE = `
export { isValidSlug } from '${toRel(GETPOSTDATA_BUILD)}'

export async function getPostBySlug(slug) {
  const fx = globalThis.__BLOG_SLUG_TEST_FIXTURE__
  fx.calls.getPostBySlug.push([slug])
  return fx.post
}

export async function getAllSlugs() {
  return globalThis.__BLOG_SLUG_TEST_FIXTURE__.slugs
}
`

// route は new NextResponse(body, init) を実行時に使う。
const NEXT_MOCK_CODE = `
export class NextResponse {
  constructor(body, init) {
    this.body = body
    this.status = init.status
  }
  async json() {
    return JSON.parse(this.body)
  }
}
`

const loadModule = async () => {
  fs.writeFileSync(GETPOSTDATA_BUILD, transpile(GETPOSTDATA_SRC))
  fs.writeFileSync(GETPOSTDATA_MOCK, GETPOSTDATA_MOCK_CODE)
  fs.writeFileSync(NEXT_MOCK, NEXT_MOCK_CODE)

  const code = transpile(ROUTE_SRC)
    .replaceAll('@/app/api/utils/getPostData', toRel(GETPOSTDATA_MOCK))
    .replaceAll('next/server', toRel(NEXT_MOCK))
  fs.writeFileSync(ROUTE_BUILD, code)

  return import(`${ROUTE_BUILD}?t=${process.pid}`)
}

const setFixture = (overrides) => {
  globalThis.__BLOG_SLUG_TEST_FIXTURE__ = {
    post: null,
    slugs: [],
    calls: { getPostBySlug: [] },
    ...overrides,
  }
  return globalThis.__BLOG_SLUG_TEST_FIXTURE__
}

describe('api/blog/[slug]/route.tsx（Issue #348: GET と generateStaticParams の応答の固定）', () => {
  let GET
  let generateStaticParams

  before(async () => {
    const mod = await loadModule()
    GET = mod.GET
    generateStaticParams = mod.generateStaticParams
  })

  after(() => {
    delete globalThis.__BLOG_SLUG_TEST_FIXTURE__
    for (const f of [
      ROUTE_BUILD,
      GETPOSTDATA_BUILD,
      GETPOSTDATA_MOCK,
      NEXT_MOCK,
    ]) {
      if (fs.existsSync(f)) fs.rmSync(f)
    }
  })

  // slug は本来の位置（第 2 引数の params）から渡す。第 1 引数の req は route が使わない。
  const callGet = (slug) => GET({}, { params: Promise.resolve({ slug }) })

  for (const slug of ['../secret', 'a/b']) {
    it(`不正な slug（${slug}）では 404 を返し、getPostBySlug を呼ばない`, async () => {
      // Given: 記事を返せる状態でも
      const fixture = setFixture({ post: { slug: 'secret', title: 'x' } })

      // When: パストラバーサルを含む slug で GET を呼ぶ
      const response = await callGet(slug)

      // Then: status 404・本文なし・getPostBySlug は呼ばれない
      assert.equal(response.status, 404)
      assert.equal(response.body, null)
      assert.deepEqual(fixture.calls.getPostBySlug, [])
    })
  }

  it('正しい slug で getPostBySlug が記事を返すと、200 と記事の JSON を返す', async () => {
    // Given: getPostBySlug が記事を返す
    const post = {
      slug: 'hello',
      title: 'Hello',
      date: '2026-01-01',
      tags: ['Next.js', 'TypeScript'],
      content: '# Hello\n\nbody',
    }
    const fixture = setFixture({ post })

    // When: 正しい slug で GET を呼ぶ
    const response = await callGet('hello')

    // Then: status 200・応答の JSON は記事と同じ・getPostBySlug は slug を受け取る
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), post)
    assert.deepEqual(fixture.calls.getPostBySlug, [['hello']])
  })

  for (const empty of [null, undefined]) {
    it(`getPostBySlug が空の値（${empty}）を返すと 404 を返す`, async () => {
      // Given: getPostBySlug が空の値を返す
      const fixture = setFixture({ post: empty })

      // When: 正しい slug で GET を呼ぶ
      const response = await callGet('hello')

      // Then: status 404・本文なし・getPostBySlug は 1 回呼ばれる
      assert.equal(response.status, 404)
      assert.equal(response.body, null)
      assert.deepEqual(fixture.calls.getPostBySlug, [['hello']])
    })
  }

  it('generateStaticParams は getAllSlugs の slug を { slug } の配列にして返す', async () => {
    // Given: getAllSlugs が slug 2 件を返す
    setFixture({ slugs: ['a', 'b-c'] })

    // When: generateStaticParams を呼ぶ
    const params = await generateStaticParams()

    // Then: 同じ順で { slug } の配列になる
    assert.deepEqual(params, [{ slug: 'a' }, { slug: 'b-c' }])
  })

  it('generateStaticParams は getAllSlugs が空なら空配列を返す', async () => {
    // Given: 記事が 1 件も無い
    setFixture({ slugs: [] })

    // When: generateStaticParams を呼ぶ
    const params = await generateStaticParams()

    // Then: []
    assert.deepEqual(params, [])
  })
})
