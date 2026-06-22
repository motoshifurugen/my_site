import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nProvider } from '../../../i18n/context'
import { translations } from '../../../i18n/translations'
import MessageBoard from './MessageBoard'

// 一部のコンポーネントは React を import せず automatic JSX runtime を前提にしている。
// tsx は JSX を classic な React.createElement に変換するため、グローバルに React を渡す。
const globalScope = globalThis as Record<string, unknown>
globalScope.React = React

// `as any` 撤廃後も MessageBoard が翻訳キーを正しく解決して描画できることを保証する統合テスト。
// MessageBoard + MessageData + translations + i18n context を横断する。
function renderBoard(locale: 'ja' | 'en'): string {
  return renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <MessageBoard />
    </I18nProvider>,
  )
}

test('MessageBoard: ja ロケールで announcement タイトルを描画する', () => {
  // Given/When: 日本語で描画する
  const html = renderBoard('ja')
  // Then: items から解決したタイトルが本文に含まれる
  assert.ok(
    html.includes(translations.ja.announcements.items['2025-09-27'].title),
  )
})

test('MessageBoard: en ロケールで announcement タイトルを描画する', () => {
  // Given/When: 英語で描画する
  const html = renderBoard('en')
  // Then: items から解決した英語タイトルが本文に含まれる
  assert.ok(
    html.includes(translations.en.announcements.items['2025-09-27'].title),
  )
})

test('MessageBoard: link を持つ announcement の linkText を描画する', () => {
  // Given/When: 日本語で描画する
  const html = renderBoard('ja')
  // Then: link 付きお知らせの linkText（短歌）がリンク表示される
  assert.ok(
    html.includes(translations.ja.announcements.items['2025-09-27'].linkText),
  )
})

test('MessageBoard: カテゴリ名を描画する', () => {
  // Given/When: 日本語で描画する
  const html = renderBoard('ja')
  // Then: categoryKey から解決したカテゴリ名が含まれる
  assert.ok(
    html.includes(translations.ja.announcements.categories.notification),
  )
})
