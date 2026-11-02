// 記事ページが Next 16 の params（Promise）から slug を受け取る配線を固定する静的検査テスト
// （Issue #173 / TDD 先行）。
//
// Next 16 では page と generateMetadata に渡る params が Promise になる。今のまま
// `params.slug` を読むと slug が undefined になり、記事を取得できない。
// generateMetadata と記事ページのどちらも、params を Promise<{ slug: string }> と型付けし、
// `const { slug } = await params` で受け取ってから getBlogArticle(slug) に渡す。
//
// page.tsx は CSS を import するコンポーネントを読み込むので node test から import できない。
// page.seo.test.ts と同じく、ソースの静的検査で契約を固定する。空白・改行・末尾カンマは
// Prettier の整形で変わりうるので、比較前に空白を取り除く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は params を同期オブジェクトとして読むため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

function stripWhitespace(source: string): string {
  return source.replace(/\s+/g, '')
}

function generateMetadataSource(source: string): string {
  const start = source.indexOf('export async function generateMetadata')
  const end = source.indexOf('export default')
  assert.ok(start >= 0 && end > start, 'generateMetadata 本体を抽出できる')
  return stripWhitespace(source.slice(start, end))
}

function pageComponentSource(source: string): string {
  const start = source.indexOf('export default')
  assert.ok(start >= 0, '記事ページのコンポーネント本体を抽出できる')
  return stripWhitespace(source.slice(start))
}

const PROMISE_PARAMS_TYPE = 'params:Promise<{slug:string}>'
const AWAIT_PARAMS = 'const{slug}=awaitparams'
const FETCH_BY_SLUG = 'getBlogArticle(slug)'

const targets = [
  { name: 'generateMetadata', source: generateMetadataSource(page) },
  { name: '記事ページ', source: pageComponentSource(page) },
]

for (const { name, source } of targets) {
  test(`${name}: params を Promise<{ slug: string }> と型付けする`, () => {
    // Given/When: 関数の引数の型
    // Then: Next 16 の params の形に合わせる
    assert.ok(source.includes(PROMISE_PARAMS_TYPE))
  })

  test(`${name}: params を await してから slug を取り出す`, () => {
    // Given/When: 関数本体
    // Then: Promise を待ってから slug を受け取る
    assert.ok(source.includes(AWAIT_PARAMS))
  })

  test(`${name}: await で受け取った slug で記事を取得する`, () => {
    // Given/When: 関数本体
    // Then: params.slug を直接読まない
    assert.ok(source.includes(FETCH_BY_SLUG))
    assert.ok(!source.includes('params.slug'))
  })
}
