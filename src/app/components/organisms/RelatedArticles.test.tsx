// 記事末の関連記事の欄（organism RelatedArticles / Issue #14 / TDD 先行）の描画契約を固定する単体テスト。
//
// RelatedArticles は page.tsx がビルド時に選んだ関連記事（PostMeta[]）を受け取り、
// 見出しと記事へのリンクを描画するだけの 'use client' コンポーネント。
//   - 0 件なら何も描画しない（見出しも出さない）
//   - 見出しは t.blog.relatedArticles（ja / en）
//   - 各記事は next/link で /blog/{slug} へリンクし、日付とタイトルを出す。
//     素の <a> だと basePath /my_site が付かないため next/link を通す
//   - 渡された順に並べる（並び替えは selectRelatedPosts の責務）
//   - .articleContent ul の style が当たるため ul / li を使わない
//   - 'use client' を付け、実行時の取得（fetch・いいね数）をしない。描画では確かめられないので
//     ソースの静的検査で確かめる
//
// ChannelLinks.test.tsx と同じく I18nProvider でラップし、next/link・next/navigation・.css を
// resolve フックでモックへ張り替える。next/link のモックは目印の data 属性を付け、
// 素の <a> と区別できるようにする。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は RelatedArticles / t.blog.relatedArticles が無いため RED、実装後に GREEN。

import type { Locale } from '@/i18n/types'
import type { PostMeta } from '@/types/posts'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { translations } from '../../../i18n/translations'

const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,'data-next-link':'true'},props.children)}",
  )

const navMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export function usePathname(){return '/'}\nexport function useRouter(){return {push(){},replace(){},prefetch(){},back(){},forward(){},refresh(){}}}\nexport function useSearchParams(){return {get(){return null}}}",
  )

const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/link') {
    return { url: ${JSON.stringify(linkMock)}, shortCircuit: true }
  }
  if (specifier === 'next/navigation') {
    return { url: ${JSON.stringify(navMock)}, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
`
register(
  'data:text/javascript,' + encodeURIComponent(resolveHook),
  import.meta.url,
)
;(globalThis as Record<string, unknown>).React = React

type RelatedArticlesComponent = React.FC<{ posts: PostMeta[] }>
type I18nProviderComponent = React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}>

let RelatedArticles: RelatedArticlesComponent
let I18nProvider: I18nProviderComponent
before(async () => {
  RelatedArticles = (await import('./RelatedArticles'))
    .default as unknown as RelatedArticlesComponent
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as I18nProviderComponent
})

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  slug: 'post',
  title: 'タイトル',
  date: '2025-01-01',
  tags: ['A'],
  ...overrides,
})

// renderToStaticMarkup は useEffect を実行しないため、ロケールは initialLocale のまま固定される
const render = (posts: PostMeta[], locale: Locale = 'ja'): string =>
  renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <RelatedArticles posts={posts} />
    </I18nProvider>,
  )

const headingPattern = (heading: string): RegExp =>
  new RegExp(`<h2[^>]*>${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h2>`)

const hrefsOf = (html: string): string[] =>
  Array.from(html.matchAll(/<a\b[^>]*href="([^"]*)"/g), (match) => match[1])

const threePosts = [
  createPost({ slug: 'first', title: '一つ目の記事', date: '2025-03-01' }),
  createPost({ slug: 'second', title: '二つ目の記事', date: '2024-02-01' }),
  createPost({ slug: 'third', title: '三つ目の記事', date: '2023-01-01' }),
]

test('RelatedArticles: 関連記事が 0 件なら何も描画しない', () => {
  // Given: 関連記事なし
  // When
  const html = render([])
  // Then: 見出しも出さない
  assert.equal(html, '')
})

test('RelatedArticles: 日本語の見出しを h2 で描画する', () => {
  // Given: ja の見出し
  const heading = translations.ja.blog.relatedArticles
  // When
  const html = render(threePosts, 'ja')
  // Then
  assert.ok(heading.length > 0, '見出しの翻訳が空でない')
  assert.match(html, headingPattern(heading))
})

test('RelatedArticles: 英語の見出しを h2 で描画する', () => {
  // Given: en の見出し
  const heading = translations.en.blog.relatedArticles
  // When
  const html = render(threePosts, 'en')
  // Then
  assert.ok(heading.length > 0, '見出しの翻訳が空でない')
  assert.match(html, headingPattern(heading))
})

test('RelatedArticles: 各記事を /blog/{slug} へのリンクにする', () => {
  // Given/When
  const html = render(threePosts)
  // Then: 記事ページへのリンクだけを、渡した順に出す
  assert.deepEqual(hrefsOf(html), [
    '/blog/first',
    '/blog/second',
    '/blog/third',
  ])
})

test('RelatedArticles: リンクは next/link で描画する（basePath を付けるため）', () => {
  // Given/When
  const html = render(threePosts)
  // Then: すべての <a> が next/link のモック由来
  const anchors = html.match(/<a\b[^>]*>/g) ?? []
  assert.equal(anchors.length, threePosts.length, '記事の数だけリンクがある')
  for (const anchor of anchors) {
    assert.ok(
      anchor.includes('data-next-link="true"'),
      `next/link を通す: ${anchor}`,
    )
  }
})

test('RelatedArticles: 各記事のタイトルと日付を描画する', () => {
  // Given/When
  const html = render(threePosts)
  // Then
  for (const post of threePosts) {
    assert.ok(html.includes(post.title), `${post.title} を描画する`)
    assert.ok(html.includes(post.date), `${post.date} を描画する`)
  }
})

test('RelatedArticles: 渡された順に並べる', () => {
  // Given: 日付の古い順に並べた入力（並び替えは selectRelatedPosts の責務）
  const posts = [...threePosts].reverse()
  // When
  const html = render(posts)
  // Then: 入力の順のまま描画する
  const positions = posts.map((post) => html.indexOf(post.title))
  assert.ok(
    positions.every((position) => position >= 0),
    'すべてのタイトルを描画する',
  )
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b),
    '入力の順に並ぶ',
  )
})

test('RelatedArticles: 1 件でも見出しとリンクを描画する', () => {
  // Given: 関連記事 1 件（境界値）
  const post = createPost({ slug: 'only', title: '唯一の記事' })
  // When
  const html = render([post])
  // Then
  assert.ok(html.includes(translations.ja.blog.relatedArticles), '見出しがある')
  assert.deepEqual(hrefsOf(html), ['/blog/only'])
})

test('RelatedArticles: ul / li を使わない（.articleContent ul の style が当たるため）', () => {
  // Given/When
  const html = render(threePosts)
  // Then
  assert.ok(!/<ul\b/.test(html), '<ul> を含まない')
  assert.ok(!/<li\b/.test(html), '<li> を含まない')
})

// --- ソースの静的検査（描画では確かめられない契約） ---

const readSource = (): string =>
  readFileSync(new URL('./RelatedArticles.tsx', import.meta.url), 'utf8')

test("RelatedArticles: useI18n を使うので 'use client' を付ける", () => {
  // Given/When/Then: サーバーコンポーネントの ArticleContent から使うため、先頭で宣言する
  assert.match(readSource(), /^\s*['"]use client['"]/)
})

test('RelatedArticles: 実行時の取得をしない（いいね数も取らない）', () => {
  // Given: 関連記事はビルド時に選んだものを props で受け取るだけ
  const source = readSource()
  // Then
  assert.ok(!/\bfetch\s*\(/.test(source), 'fetch( を含まない')
  assert.ok(!source.includes('useLikeCount'), 'useLikeCount(s) を使わない')
  assert.ok(
    !source.includes('BlogCard'),
    'likeCount 必須の BlogCard を使わない',
  )
})
