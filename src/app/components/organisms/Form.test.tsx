import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nProvider } from '../../../i18n/context'
import Form from './Form'

// 一部のコンポーネントは React を import せず automatic JSX runtime を前提にしている。
// tsx は JSX を classic な React.createElement に変換するため、グローバルに React を渡す。
const globalScope = globalThis as Record<string, unknown>
globalScope.React = React

// useI18n は Provider を要求するので initialLocale を明示してSSR描画する。
function renderForm(locale: 'ja' | 'en'): string {
  return renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <Form />
    </I18nProvider>,
  )
}

test('Form: honeypot は name="wana" を使う', () => {
  // Given/When: Form を描画する
  const html = renderForm('ja')
  // Then: honeypot 用の name="wana" を持つ
  assert.match(html, /name="wana"/)
})

test('Form: 旧 honeypot 名 trap-column は残さない', () => {
  // Given/When: Form を描画する
  const html = renderForm('ja')
  // Then: 推測容易な旧名 trap-column は撤去されている
  assert.doesNotMatch(html, /trap-column/)
})

test('Form: honeypot は aria-hidden で支援技術から隠す', () => {
  // Given/When: Form を描画する
  const html = renderForm('ja')
  // Then: honeypot ラッパに aria-hidden="true" が付与されている
  assert.match(html, /aria-hidden="true"/)
})

test('Form: honeypot は autocomplete=off でブラウザ自動補完を抑止する', () => {
  // Given/When: Form を描画する
  const html = renderForm('ja')
  // Then: autocomplete="off" が出力される（React の autoComplete は小文字属性に変換される）
  assert.match(html, /autocomplete="off"/i)
})

test('Form: honeypot フィールドは hidden で視覚的に隠れている', () => {
  // Given/When: Form を描画する
  const html = renderForm('ja')
  // Then: 視覚的に非表示のラッパ内に honeypot がある（人間には見えずボットだけが埋める）
  assert.match(
    html,
    /class="hidden"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*class="hidden"/,
  )
})
