// 記事の BlogPosting JSON-LD（Issue #19 SEO 改善 / TDD 先行）の契約を固定する単体テスト。
//
// blogPostingJsonLd.ts は 2 つの純関数を持つ:
//   - buildBlogPostingJsonLd(post): schema.org の BlogPosting を組み立てる
//   - serializeJsonLd(data): <script type="application/ld+json"> に入れる文字列にする。
//     dangerouslySetInnerHTML に入れるため、`<` を \u003c にして `</script>` で
//     script 要素から抜け出されるのを防ぐ
// page.tsx は CSS を import するので node test から import できない。そのため JSON-LD の
// 組み立てを純関数に分け、ここで直接テストする（page.tsx への配線は page.seo.test.ts）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は blogPostingJsonLd.ts が無いため import エラーで RED、実装後に GREEN。

import type { Post } from '@/types/posts'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildBlogPostingJsonLd, serializeJsonLd } from './blogPostingJsonLd'

const post: Post = {
  slug: 'create_my_site',
  title: 'ポートフォリオサイトを作った',
  date: '2024-08-15',
  tags: ['Next.js', 'React'],
  content: '# はじめに\n本文です。',
}

test('buildBlogPostingJsonLd: 記事から schema.org の BlogPosting を組み立てる', () => {
  // Given: ローカルの MDX から読んだ記事
  // When
  const jsonLd = buildBlogPostingJsonLd(post)
  // Then: URL はすべて basePath 込みの絶対 URL。本文（content）は含めない
  assert.deepEqual(jsonLd, {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'ポートフォリオサイトを作った',
    datePublished: '2024-08-15',
    url: 'https://furugen-island.com/my_site/blog/create_my_site',
    mainEntityOfPage: 'https://furugen-island.com/my_site/blog/create_my_site',
    author: {
      '@type': 'Person',
      name: '古堅基史',
      url: 'https://furugen-island.com/my_site/profile',
    },
    image: 'https://furugen-island.com/my_site/images/island.png',
    keywords: ['Next.js', 'React'],
    inLanguage: 'ja',
  })
})

test('buildBlogPostingJsonLd: url と mainEntityOfPage は記事の slug ごとに変わる', () => {
  // Given: slug だけが違う記事
  const other: Post = { ...post, slug: 'another_post' }
  // When
  const jsonLd = buildBlogPostingJsonLd(other)
  // Then: 固定値ではなく、記事自身の URL を指す
  assert.equal(
    jsonLd.url,
    'https://furugen-island.com/my_site/blog/another_post',
  )
  assert.equal(
    jsonLd.mainEntityOfPage,
    'https://furugen-island.com/my_site/blog/another_post',
  )
})

test('buildBlogPostingJsonLd: タグが無い記事では keywords が空配列になる', () => {
  // Given: タグ 0 件の記事（境界値）
  const untagged: Post = { ...post, tags: [] }
  // When
  const jsonLd = buildBlogPostingJsonLd(untagged)
  // Then
  assert.deepEqual(jsonLd.keywords, [])
})

test('buildBlogPostingJsonLd: 入力の記事を変更しない', () => {
  // Given
  const input: Post = { ...post, tags: [...post.tags] }
  const snapshot = structuredClone(input)
  // When
  buildBlogPostingJsonLd(input)
  // Then
  assert.deepEqual(input, snapshot)
})

test('serializeJsonLd: JSON として読み戻すと元のデータと等しい', () => {
  // Given
  const jsonLd = buildBlogPostingJsonLd(post)
  // When
  const serialized = serializeJsonLd(jsonLd)
  // Then: クローラーが JSON としてそのまま解釈できる
  assert.deepEqual(JSON.parse(serialized), jsonLd)
})

test('serializeJsonLd: </script> を含む値でも script 要素から抜け出せない', () => {
  // Given: タイトルに閉じタグを仕込んだ記事
  const malicious: Post = {
    ...post,
    title: '</script><script>alert(1)</script>',
  }
  // When
  const serialized = serializeJsonLd(buildBlogPostingJsonLd(malicious))
  // Then: `<` を 1 文字も残さない（\u003c にする）
  assert.ok(!serialized.includes('<'), `"<" を含まない: ${serialized}`)
  assert.ok(serialized.includes('\\u003c/script>'), '\\u003c に置き換える')
})

test('serializeJsonLd: エスケープしても値の意味は変わらない', () => {
  // Given: `<` を複数含む値
  const data = { headline: 'a < b <<< c </script>' }
  // When
  const serialized = serializeJsonLd(data)
  // Then: JSON として読み戻すと元の文字列に戻る
  assert.deepEqual(JSON.parse(serialized), data)
})

test('serializeJsonLd: 日本語はそのまま残す', () => {
  // Given/When
  const serialized = serializeJsonLd({ headline: '古堅基史のブログ' })
  // Then
  assert.ok(serialized.includes('古堅基史のブログ'))
})
