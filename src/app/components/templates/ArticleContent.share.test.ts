// 記事本文カードへの共有欄の配線（Issue #250 / TDD 先行）を固定する静的検査テスト。
//
// ArticleContent は本文の直後、関連記事の前に ArticleShare を置く:
//   - 記事 URL は境界（ここ）で articleUrl(blogArticle.slug) として決めて渡す
//   - .target-toc の外に置く。中に置くと共有欄の h2 が目次（tocbot）に混ざる
//   - .target-toc の閉じタグの直後、<RelatedArticles> の前、本文カードの div の中に置く
//   - 自己終了タグで書く（間に </div> を作らない。ArticleContent.related.test.ts の前提）
//
// ArticleContent は MDXRemote（async Server Component）を含み renderToStaticMarkup で描画できないため、
// ArticleContent.related.test.ts と同じくソースの静的検査で契約を固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ArticleShare を配線していないため RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const tsx = readFileSync(
  new URL('./ArticleContent.tsx', import.meta.url),
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

// .target-toc の div は MDXRemote だけを包むので、直後の最初の </div> がその閉じタグになる
function targetTocCloseEnd(source: string): number {
  const open = source.indexOf('className="target-toc"')
  assert.ok(open >= 0, '.target-toc の div がある')
  const close = source.indexOf('</div>', open)
  assert.ok(close >= 0, '.target-toc の div が閉じている')
  return close + '</div>'.length
}

test('ArticleContent: ArticleShare を organisms から読み込む', () => {
  assert.match(
    tsx,
    /import\s+ArticleShare\s+from\s+'@\/app\/components\/organisms\/ArticleShare'/,
  )
})

test('ArticleContent: 記事 URL を作る articleUrl をサイト共通モジュールから読み込む', () => {
  assert.ok(
    namedImports(tsx, '@/config/site').includes('articleUrl'),
    'articleUrl を import する',
  )
})

test('ArticleContent: 記事のタイトルと articleUrl(slug) を ArticleShare に渡す', () => {
  // Given/When/Then: 自己終了タグで、title と url だけを渡す
  assert.ok(
    stripWhitespace(tsx).includes(
      '<ArticleSharetitle={blogArticle.title}url={articleUrl(blogArticle.slug)}/>',
    ),
    '<ArticleShare title={blogArticle.title} url={articleUrl(blogArticle.slug)} /> を描画する',
  )
})

test('ArticleContent: ArticleShare を 1 回だけ描画する', () => {
  assert.equal(tsx.split('<ArticleShare').length - 1, 1)
})

test('ArticleContent: ArticleShare を .target-toc の外に置く（目次に混ぜない）', () => {
  // Given
  const tocOpen = tsx.indexOf('className="target-toc"')
  const tocCloseEnd = targetTocCloseEnd(tsx)
  const shareAt = tsx.indexOf('<ArticleShare')
  // Then
  assert.ok(shareAt >= 0, '<ArticleShare> を描画する')
  assert.ok(
    shareAt < tocOpen || shareAt >= tocCloseEnd,
    '.target-toc の中に置かない',
  )
})

test('ArticleContent: ArticleShare を本文の直後、本文カードの中に置く', () => {
  // Given
  const tocCloseEnd = targetTocCloseEnd(tsx)
  const shareAt = tsx.indexOf('<ArticleShare')
  assert.ok(shareAt >= tocCloseEnd, '本文（.target-toc）の後に置く')
  // When: .target-toc の閉じタグから <ArticleShare> までの間
  const between = tsx.slice(tocCloseEnd, shareAt)
  // Then: 間で div を閉じていない（本文カードの外やサイドバーの列に出ていない）
  assert.ok(!between.includes('</div>'), '本文カードの div の中に置く')
})

test('ArticleContent: ArticleShare を関連記事より前に置く', () => {
  // Given
  const shareAt = tsx.indexOf('<ArticleShare')
  const relatedAt = tsx.indexOf('<RelatedArticles')
  // Then: 読み終えた位置で共有を促し、そのあと次の記事へ案内する
  assert.ok(relatedAt >= 0, '<RelatedArticles> を保つ')
  assert.ok(shareAt >= 0 && shareAt < relatedAt, '本文 → 共有欄 → 関連記事')
})
