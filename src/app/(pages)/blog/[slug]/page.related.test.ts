// 記事ページの関連記事の配線（Issue #14 / TDD 先行）を固定する静的検査テスト。
//
// 関連記事はビルド時に決める。記事ページ（サーバーコンポーネント）で getAllPostsMeta() の結果を
// selectRelatedPosts に渡し、選んだ記事を ArticleContent の relatedPosts に渡す。
// 実行時の API は増やさない（fetch しない）。
// page.server.tsx には関連記事の処理を足さない。page.server.test.mjs は page.server.tsx を
// トランスパイルして getPostData の import だけを差し替えるため、別の import が増えると壊れる。
//
// page.tsx は CSS を import するコンポーネントを読み込むので node test から import できない。
// page.seo.test.ts と同じく、ソースの静的検査で契約を固定する。空白・改行・末尾カンマは
// Prettier の整形で変わりうるので、比較前に空白を取り除く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は関連記事を配線していないため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const pageServer = readFileSync(
  new URL('./page.server.tsx', import.meta.url),
  'utf8',
)

function stripWhitespace(source: string): string {
  return source.replace(/\s+/g, '')
}

function namedImports(source: string, specifier: string): string[] {
  const escaped = specifier.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
  const match = source.match(
    new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*'${escaped}'`),
  )
  assert.ok(match, `'${specifier}' から名前付き import している`)
  return match![1].split(',').map((name) => name.trim())
}

function generateMetadataSource(source: string): string {
  const start = source.indexOf('export async function generateMetadata')
  const end = source.indexOf('export default')
  assert.ok(start >= 0 && end > start, 'generateMetadata 本体を抽出できる')
  return source.slice(start, end)
}

function pageComponentSource(source: string): string {
  const start = source.indexOf('export default')
  assert.ok(start >= 0, '記事ページのコンポーネント本体を抽出できる')
  return source.slice(start)
}

// props に <Toc /> を含むので、最初の `/>` では切らずに </section> までを見る
function articleContentTag(source: string): string {
  const start = source.indexOf('<ArticleContent')
  const end = source.indexOf('</section>', start)
  assert.ok(
    start >= 0 && end > start,
    '記事ページが <ArticleContent /> を描画する',
  )
  return source.slice(start, end)
}

function relatedPostsProp(tag: string): string {
  const match = stripWhitespace(tag).match(/relatedPosts=\{([^}]*)\}/)
  assert.ok(match, '<ArticleContent> に relatedPosts を渡す')
  return match![1].replace(/,$/, '')
}

const componentSource = pageComponentSource(page)
const compactComponent = stripWhitespace(componentSource)

test('page: selectRelatedPosts を同じフォルダのモジュールから読み込む', () => {
  assert.ok(
    namedImports(page, './relatedPosts').includes('selectRelatedPosts'),
    'selectRelatedPosts を import する',
  )
})

test('page: 記事一覧はローカルの記事を読む getAllPostsMeta から取る', () => {
  // Given/When/Then: ビルド時に src/posts を読む関数を使う（API を経由しない）
  assert.ok(
    namedImports(page, '@/app/api/utils/getPostData').includes(
      'getAllPostsMeta',
    ),
    'getAllPostsMeta を import する',
  )
  assert.ok(
    compactComponent.includes('getAllPostsMeta()'),
    '記事ページのコンポーネントで getAllPostsMeta() を呼ぶ',
  )
})

test('page: 表示中の記事を基準に selectRelatedPosts を呼ぶ', () => {
  assert.ok(
    compactComponent.includes('selectRelatedPosts(blogArticle,'),
    'selectRelatedPosts(blogArticle, ...) を呼ぶ',
  )
})

test('page: selectRelatedPosts の結果を ArticleContent の relatedPosts に渡す', () => {
  // Given: <ArticleContent> に渡す relatedPosts の式
  const value = relatedPostsProp(articleContentTag(componentSource))
  // Then: その場で呼ぶか、selectRelatedPosts の結果を入れた変数を渡す
  const isDirectCall = value.startsWith('selectRelatedPosts(')
  const isAssignedFromCall = compactComponent.includes(
    `const${value}=selectRelatedPosts(`,
  )
  assert.ok(
    isDirectCall || isAssignedFromCall,
    `relatedPosts={${value}} は selectRelatedPosts の結果である`,
  )
})

test('page: 関連記事のために fetch しない（実行時 API を増やさない）', () => {
  assert.ok(!/\bfetch\s*\(/.test(page), 'fetch( を含まない')
  assert.ok(!page.includes("'/api/"), "'/api/ を含まない")
})

test('page: generateMetadata では関連記事を計算しない', () => {
  // Given/When/Then: メタデータの処理は変えない
  const metadata = generateMetadataSource(page)
  assert.ok(
    !metadata.includes('selectRelatedPosts'),
    'generateMetadata で selectRelatedPosts を呼ばない',
  )
  assert.ok(
    !metadata.includes('getAllPostsMeta'),
    'generateMetadata で getAllPostsMeta を呼ばない',
  )
})

test('page.server: 関連記事の処理を足さない（page.server.test.mjs を壊さない）', () => {
  assert.ok(
    !pageServer.includes('relatedPosts'),
    'page.server.tsx は relatedPosts を参照しない',
  )
  assert.ok(
    !pageServer.includes('selectRelatedPosts'),
    'page.server.tsx は selectRelatedPosts を参照しない',
  )
})
