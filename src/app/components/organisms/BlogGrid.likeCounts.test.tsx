// BlogGrid のいいね数の受け取り方（Issue #7 / TDD 先行）を固定する単体テスト。
//
// 検索で絞り込むと BlogGrid に渡る blogData が 1 打鍵ごとに変わる。BlogGrid が自分で
// useLikeCounts(blogData の slug) を呼ぶと、そのたびに like API（GitHub Issues）へ
// リクエストが飛ぶ。そこで BlogGrid は useLikeCounts を呼ばず、親（ArticleList）が
// 公開記事すべてについて 1 回だけ取った likeCounts: Record<string, number> を props で受ける。
//   - likeCounts[slug] を各 BlogCard に渡す
//   - likeCounts に無い slug は 0 を出す
//   - useLikeCounts を import しない・fetch しない（ソースの静的検査）
//
// BlogCard.test.tsx と同じく、.css と next/navigation を resolve フックでモックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は BlogGrid が likeCounts を受けず useLikeCounts を呼ぶため RED、実装後に GREEN。

import type { Locale } from '@/i18n/types'
import type { PostMeta } from '@/types/posts'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

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

type BlogGridComponent = React.FC<{
  blogData: PostMeta[]
  likeCounts: Record<string, number>
}>
type I18nProviderComponent = React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}>

let BlogGrid: BlogGridComponent
let I18nProvider: I18nProviderComponent
before(async () => {
  BlogGrid = (await import('./BlogGrid'))
    .default as unknown as BlogGridComponent
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as I18nProviderComponent
})

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  slug: 'post',
  title: 'タイトル',
  date: '2025-01-01',
  tags: [],
  ...overrides,
})

const render = (
  blogData: PostMeta[],
  likeCounts: Record<string, number>,
): string =>
  renderToStaticMarkup(
    <I18nProvider initialLocale="ja">
      <BlogGrid blogData={blogData} likeCounts={likeCounts} />
    </I18nProvider>,
  )

// BlogCard はいいね数を <span class="text-sm ...">{likeCount}</span> に出す
const likeCountsInOrder = (html: string): string[] =>
  Array.from(
    html.matchAll(/<span class="text-sm[^"]*">\s*(\d+)\s*<\/span>/g),
    (match) => match[1],
  )

test('BlogGrid: props の likeCounts から各記事のいいね数を出す', () => {
  // Given
  const posts = [
    createPost({ slug: 'first', title: '一つ目' }),
    createPost({ slug: 'second', title: '二つ目' }),
  ]
  // When
  const html = render(posts, { first: 7, second: 3 })
  // Then
  assert.deepEqual(likeCountsInOrder(html), ['7', '3'])
})

test('BlogGrid: likeCounts に無い記事は 0 を出す', () => {
  // Given: likeCounts の取得前（空）
  const posts = [createPost({ slug: 'only' })]
  // When
  const html = render(posts, {})
  // Then
  assert.deepEqual(likeCountsInOrder(html), ['0'])
})

test('BlogGrid: 表示しない記事のいいね数があっても描画に影響しない', () => {
  // Given: 親は公開記事すべてのいいね数を渡すので、絞り込み後の blogData より多い
  const posts = [createPost({ slug: 'shown' })]
  // When
  const html = render(posts, { shown: 5, hidden: 99 })
  // Then
  assert.deepEqual(likeCountsInOrder(html), ['5'])
})

// --- ソースの静的検査 ---

const readSource = (): string =>
  readFileSync(new URL('./BlogGrid.tsx', import.meta.url), 'utf8')

test('BlogGrid: useLikeCounts を呼ばない（絞り込むたびに再取得しない）', () => {
  const source = readSource()
  assert.ok(!source.includes('useLikeCounts'), 'useLikeCounts を含まない')
  assert.ok(!/\bfetch\s*\(/.test(source), 'fetch( を含まない')
})
