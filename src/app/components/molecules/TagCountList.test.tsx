// ブログ一覧の件数つきタグ一覧（molecule TagCountList / Issue #7 / TDD 先行）の描画契約を固定する単体テスト。
//
// TagCountList は { tagCounts: TagCount[] } を受け取り、見出しとタグへのリンクを描画する。
//   - 見出しは t.blog.tagList（ja / en）
//   - 各タグは next/link で /blog?tag=${encodeURIComponent(tag)} へリンクする。素の <a> だと
//     basePath /my_site が付かないため next/link を通す。押すと既存の ?tag= 絞り込みが効く
//   - リンクの文字は「タグ名 (件数)」
//   - 渡された順に並べる（並び替えは countTags の責務）
//   - .articleContent ul の style が当たるため ul / li を使わない
//   - 'use client' を付け、自分で fetch しない
//
// RelatedArticles.test.tsx と同じく I18nProvider でラップし、next/link・next/navigation・.css を
// resolve フックでモックへ張り替える。next/link のモックは目印の data 属性を付ける。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は TagCountList / t.blog.tagList が無いため RED、実装後に GREEN。

import type { Locale } from '@/i18n/types'
import type { TagCount } from '@/types/posts'
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

type TagCountListComponent = React.FC<{ tagCounts: TagCount[] }>
type I18nProviderComponent = React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}>

let TagCountList: TagCountListComponent
let I18nProvider: I18nProviderComponent
before(async () => {
  TagCountList = (await import('./TagCountList'))
    .default as unknown as TagCountListComponent
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as I18nProviderComponent
})

// renderToStaticMarkup は useEffect を実行しないため、ロケールは initialLocale のまま固定される
const render = (tagCounts: TagCount[], locale: Locale = 'ja'): string =>
  renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <TagCountList tagCounts={tagCounts} />
    </I18nProvider>,
  )

const decodeHtml = (text: string): string =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

const anchorsOf = (html: string): { tag: string; text: string }[] =>
  Array.from(html.matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/g), (match) => ({
    tag: match[1],
    text: decodeHtml(match[2].replace(/<[^>]+>/g, ''))
      .replace(/\s+/g, ' ')
      .trim(),
  }))

const hrefOf = (anchorTag: string): string | undefined =>
  anchorTag.match(/\shref="([^"]*)"/)?.[1]

const sampleTagCounts: TagCount[] = [
  { tag: 'ブログ', count: 14 },
  { tag: 'React', count: 4 },
  { tag: 'Next.js', count: 1 },
]

for (const locale of ['ja', 'en'] as const) {
  test(`TagCountList: 見出しに t.blog.tagList を出す（${locale}）`, () => {
    // Given
    const heading = translations[locale].blog.tagList
    // When
    const html = render(sampleTagCounts, locale)
    // Then
    assert.ok(heading.length > 0, '見出しの翻訳が空でない')
    assert.ok(html.includes(heading), `「${heading}」を描画する`)
  })
}

test('TagCountList: 各タグを /blog?tag=<encodeURIComponent(tag)> へのリンクにする', () => {
  // Given/When
  const html = render(sampleTagCounts)
  // Then: 渡した順に、タグの数だけリンクを出す
  assert.deepEqual(
    anchorsOf(html).map(({ tag }) => hrefOf(tag)),
    sampleTagCounts.map(({ tag }) => `/blog?tag=${encodeURIComponent(tag)}`),
  )
})

test('TagCountList: URL で意味を持つ記号を含むタグもエンコードする', () => {
  // Given: '#' と '&' と空白を含むタグ
  const tagCounts: TagCount[] = [{ tag: 'C# & .NET', count: 2 }]
  // When
  const html = render(tagCounts)
  // Then
  const [anchor] = anchorsOf(html)
  assert.equal(hrefOf(anchor.tag), '/blog?tag=C%23%20%26%20.NET')
})

test('TagCountList: リンクは next/link で描画する（basePath を付けるため）', () => {
  // Given/When
  const anchors = anchorsOf(render(sampleTagCounts))
  // Then
  assert.equal(anchors.length, sampleTagCounts.length)
  for (const { tag } of anchors) {
    assert.ok(tag.includes('data-next-link="true"'), `next/link を通す: ${tag}`)
  }
})

test('TagCountList: リンクの文字は「タグ名 (件数)」', () => {
  // Given/When
  const anchors = anchorsOf(render(sampleTagCounts))
  // Then
  assert.deepEqual(
    anchors.map(({ text }) => text),
    ['ブログ (14)', 'React (4)', 'Next.js (1)'],
  )
})

test('TagCountList: 1 件でもリンクを描画する', () => {
  // Given: 境界値
  const tagCounts: TagCount[] = [{ tag: 'ポートフォリオ', count: 1 }]
  // When
  const anchors = anchorsOf(render(tagCounts))
  // Then
  assert.equal(anchors.length, 1)
  assert.equal(anchors[0].text, 'ポートフォリオ (1)')
})

test('TagCountList: ul / li を使わない（.articleContent ul の style が当たるため）', () => {
  // Given/When
  const html = render(sampleTagCounts)
  // Then
  assert.ok(!/<ul\b/.test(html), '<ul> を含まない')
  assert.ok(!/<li\b/.test(html), '<li> を含まない')
})

// --- ソースの静的検査（描画では確かめられない契約） ---

const readSource = (): string =>
  readFileSync(new URL('./TagCountList.tsx', import.meta.url), 'utf8')

test("TagCountList: useI18n を使うので 'use client' を付ける", () => {
  assert.match(readSource(), /^\s*['"]use client['"]/)
})

test('TagCountList: 自分で fetch せず、件数も数えない（props の tagCounts を出すだけ）', () => {
  const source = readSource()
  assert.ok(!/\bfetch\s*\(/.test(source), 'fetch( を含まない')
  assert.ok(!source.includes('countTags'), 'countTags を呼ばない')
})
