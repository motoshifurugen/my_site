// 記事ページの SEO 配線（Issue #19 SEO 改善 / TDD 先行）を固定する静的検査テスト。
//
// 記事ページは次の 2 つを足す:
//   (1) generateMetadata に openGraph（article）を足す。Next は openGraph を親子でマージせず、
//       子が丸ごと置き換える。だから ...baseOpenGraph を先に展開してから type: 'article' で
//       上書きする。展開しないと og:url / og:site_name / og:image / og:locale が消える。
//       title / description は書かない（ページの値を引き継がせる）。
//   (2) <section> の先頭に BlogPosting の JSON-LD を <script type="application/ld+json"> で出す。
//       中身は必ず serializeJsonLd を通す（`<` をエスケープして </script> で抜け出されないようにする）。
// 既存の title / noindex の robots は変えない。description は本文の先頭 50 文字から
// Markdown 記号や HTML タグを除いた要約文にする（buildArticleDescription）。
// 理由: content.slice(0, 50) のままだと先頭の空行や `##` 等の記号、埋め込み HTML が
// そのまま og:description / twitter:description に出てリンクシェアの見た目が崩れる。
//
// page.tsx は CSS を import するコンポーネントを読み込むので node test から import できない。
// layout.font.test.ts と同じく、ソースの静的検査で契約を固定する。空白・改行・末尾カンマは
// Prettier の整形で変わりうるので、比較前に空白を取り除く。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は openGraph / JSON-LD が無いため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

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

function openGraphBlock(source: string): string {
  const match = source.match(/openGraph:\s*\{([^}]*)\}/)
  assert.ok(match, 'generateMetadata が openGraph のオブジェクトを返す')
  return match![1]
}

function jsonLdScriptTag(source: string): string {
  const match = source.match(/<script\b[\s\S]*?\/>/)
  assert.ok(match, '記事ページが <script /> を描画する')
  return match![0]
}

const metadataSource = generateMetadataSource(page)
const componentSource = pageComponentSource(page)

// --- (1) generateMetadata の openGraph ---

test('page: baseOpenGraph をサイト共通モジュールから読み込む', () => {
  assert.ok(
    namedImports(page, '@/config/site').includes('baseOpenGraph'),
    'baseOpenGraph を import する',
  )
})

test('page: openGraph は baseOpenGraph を展開してから article で上書きする', () => {
  // Given: generateMetadata が返す openGraph
  const og = openGraphBlock(metadataSource)
  // When: 展開と type 指定の位置
  const spreadAt = og.indexOf('...baseOpenGraph')
  const typeAt = og.indexOf("type: 'article'")
  // Then: 展開が先にあり、og:type が website ではなく article になる
  assert.ok(spreadAt >= 0, '...baseOpenGraph を展開する')
  assert.ok(typeAt >= 0, "type: 'article' を持つ")
  assert.ok(spreadAt < typeAt, '...baseOpenGraph の後に type を書く')
})

test('page: openGraph に記事の公開日を載せる', () => {
  const og = stripWhitespace(openGraphBlock(metadataSource))
  assert.ok(
    og.includes('publishedTime:blogArticle.date'),
    'publishedTime: blogArticle.date を持つ',
  )
})

test('page: openGraph に記事のタグを載せる', () => {
  const og = stripWhitespace(openGraphBlock(metadataSource))
  assert.ok(
    og.includes('tags:blogArticle.tags'),
    'tags: blogArticle.tags を持つ',
  )
})

test('page: openGraph に title / description を書かない（ページの値を引き継ぐ）', () => {
  const og = openGraphBlock(metadataSource)
  assert.ok(!/\btitle\s*:/.test(og), 'openGraph に title を書かない')
  assert.ok(
    !/\bdescription\s*:/.test(og),
    'openGraph に description を書かない',
  )
})

// --- 既存のメタを変えない ---

test('page: 既存の title（記事タイトル）を変えない', () => {
  assert.ok(
    stripWhitespace(metadataSource).includes('title:blogArticle.title,'),
    'title: blogArticle.title を保つ',
  )
})

test('page: description は本文から組み立てた要約文を使う', () => {
  assert.ok(
    namedImports(page, './articleDescription').includes(
      'buildArticleDescription',
    ),
    'buildArticleDescription を import する',
  )
  const compact = stripWhitespace(metadataSource)
  assert.ok(
    compact.includes(
      'constdescription=buildArticleDescription(blogArticle.content)',
    ),
    'buildArticleDescription(blogArticle.content) を使う',
  )
  assert.ok(compact.includes('description:description,'), 'description を返す')
})

test('page: 既存の noindex 判定（robots）を変えない', () => {
  const compact = stripWhitespace(metadataSource)
  assert.ok(compact.includes("includes('noindex')"), 'noindex タグを判定する')
  assert.ok(
    compact.includes('{index:false,follow:false}'),
    'noindex 記事は index / follow を false にする',
  )
  assert.ok(compact.includes('robots,'), 'robots を返す')
})

// --- (2) BlogPosting の JSON-LD ---

test('page: JSON-LD の関数を同じフォルダのモジュールから読み込む', () => {
  const names = namedImports(page, './blogPostingJsonLd')
  assert.ok(
    names.includes('buildBlogPostingJsonLd'),
    'buildBlogPostingJsonLd を import する',
  )
  assert.ok(names.includes('serializeJsonLd'), 'serializeJsonLd を import する')
})

test('page: JSON-LD を application/ld+json の script で出す', () => {
  const tag = jsonLdScriptTag(componentSource)
  assert.ok(
    tag.includes('type="application/ld+json"'),
    'type="application/ld+json" を持つ',
  )
})

test('page: script の中身は記事から組み立てた JSON-LD を serializeJsonLd で文字列にしたもの', () => {
  // Given/When: script タグの dangerouslySetInnerHTML
  const tag = stripWhitespace(jsonLdScriptTag(componentSource))
  // Then: エスケープを通さずに埋め込まない
  assert.match(
    tag,
    /dangerouslySetInnerHTML=\{\{__html:serializeJsonLd\(buildBlogPostingJsonLd\(blogArticle\),?\),?\}\}/,
  )
})

test('page: JSON.stringify を直接使わない（エスケープの迂回を防ぐ）', () => {
  assert.ok(!page.includes('JSON.stringify'), 'JSON.stringify を含まない')
})

test('page: script は <section> の先頭、記事本文より前に置く', () => {
  // Given: 記事ページのコンポーネント本体
  const sectionAt = componentSource.indexOf('<section>')
  const scriptAt = componentSource.indexOf('<script')
  const articleAt = componentSource.indexOf('<ArticleContent')
  // When/Then: 既存の <section> の中に入れ、ラッパー要素を増やさない
  assert.ok(sectionAt >= 0, '<section> を保つ')
  assert.ok(articleAt >= 0, '<ArticleContent> を保つ')
  assert.ok(
    sectionAt < scriptAt && scriptAt < articleAt,
    '<section> → <script> → <ArticleContent> の順に並ぶ',
  )
})
