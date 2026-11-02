// 記事本文カードへの関連記事の配線（Issue #14 / TDD 先行）を固定する静的検査テスト。
//
// ArticleContent は page.tsx から relatedPosts（ビルド時に選んだ PostMeta[]）を受け取り、
// 本文カードの末尾で RelatedArticles に渡す。置き場所の制約:
//   - .target-toc の外に置く。目次（tocbot）は .target-toc 内の h2〜h4 を拾うので、
//     中に置くと「関連記事」の見出しが目次に混ざる
//   - .target-toc の直後、本文カードの div の中に置く（サイドバーの列には置かない）
//
// ArticleContent は MDXRemote（async Server Component）を含み renderToStaticMarkup で描画できないため、
// ArticleContent.wiring.test.ts と同じくソースの静的検査で契約を固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は relatedPosts / RelatedArticles を配線していないため RED、実装後に GREEN。

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

function propsInterface(source: string): string {
  const match = source.match(/interface\s+ArticleContentProps\s*\{([^}]*)\}/)
  assert.ok(match, 'ArticleContentProps を抽出できる')
  return match![1]
}

// .target-toc の div は MDXRemote だけを包むので、直後の最初の </div> がその閉じタグになる
function targetTocCloseEnd(source: string): number {
  const open = source.indexOf('className="target-toc"')
  assert.ok(open >= 0, '.target-toc の div がある')
  const close = source.indexOf('</div>', open)
  assert.ok(close >= 0, '.target-toc の div が閉じている')
  return close + '</div>'.length
}

test('ArticleContent: RelatedArticles を organisms から読み込む', () => {
  assert.match(
    tsx,
    /import\s+RelatedArticles\s+from\s+'@\/app\/components\/organisms\/RelatedArticles'/,
  )
})

test('ArticleContent: props に必須の relatedPosts: PostMeta[] を持つ', () => {
  // Given/When/Then: 省略可能にしない（page.tsx が必ず渡す）
  const props = stripWhitespace(propsInterface(tsx))
  assert.ok(
    props.includes('relatedPosts:PostMeta[]'),
    'relatedPosts: PostMeta[]',
  )
})

test('ArticleContent: 受け取った relatedPosts を RelatedArticles にそのまま渡す', () => {
  assert.ok(
    stripWhitespace(tsx).includes('<RelatedArticlesposts={relatedPosts}/>'),
    '<RelatedArticles posts={relatedPosts} /> を描画する',
  )
})

test('ArticleContent: RelatedArticles を .target-toc の外に置く（目次に混ぜない）', () => {
  // Given
  const tocOpen = tsx.indexOf('className="target-toc"')
  const tocCloseEnd = targetTocCloseEnd(tsx)
  const relatedAt = tsx.indexOf('<RelatedArticles')
  // Then
  assert.ok(relatedAt >= 0, '<RelatedArticles> を描画する')
  assert.ok(
    relatedAt < tocOpen || relatedAt >= tocCloseEnd,
    '.target-toc の中に置かない',
  )
})

test('ArticleContent: RelatedArticles を本文の直後、本文カードの中に置く', () => {
  // Given
  const tocCloseEnd = targetTocCloseEnd(tsx)
  const relatedAt = tsx.indexOf('<RelatedArticles')
  assert.ok(relatedAt >= tocCloseEnd, '本文（.target-toc）の後に置く')
  // When: .target-toc の閉じタグから <RelatedArticles> までの間
  const between = tsx.slice(tocCloseEnd, relatedAt)
  // Then: 間で div を閉じていない（本文カードの外やサイドバーの列に出ていない）
  assert.ok(!between.includes('</div>'), '本文カードの div の中に置く')
  assert.ok(relatedAt < tsx.indexOf('<Sidebar'), 'サイドバーより前に置く')
})
