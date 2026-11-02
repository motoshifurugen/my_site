// ブログ一覧の検索欄（molecule PostSearchBox / Issue #7 / TDD 先行）の描画契約を固定する単体テスト。
//
// PostSearchBox は { value, onChange } を受け取る制御された <input type="search">。
//   - value をそのまま input の value に出す
//   - <label> の文言は t.blog.search.label、placeholder は t.blog.search.placeholder（ja / en）
//   - label と input を結び付ける（for/id か、label の中に input を置く）
//   - 入力された文字列（event.target.value）を onChange に渡す。描画では確かめられないので
//     ソースの静的検査で確かめる
//   - 'use client' を付け、自分で fetch しない
//
// RelatedArticles.test.tsx と同じく I18nProvider でラップし、.css・next/navigation を
// resolve フックでモックへ張り替える。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は PostSearchBox / t.blog.search が無いため RED、実装後に GREEN。

import type { Locale } from '@/i18n/types'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { translations } from '../../../i18n/translations'

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
;(globalThis as Record<string, unknown>).React = React

type PostSearchBoxComponent = React.FC<{
  value: string
  onChange: (value: string) => void
}>
type I18nProviderComponent = React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}>

let PostSearchBox: PostSearchBoxComponent
let I18nProvider: I18nProviderComponent
before(async () => {
  PostSearchBox = (await import('./PostSearchBox'))
    .default as unknown as PostSearchBoxComponent
  I18nProvider = (await import('../../../i18n/context'))
    .I18nProvider as unknown as I18nProviderComponent
})

const noop = (): void => {}

// renderToStaticMarkup は useEffect を実行しないため、ロケールは initialLocale のまま固定される
const render = (value: string, locale: Locale = 'ja'): string =>
  renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <PostSearchBox value={value} onChange={noop} />
    </I18nProvider>,
  )

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const inputTagOf = (html: string): string => {
  const inputs = html.match(/<input\b[^>]*>/g) ?? []
  assert.equal(inputs.length, 1, 'input を 1 つだけ描画する')
  return inputs[0]
}

const attributeOf = (tag: string, name: string): string | undefined =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]

const textOf = (html: string): string =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

for (const locale of ['ja', 'en'] as const) {
  test(`PostSearchBox: label に t.blog.search.label を出す（${locale}）`, () => {
    // Given
    const label = translations[locale].blog.search.label
    // When
    const html = render('', locale)
    // Then
    assert.ok(label.length > 0, 'label の翻訳が空でない')
    const labelMatch = html.match(/<label\b[^>]*>([\s\S]*?)<\/label>/)
    assert.ok(labelMatch, '<label> を描画する')
    assert.ok(
      textOf(labelMatch![1]).includes(label),
      `<label> に「${label}」を含む`,
    )
  })

  test(`PostSearchBox: placeholder に t.blog.search.placeholder を出す（${locale}）`, () => {
    // Given
    const placeholder = translations[locale].blog.search.placeholder
    // When
    const input = inputTagOf(render('', locale))
    // Then
    assert.ok(placeholder.length > 0, 'placeholder の翻訳が空でない')
    assert.equal(attributeOf(input, 'placeholder'), escapeHtml(placeholder))
  })
}

test('PostSearchBox: type="search" の input を描画する', () => {
  // Given/When
  const input = inputTagOf(render(''))
  // Then
  assert.equal(attributeOf(input, 'type'), 'search')
})

test('PostSearchBox: value をそのまま input の value に出す（制御されたコンポーネント）', () => {
  // Given/When
  const input = inputTagOf(render('React フック'))
  // Then
  assert.equal(attributeOf(input, 'value'), 'React フック')
})

test('PostSearchBox: value が空なら空の value を出す', () => {
  // Given/When
  const input = inputTagOf(render(''))
  // Then
  assert.equal(attributeOf(input, 'value'), '')
})

test('PostSearchBox: label と input を結び付ける', () => {
  // Given/When
  const html = render('')
  const input = inputTagOf(html)
  // Then: for/id で結ぶか、label の中に input を置く
  const inputId = attributeOf(input, 'id')
  const labelFor = html.match(/<label\b[^>]*\sfor="([^"]*)"/)?.[1]
  const isNested = /<label\b[^>]*>[\s\S]*<input\b[\s\S]*<\/label>/.test(html)
  assert.ok(
    (inputId !== undefined && inputId === labelFor) || isNested,
    'label の for と input の id が一致するか、label が input を囲む',
  )
})

// --- ソースの静的検査（描画では確かめられない契約） ---

const readSource = (): string =>
  readFileSync(new URL('./PostSearchBox.tsx', import.meta.url), 'utf8')

test("PostSearchBox: useI18n を使うので 'use client' を付ける", () => {
  assert.match(readSource(), /^\s*['"]use client['"]/)
})

test('PostSearchBox: 入力された文字列（event.target.value）を onChange に渡す', () => {
  // Given: 空白を除いたソース
  const source = readSource().replace(/\s+/g, '')
  // Then
  assert.ok(source.includes('onChange('), 'onChange を呼ぶ')
  assert.ok(source.includes('.target.value'), 'event.target.value を渡す')
})

test('PostSearchBox: 自分で fetch しない（検索は親が行う）', () => {
  assert.ok(!/\bfetch\s*\(/.test(readSource()), 'fetch( を含まない')
})
