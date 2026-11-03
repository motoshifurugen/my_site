// 記事末の共有欄（organism ArticleShare / Issue #250 / TDD 先行）の描画契約を固定する単体テスト。
//
// ArticleShare は ArticleContent から { title, url } を受け取り、次を描くだけの 'use client'
// コンポーネント。URL は呼び出し側（articleUrl）で決め、ここでは組み立てない。
//   - <section aria-labelledby> と、その id を持つ見出し h2（t.blog.share.heading）
//   - 締めの一言 p（t.blog.share.message）
//   - X とはてなブックマークへの外部リンク（buildShareLinks の URL）。
//     target="_blank" rel="noopener noreferrer" を付ける
//   - リンクをコピーするボタン（t.blog.share.copyLink）
//   - .articleContent ul に list-style が当たるので ul / li を使わない
//   - dark: の装飾を持つ
//
// RelatedArticles.test.tsx と同じく I18nProvider で包み、.css と next/* を resolve フックで
// モックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は ArticleShare / t.blog.share が無いため RED、実装後に GREEN。

import type { Locale } from '@/i18n/types'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { translations } from '../../../i18n/translations'
import { buildShareLinks } from './articleShareLinks'

const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,target:props.target,rel:props.rel},props.children)}",
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

interface ArticleShareProps {
  title: string
  url: string
}
type I18nProviderComponent = React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}>

let ArticleShare: React.FC<ArticleShareProps>
let I18nProvider: I18nProviderComponent
before(async () => {
  ArticleShare = (await import('./ArticleShare'))
    .default as unknown as React.FC<ArticleShareProps>
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as I18nProviderComponent
})

const TITLE = "テスト記事 & Next.js の 'まとめ'"
const URL_OF_ARTICLE = 'https://furugen-island.com/my_site/blog/test_post'

// renderToStaticMarkup は useEffect を実行しないため、ロケールは initialLocale のまま固定される
const render = (locale: Locale = 'ja'): string =>
  renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <ArticleShare title={TITLE} url={URL_OF_ARTICLE} />
    </I18nProvider>,
  )

const decodeAttribute = (value: string): string =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

const escapeRegExp = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const anchorsOf = (html: string): string[] => html.match(/<a\b[^>]*>/g) ?? []

const attributeOf = (tag: string, name: string): string | undefined => {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`))
  return match ? decodeAttribute(match[1]) : undefined
}

// --- 見出しと締めの一言 ---

for (const locale of ['ja', 'en'] as const) {
  test(`ArticleShare: ${locale} の見出しを h2 で描画する`, () => {
    // Given
    const heading = translations[locale].blog.share.heading
    // When
    const html = render(locale)
    // Then
    assert.match(html, new RegExp(`<h2[^>]*>${escapeRegExp(heading)}</h2>`))
  })

  test(`ArticleShare: ${locale} の締めの一言を p で描画する`, () => {
    // Given
    const message = translations[locale].blog.share.message
    // When
    const html = render(locale)
    // Then
    assert.match(html, new RegExp(`<p[^>]*>${escapeRegExp(message)}</p>`))
  })

  test(`ArticleShare: ${locale} の X・はてブ・リンクコピーの文言を出す`, () => {
    // Given
    const share = translations[locale].blog.share
    // When
    const html = decodeAttribute(render(locale))
    // Then: 本文か aria-label のどちらかに出ていればよい
    assert.ok(html.includes(share.x), `${share.x} を出す`)
    assert.ok(html.includes(share.hatena), `${share.hatena} を出す`)
    assert.ok(html.includes(share.copyLink), `${share.copyLink} を出す`)
  })

  test(`ArticleShare: ${locale} の初期表示では「コピーしました」を出さない`, () => {
    // Given
    const copied = translations[locale].blog.share.copied
    // When
    const html = decodeAttribute(render(locale))
    // Then
    assert.ok(!html.includes(copied), `${copied} はコピーした後だけ出す`)
  })
}

test('ArticleShare: section を見出しの id で名付ける（aria-labelledby）', () => {
  // Given/When
  const html = render()
  const labelledBy = html.match(/<section[^>]*\saria-labelledby="([^"]+)"/)
  const headingId = html.match(/<h2[^>]*\sid="([^"]+)"/)
  // Then
  assert.ok(labelledBy, '<section aria-labelledby> を持つ')
  assert.ok(headingId, '<h2 id> を持つ')
  assert.equal(labelledBy![1], headingId![1])
})

test('ArticleShare: 見出し → 締めの一言 → 共有ボタンの順に並べる', () => {
  // Given
  const html = render()
  // When
  const headingAt = html.indexOf('<h2')
  const messageAt = html.indexOf(translations.ja.blog.share.message)
  const firstAnchorAt = html.indexOf('<a')
  const buttonAt = html.indexOf('<button')
  // Then
  assert.ok(headingAt >= 0 && messageAt > headingAt, '見出しの後に一言')
  assert.ok(firstAnchorAt > messageAt, '一言の後に共有リンク')
  assert.ok(buttonAt > messageAt, '一言の後にコピーボタン')
})

// --- 共有リンク ---

test('ArticleShare: X とはてブの共有リンクを buildShareLinks の URL で描く', () => {
  // Given
  const expected = buildShareLinks({ title: TITLE, url: URL_OF_ARTICLE })
  // When
  const hrefs = anchorsOf(render()).map((tag) => attributeOf(tag, 'href'))
  // Then: 2 つだけ、X → はてブの順
  assert.deepEqual(hrefs, [expected.x, expected.hatena])
})

test('ArticleShare: 外部リンクは target="_blank" rel="noopener noreferrer" で開く', () => {
  // Given/When
  const anchors = anchorsOf(render())
  // Then
  assert.equal(anchors.length, 2, 'X とはてブの 2 つ')
  for (const anchor of anchors) {
    assert.equal(attributeOf(anchor, 'target'), '_blank', anchor)
    assert.equal(attributeOf(anchor, 'rel'), 'noopener noreferrer', anchor)
  }
})

test('ArticleShare: リンクをコピーするボタンを 1 つ描く', () => {
  // Given/When
  const buttons = render().match(/<button\b/g) ?? []
  // Then
  assert.equal(buttons.length, 1)
})

test('ArticleShare: タイトルを HTML として埋め込まない', () => {
  // Given: タグを含むタイトル
  const html = renderToStaticMarkup(
    <I18nProvider initialLocale="ja">
      <ArticleShare title="<img src=x onerror=alert(1)>" url={URL_OF_ARTICLE} />
    </I18nProvider>,
  )
  // Then
  assert.ok(!html.includes('<img'), '生の <img> を出さない')
})

// --- 見た目 ---

test('ArticleShare: ul / li を使わない（.articleContent ul の style が当たるため）', () => {
  // Given/When
  const html = render()
  // Then
  assert.ok(!/<ul\b/.test(html), '<ul> を含まない')
  assert.ok(!/<li\b/.test(html), '<li> を含まない')
})

test('ArticleShare: ダークモードの装飾（dark:）を持つ', () => {
  // Given/When/Then
  assert.match(render(), /class="[^"]*\bdark:/)
})

// --- ソースの静的検査（描画では確かめられない契約） ---

const readSource = (): string =>
  readFileSync(new URL('./ArticleShare.tsx', import.meta.url), 'utf8')

test("ArticleShare: useI18n を使うので 'use client' を付ける", () => {
  // Given/When/Then: サーバーコンポーネントの ArticleContent から使うため、先頭で宣言する
  assert.match(readSource(), /^\s*['"]use client['"]/)
})

test('ArticleShare: 共有 URL は buildShareLinks に任せ、ここで組み立てない', () => {
  // Given
  const source = readSource()
  // Then
  assert.ok(source.includes('buildShareLinks'), 'buildShareLinks を使う')
  assert.ok(!source.includes('x.com/intent'), 'X の URL を直書きしない')
  assert.ok(!source.includes('b.hatena.ne.jp'), 'はてブの URL を直書きしない')
})

test('ArticleShare: 記事 URL を自分で組み立てない（props の url を使う）', () => {
  // Given
  const source = readSource()
  // Then
  assert.ok(!source.includes('SITE_URL'), 'SITE_URL を使わない')
  assert.ok(!source.includes('window.location'), 'window.location を使わない')
})
