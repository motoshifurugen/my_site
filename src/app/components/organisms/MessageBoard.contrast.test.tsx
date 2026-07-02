// MessageBoard notification チップのコントラスト修正契約を固定する単体テスト
// （Issue #233 UI刷新 9 / TDD 先行）。
//
// notification チップは半透明 bg-orange/10 text-orange のため、ライトモード・空色背景
// （sky-mobile）＋ bg-white/15 ラッパーの二重透過で文字コントラストが約 1.1:1 に潰れていた。
// 修正は blogUpdate（teal バッジ）と同型の「不透明淡色地＋濃色文字」へ:
//   ライト: bg-orange-50 text-orange-800
//   ダーク: dark:bg-night-orange/20 dark:text-night-orange（約 5.1:1 で AA 合格・維持）
// あわせて日付/バッジの arbitrary 値（min-w-[80px] / min-w-[120px]）を整理する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は bg-orange/10 text-orange と min-w-[...] のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nProvider } from '../../../i18n/context'
import { translations } from '../../../i18n/translations'
import MessageBoard from './MessageBoard'
;(globalThis as Record<string, unknown>).React = React

function renderBoard(locale: 'ja' | 'en'): string {
  return renderToStaticMarkup(
    <I18nProvider initialLocale={locale}>
      <MessageBoard />
    </I18nProvider>,
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// カテゴリ名を内包するバッジ <span> の class 属性を取り出す。
function badgeClassForCategory(html: string, categoryText: string): string {
  const match = html.match(
    new RegExp(
      '<span class="([^"]*)"[^>]*>' + escapeRegExp(categoryText) + '</span>',
    ),
  )
  assert.ok(match, `カテゴリ「${categoryText}」のバッジ span が存在する`)
  return match![1]
}

function notificationBadge(html: string): string {
  return badgeClassForCategory(
    html,
    translations.ja.announcements.categories.notification,
  )
}

test('notification: ライト地を不透明淡色 bg-orange-50 で塗る', () => {
  // Given/When: お知らせ欄を描画する
  const badge = notificationBadge(renderBoard('ja'))
  // Then: 空色背景が透けない不透明淡色地になっている
  assert.match(badge, /\bbg-orange-50\b/, 'bg-orange-50 を含む')
})

test('notification: 文字を濃色 text-orange-800 にする', () => {
  // Given/When: お知らせ欄を描画する
  const badge = notificationBadge(renderBoard('ja'))
  // Then: 淡地に対して十分濃い文字色になっている
  assert.match(badge, /\btext-orange-800\b/, 'text-orange-800 を含む')
})

test('notification: 半透明ライト地 bg-orange/xx（根本原因）を残さない', () => {
  // Given/When: お知らせ欄を描画する
  const badge = notificationBadge(renderBoard('ja'))
  // Then: 空色が透ける半透明ライト地（bg-orange/10 等）が消えている。
  //       ダークの bg-night-orange/20 は "bg-orange/" に一致しないため影響しない。
  assert.ok(!/bg-orange\/\d/.test(badge), 'bg-orange/xx を含まない')
})

test('notification: ダークモード配色（night-orange）を維持する', () => {
  // Given/When: お知らせ欄を描画する
  const badge = notificationBadge(renderBoard('ja'))
  // Then: AA 合格済みのダーク配色は変更しない
  assert.match(
    badge,
    /dark:bg-night-orange\/20/,
    'dark:bg-night-orange/20 を維持',
  )
  assert.match(
    badge,
    /dark:text-night-orange\b/,
    'dark:text-night-orange を維持',
  )
})

test('notification: バッジは丸ピル型（rounded-full）を維持する', () => {
  // Given/When: お知らせ欄を描画する
  const badge = notificationBadge(renderBoard('ja'))
  // Then: 配色変更でバッジ形状（#224 で導入）は壊さない
  assert.match(badge, /\brounded-full\b/, 'rounded-full を維持')
})

test('notification: blogUpdate（teal バッジ）は変更しない（リグレッション防止）', () => {
  // Given/When: お知らせ欄を描画する
  const badge = badgeClassForCategory(
    renderBoard('ja'),
    translations.ja.announcements.categories.blogUpdate,
  )
  // Then: teal 側は本 Issue の対象外。既存の淡色地＋濃色文字を維持する
  assert.match(badge, /\bbg-teal-50\b/, 'bg-teal-50 を維持')
  assert.match(badge, /\btext-teal-700\b/, 'text-teal-700 を維持')
})

test('MessageBoard: 日付・バッジの arbitrary min-w（min-w-[...]）を撤去する', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: min-w-[80px] / min-w-[120px] の arbitrary 値が消えている
  assert.ok(!/min-w-\[/.test(html), 'min-w-[...] を含まない')
})

test('MessageBoard: 日付列は spacing scale の固定幅 min-w-20 を保つ', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 日付の桁揃え用固定幅（80px=min-w-20）は scale トークンで維持する
  assert.match(html, /\bmin-w-20\b/, 'min-w-20 を含む')
})
