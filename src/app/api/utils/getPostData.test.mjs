// getPostData.tsx の公開関数（getAllPostsMeta / getAllPosts / isValidSlug / getPostBySlug /
// parseDateMs / getAllSlugs）の振る舞い契約を検証する単体テスト（Issue #157, #347）。
//
// 本リポジトリには JS テストランナー（jest/vitest 等）が未導入で、SoT は新規テスト基盤の
// 立ち上げを不要としている。そのため Node v20 組み込みの `node:test` と、既存 devDependency の
// `typescript` のみでテストを構成する（新規パッケージ追加なし）。
//
// 対象モジュール `getPostData.tsx` は TS/TSX かつ `process.cwd()/src/posts` を実ファイルとして
// 読むため、ここでは実コードをインメモリで JS へトランスパイルして動的 import し、実在の記事
// （src/posts/*.mdx）を fixtures として契約の不変条件を検証する。
//
// 実行: プロジェクトルートで `node --test src/app/api/utils/getPostData.test.mjs`

import matter from 'gray-matter'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_PATH = path.join(__dirname, 'getPostData.tsx')
const BUILD_PATH = path.join(__dirname, '.getPostData.test-build.mjs')
const POSTS_DIR = path.join(process.cwd(), 'src', 'posts')
const LIMITED_TAG = '限定公開'

// 実コード（getPostData.tsx）を JS へトランスパイルして import する。
// gray-matter / fs / path の bare specifier を解決させるため、ビルド成果物は
// ソースと同階層（node_modules を辿れる位置）へ書き出す。
const loadModule = async () => {
  const source = fs.readFileSync(SOURCE_PATH, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  })
  fs.writeFileSync(BUILD_PATH, transpiled.outputText)
  return import(`${BUILD_PATH}?t=${process.pid}`)
}

// 1 記事ぶんの期待値を gray-matter で独立に算出するオラクル。
// getPostData の実装ロジックに依存せず、期待値を別経路で求める。
const readExpectedPost = (fileName) => {
  const { data, content } = matter(
    fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8'),
  )
  return {
    slug: fileName.replace(/\.mdx$/, ''),
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    content,
  }
}

// fixtures から「限定公開を除いた」期待メタ（content なし）を求める。
const readExpectedMeta = () =>
  fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const { content: _content, ...meta } = readExpectedPost(name)
      return meta
    })
    .filter((meta) => !meta.tags.includes(LIMITED_TAG))

describe('getAllPostsMeta()', () => {
  let getAllPostsMeta
  let getAllPosts
  let parseDateMs
  let result

  before(async () => {
    const mod = await loadModule()
    getAllPostsMeta = mod.getAllPostsMeta
    getAllPosts = mod.getAllPosts
    parseDateMs = mod.parseDateMs
    if (typeof getAllPostsMeta === 'function') {
      result = await getAllPostsMeta()
    }
  })

  after(() => {
    if (fs.existsSync(BUILD_PATH)) fs.rmSync(BUILD_PATH)
  })

  it('関数としてエクスポートされている', () => {
    // Given: getPostData モジュール
    // When: getAllPostsMeta を参照する
    // Then: 関数である（未実装なら失敗する）
    assert.equal(typeof getAllPostsMeta, 'function')
  })

  it('配列を返す', async () => {
    // Given: 実装済みの getAllPostsMeta
    // When: 呼び出す
    // Then: 配列が返る
    assert.ok(Array.isArray(result))
  })

  it('限定公開タグの記事を除外する（件数が独立オラクルと一致）', () => {
    // Given: src/posts の実 fixtures（限定公開を含む）
    // When: getAllPostsMeta を呼ぶ
    // Then: 限定公開を除いた件数と一致する
    const expected = readExpectedMeta()
    assert.equal(result.length, expected.length)
  })

  it('限定公開タグを持つ記事を1件も含まない', () => {
    // Given: 返却された全メタ
    // When: tags を走査する
    // Then: どの記事も限定公開タグを持たない
    const hasLimited = result.some((meta) =>
      (meta.tags || []).includes(LIMITED_TAG),
    )
    assert.equal(hasLimited, false)
  })

  it('各メタは slug/title/date/tags のみを持ち content を含まない', () => {
    // Given: 軽量メタの契約（content 非含有）
    // When: 各要素のキー集合を確認する
    // Then: 余分なキー（特に content）が無い
    for (const meta of result) {
      const keys = Object.keys(meta).sort()
      assert.deepEqual(keys, ['date', 'slug', 'tags', 'title'])
      assert.equal('content' in meta, false)
    }
  })

  it('各メタの型が PostMeta 契約を満たす', () => {
    // Given: PostMeta = { slug: string; title: string; date: string; tags: string[] }
    // When: 各要素を検証する
    // Then: 型が一致する
    for (const meta of result) {
      assert.equal(typeof meta.slug, 'string')
      assert.equal(typeof meta.title, 'string')
      assert.equal(typeof meta.date, 'string')
      assert.ok(Array.isArray(meta.tags))
    }
  })

  it('日付の新しい順（降順）にソート済みで返す', () => {
    // Given: 返却された配列
    // When: 隣接要素の日付を比較する
    // Then: 常に前要素 >= 後要素（降順）
    for (let i = 0; i < result.length - 1; i++) {
      const current = parseDateMs(result[i].date)
      const next = parseDateMs(result[i + 1].date)
      assert.ok(
        current >= next,
        `インデックス ${i}（${result[i].date}）が ${i + 1}（${result[i + 1].date}）より新しくない`,
      )
    }
  })

  it('期待される slug 集合と一致する（限定公開のみ欠落）', () => {
    // Given: 独立オラクルが算出した slug 集合
    // When: 返却 slug 集合と比較する
    // Then: 完全一致する（過不足なし）
    const actual = new Set(result.map((meta) => meta.slug))
    const expected = new Set(readExpectedMeta().map((meta) => meta.slug))
    assert.deepEqual(actual, expected)
  })

  it('getAllPosts は残存し（後方互換）、件数が一致する', () => {
    // Given: SoT は getAllPosts を「残す」と明記（api/blog・sitemap が依存）
    // When: getAllPosts と getAllPostsMeta の件数を比較する
    // Then: いずれも限定公開を除外しており件数が一致する
    assert.equal(typeof getAllPosts, 'function')
  })

  it('getAllPostsMeta と getAllPosts は同じ件数（同一の除外規則）', async () => {
    // Given: 双方とも限定公開を除外する
    // When: 件数を比較する
    // Then: 一致する
    const full = await getAllPosts()
    assert.equal(result.length, full.length)
  })
})

// Issue #347: getAllPostsMeta / getAllPosts 以外の公開関数の契約を検証する。
// 期待値は実装を通さず、src/posts と gray-matter から別に求める。
describe('getPostData の slug 検査と記事読み込み', () => {
  let mod

  before(async () => {
    mod = await loadModule()
  })

  after(() => {
    if (fs.existsSync(BUILD_PATH)) fs.rmSync(BUILD_PATH)
  })

  describe('isValidSlug()', () => {
    it('英数字・ハイフン・アンダースコアだけの slug で true を返す', () => {
      // Given: 許可された文字だけの slug
      const slugs = ['create_my_site', 'abc-123', 'A_b-9']
      // When: isValidSlug に渡す
      // Then: すべて true
      for (const slug of slugs) {
        assert.equal(mod.isValidSlug(slug), true, slug)
      }
    })

    it('.mdx を付けた slug で true を返す', () => {
      // Given: 許可された slug に拡張子 .mdx を付けたもの
      // When: isValidSlug に渡す
      // Then: true
      assert.equal(mod.isValidSlug('create_my_site.mdx'), true)
    })

    it('パス区切り・ドット・空文字・空白を含む slug で false を返す', () => {
      // Given: パストラバーサルや不正な文字を含む slug
      const slugs = ['../secret', 'a/b', 'a.b', '', 'a b']
      // When: isValidSlug に渡す
      // Then: すべて false
      for (const slug of slugs) {
        assert.equal(mod.isValidSlug(slug), false, JSON.stringify(slug))
      }
    })
  })

  describe('getPostBySlug()', () => {
    const firstPostFile = () =>
      fs
        .readdirSync(POSTS_DIR)
        .filter((name) => name.endsWith('.mdx'))
        .sort()[0]

    it('src/posts にある記事の slug で slug/title/date/tags/content を返す', async () => {
      // Given: src/posts に実在する記事
      const fileName = firstPostFile()
      const expected = readExpectedPost(fileName)
      // When: 拡張子なしの slug で取得する
      const post = await mod.getPostBySlug(expected.slug)
      // Then: 5 つのキーを持ち、値が gray-matter で求めた期待値と一致する
      assert.deepEqual(Object.keys(post).sort(), [
        'content',
        'date',
        'slug',
        'tags',
        'title',
      ])
      assert.deepEqual(post, expected)
    })

    it('.mdx を付けて渡しても slug は拡張子の無い形で返す', async () => {
      // Given: src/posts に実在する記事のファイル名（.mdx 付き）
      const fileName = firstPostFile()
      const expected = readExpectedPost(fileName)
      // When: .mdx 付きで取得する
      const post = await mod.getPostBySlug(fileName)
      // Then: slug は拡張子なしで、内容も同じ記事のもの
      assert.equal(post.slug, fileName.replace(/\.mdx$/, ''))
      assert.deepEqual(post, expected)
    })

    it('不正な slug で Invalid slug を含む例外を投げる', async () => {
      // Given: パストラバーサルを含む slug
      // When: getPostBySlug に渡す
      // Then: Invalid slug で reject される
      await assert.rejects(() => mod.getPostBySlug('../secret'), /Invalid slug/)
    })

    it('形は正しいが存在しない slug で File not found を含む例外を投げる', async () => {
      // Given: 許可された文字だけで、src/posts に対応ファイルが無い slug
      const slug = 'no_such_post_issue_347'
      assert.equal(fs.existsSync(path.join(POSTS_DIR, `${slug}.mdx`)), false)
      // When: getPostBySlug に渡す
      // Then: File not found で reject される
      await assert.rejects(() => mod.getPostBySlug(slug), /File not found/)
    })
  })

  describe('parseDateMs()', () => {
    it('有効な日付で new Date(値).getTime() と同じ値を返す', () => {
      // Given: 日付だけの文字列と、時刻付きの ISO 文字列
      const values = ['2024-10-27', '2024-10-27T12:34:56Z']
      // When: parseDateMs に渡す
      // Then: new Date(値).getTime() と一致する
      for (const value of values) {
        assert.equal(mod.parseDateMs(value), new Date(value).getTime(), value)
      }
    })

    it('無効な文字列で 0 を返す', () => {
      // Given: 日付として解釈できない文字列
      const values = ['not-a-date', '']
      // When: parseDateMs に渡す
      // Then: 0 を返す
      for (const value of values) {
        assert.equal(mod.parseDateMs(value), 0, JSON.stringify(value))
      }
    })
  })

  describe('getAllSlugs()', () => {
    it('src/posts の .mdx のファイル名から拡張子を外した集合を返す', async () => {
      // Given: src/posts の .mdx ファイル
      const expected = new Set(
        fs
          .readdirSync(POSTS_DIR)
          .filter((name) => name.endsWith('.mdx'))
          .map((name) => name.replace(/\.mdx$/, '')),
      )
      // When: getAllSlugs を呼ぶ
      const slugs = await mod.getAllSlugs()
      // Then: 拡張子を外した slug の集合と一致する
      assert.deepEqual(new Set(slugs), expected)
    })
  })
})
