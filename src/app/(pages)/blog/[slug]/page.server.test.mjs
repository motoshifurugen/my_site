// blog/[slug]/page.server.tsx の振る舞い契約を検証する単体テスト（Issue #157 / TDD 先行）。
//
// #157 の根本原因は generateStaticParams / getBlogArticle がビルド時に外部 API を fetch し、
// API 障害・URL 変更でビルドが落ちること。本テストは「外部 API に依存せずローカルの記事
// （src/posts/*.mdx）から静的パラメータ・記事本文を生成する」契約を固定する。
//
// 本リポジトリは JS テストランナー未導入のため、既存の getPostData.test.mjs と同様に
// Node 組み込み `node:test` と devDependency の `typescript` のみで構成する（新規パッケージ無し）。
// 対象は TSX かつ `@/` エイリアスと getPostData への依存を持つため、実コードをインメモリで
// JS へトランスパイルし、エイリアス import を実体へ張り替えて動的 import する。
//
// 実行: プロジェクトルートで
//   node --test 'src/app/(pages)/blog/[slug]/page.server.test.mjs'
//
// 重要: 本テストは「API がダウンしていてもローカルから生成できる」という #157 の要件を
// ハーミティックに固定するため、テスト中は globalThis.fetch を強制失敗（API ダウン相当）に
// 差し替える。fetch 依存実装ならここで throw して RED、ローカル直読み実装なら fetch を
// 一切呼ばず GREEN になる（実環境で localhost:3000 が応答するか否かに左右されない）。

import matter from 'gray-matter'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PAGESERVER_SRC = path.join(__dirname, 'page.server.tsx')
const PAGESERVER_BUILD = path.join(__dirname, '.page.server.test-build.mjs')

const POSTDATA_SRC = path.join(
  process.cwd(),
  'src',
  'app',
  'api',
  'utils',
  'getPostData.tsx',
)
const POSTDATA_BUILD = path.join(
  process.cwd(),
  'src',
  'app',
  'api',
  'utils',
  '.getPostData.pageserver-build.mjs',
)

const POSTS_DIR = path.join(process.cwd(), 'src', 'posts')
const LIMITED_TAG = '限定公開'

const transpile = (srcPath) => {
  const source = fs.readFileSync(srcPath, 'utf8')
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
}

// page.server.tsx は getPostData を `@/` エイリアスで参照する。テストでは依存の getPostData を
// 先に JS へトランスパイルし、その実体（相対パス）へ import 指定子を張り替えてから読み込む。
const loadModule = async () => {
  fs.writeFileSync(POSTDATA_BUILD, transpile(POSTDATA_SRC))

  const relToPostData =
    './' + path.relative(__dirname, POSTDATA_BUILD).split(path.sep).join('/')

  const pageServer = transpile(PAGESERVER_SRC).replaceAll(
    '@/app/api/utils/getPostData',
    relToPostData,
  )
  fs.writeFileSync(PAGESERVER_BUILD, pageServer)

  return import(`${PAGESERVER_BUILD}?t=${process.pid}`)
}

// 公開（限定公開を除く）記事の slug 集合を独立に算出するオラクル。
const readPublishedSlugs = () => {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const slug = name.replace(/\.mdx$/, '')
      const { data } = matter(
        fs.readFileSync(path.join(POSTS_DIR, name), 'utf8'),
      )
      return { slug, tags: data.tags || [] }
    })
    .filter((post) => !post.tags.includes(LIMITED_TAG))
    .map((post) => post.slug)
}

describe('blog/[slug]/page.server.tsx（Issue #157: ローカル直読み）', () => {
  let generateStaticParams
  let getBlogArticle
  let params
  let fetchCalls
  const originalFetch = globalThis.fetch

  before(async () => {
    // API ダウン（および「外部 fetch を一切しない」こと）を保証するため fetch を差し替える。
    fetchCalls = 0
    globalThis.fetch = async (...callArgs) => {
      fetchCalls += 1
      throw new Error(`API down (fetch must not be called): ${callArgs[0]}`)
    }

    const mod = await loadModule()
    generateStaticParams = mod.generateStaticParams
    getBlogArticle = mod.getBlogArticle
    if (typeof generateStaticParams === 'function') {
      params = await generateStaticParams()
    }
  })

  after(() => {
    globalThis.fetch = originalFetch
    if (fs.existsSync(PAGESERVER_BUILD)) fs.rmSync(PAGESERVER_BUILD)
    if (fs.existsSync(POSTDATA_BUILD)) fs.rmSync(POSTDATA_BUILD)
  })

  it('外部 API を一切 fetch しない（ビルド時のリモート依存を持たない）', () => {
    // Given: テスト中は fetch が必ず throw する（API ダウン相当）
    // When: generateStaticParams 実行後の fetch 呼び出し回数を確認する
    // Then: 0 回（ローカルファイルのみで完結する）
    assert.equal(fetchCalls, 0)
  })

  it('generateStaticParams / getBlogArticle が関数としてエクスポートされている', () => {
    assert.equal(typeof generateStaticParams, 'function')
    assert.equal(typeof getBlogArticle, 'function')
  })

  it('generateStaticParams は { slug } の配列を返す（ローカル生成・fetch しない）', () => {
    // Given: 外部 API に依存しないローカル実装
    // When: generateStaticParams を呼ぶ
    // Then: { slug: string } の配列が返る（fetch 依存だと localhost 接続失敗で throw する）
    assert.ok(Array.isArray(params))
    assert.ok(params.length > 0)
    for (const p of params) {
      assert.equal(typeof p.slug, 'string')
      assert.deepEqual(Object.keys(p), ['slug'])
    }
  })

  it('generateStaticParams は限定公開記事を含まない（従来挙動と一致）', () => {
    // Given: 従来は /blog/（getAllPosts 相当）を fetch し限定公開を除外していた
    // When: ローカル生成した静的パラメータの slug 集合を確認する
    // Then: 公開記事の slug 集合と完全一致する（限定公開のみ欠落）
    const actual = new Set(params.map((p) => p.slug))
    const expected = new Set(readPublishedSlugs())
    assert.deepEqual(actual, expected)
  })

  it('getBlogArticle は実在 slug の本文付き記事をローカルから返す', async () => {
    // Given: 公開記事の slug
    // When: getBlogArticle を呼ぶ
    // Then: slug/title/content を持つ記事が返る
    const slug = readPublishedSlugs()[0]
    const article = await getBlogArticle(slug)
    assert.equal(article.slug, slug)
    assert.equal(typeof article.title, 'string')
    assert.equal(typeof article.content, 'string')
  })

  it('getBlogArticle は存在しない slug で reject する', async () => {
    // Given: 存在しない slug
    // When: getBlogArticle を呼ぶ
    // Then: エラーになる（壊れた API への fetch ではなくローカル判定）
    await assert.rejects(() =>
      getBlogArticle('__this_slug_does_not_exist_157__'),
    )
  })
})
