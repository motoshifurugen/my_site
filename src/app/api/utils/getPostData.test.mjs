// getAllPostsMeta() の振る舞い契約を検証する単体テスト（Issue #157 / TDD 先行）。
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
// 実装前は `getAllPostsMeta` が未定義のため失敗する（TDD 上想定どおり）。

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

// fixtures から「限定公開を除いた」期待メタを gray-matter で独立に算出するオラクル。
// getAllPostsMeta の実装ロジックに依存せず、期待値を別経路で求める。
const readExpectedMeta = () => {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.mdx'))
  return files
    .map((name) => {
      const slug = name.replace(/\.mdx$/, '')
      const { data } = matter(
        fs.readFileSync(path.join(POSTS_DIR, name), 'utf8'),
      )
      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
      }
    })
    .filter((meta) => !meta.tags.includes(LIMITED_TAG))
}

const parseDateMs = (value) => {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? new Date(0).getTime() : time
}

describe('getAllPostsMeta()', () => {
  let getAllPostsMeta
  let getAllPosts
  let result

  before(async () => {
    const mod = await loadModule()
    getAllPostsMeta = mod.getAllPostsMeta
    getAllPosts = mod.getAllPosts
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
