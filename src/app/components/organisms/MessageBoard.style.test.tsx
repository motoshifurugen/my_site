// MessageBoard（お知らせ欄）の刷新後スタイル契約を固定する単体テスト
// （Issue #224 UI刷新 2/3 / TDD 先行）。
//
// #224 は「新着情報」表組み風の罫線リストを、罫線なし＋余白＋淡い hover 背景の
// 今風リストへ更新する。カテゴリバッジは角ばったグレー（bg-gray px-4 py-1）から
// rounded-full の淡色地＋濃色文字へ変え、blogUpdate=teal 系 / notification=orange 系で
// 色分けし、ダークモードにも対応する。日付は tabular-nums の小さめ二次色にする。
// 本テストはこれらの className 契約を静的マークアップ上で固定する。
//
// 既存の MessageBoard.test.tsx と同じく node 組み込み node:test と
// react-dom/server の renderToStaticMarkup、I18nProvider のみで構成する。
// MessageBoard は next/link を使わず素の <a> を描画するためリンクモックは不要。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は border-gray / bg-gray バッジのままのため RED、実装後に GREEN を期待する。

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
// 色分け（teal / orange）とバッジ形状（rounded-full）をカテゴリ単位で検証するため。
function badgeClassForCategory(html: string, categoryText: string): string {
  const match = html.match(
    new RegExp(
      '<span class="([^"]*)"[^>]*>' + escapeRegExp(categoryText) + '</span>',
    ),
  )
  assert.ok(match, `カテゴリ「${categoryText}」のバッジ span が存在する`)
  return match![1]
}

test('MessageBoard: 罫線区切り（border-gray）を廃止する', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 2000 年代風の罫線区切りに使われていた border-gray が残っていない
  assert.ok(!html.includes('border-gray'), 'border-gray を含まない')
})

test('MessageBoard: 行区切りを淡い hover 背景で表現する', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 罫線に代えて hover 時の背景変化で区切る
  assert.match(html, /hover:bg-/, 'hover:bg- を含む')
})

test('MessageBoard: カテゴリバッジを rounded-full にする', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 角ばったバッジ（旧 bg-gray px-4 py-1）ではなく丸ピル型になる
  const notification = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.notification,
  )
  const blogUpdate = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.blogUpdate,
  )
  assert.ok(
    notification.includes('rounded-full'),
    'notification が rounded-full',
  )
  assert.ok(blogUpdate.includes('rounded-full'), 'blogUpdate が rounded-full')
})

test('MessageBoard: 旧グレーバッジ（bg-gray）を残さない', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 淡色地バッジへ刷新され、角ばったグレー地は使われていない
  assert.ok(!html.includes('bg-gray'), 'bg-gray を含まない')
})

test('MessageBoard: blogUpdate バッジは teal 系の淡トーンにする', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: ブログ更新カテゴリは teal 系トークンで色分けされる
  const badge = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.blogUpdate,
  )
  assert.match(badge, /teal/, 'teal 系トークンを含む')
})

test('MessageBoard: notification バッジは orange 系の淡トーンにする', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: お知らせカテゴリは orange 系トークンで色分けされる
  const badge = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.notification,
  )
  assert.match(badge, /orange/, 'orange 系トークンを含む')
})

test('MessageBoard: カテゴリごとにバッジのクラスを変える（色分け）', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: blogUpdate と notification のバッジ className が異なる
  const notification = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.notification,
  )
  const blogUpdate = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.blogUpdate,
  )
  assert.notEqual(notification, blogUpdate, 'カテゴリ別に異なるバッジ配色')
})

test('MessageBoard: バッジはダークモード配色（dark:）に対応する', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 両カテゴリのバッジにダーク用 variant が付く（ダークで破綻させない）
  const notification = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.notification,
  )
  const blogUpdate = badgeClassForCategory(
    html,
    translations.ja.announcements.categories.blogUpdate,
  )
  assert.match(notification, /dark:/, 'notification に dark: variant')
  assert.match(blogUpdate, /dark:/, 'blogUpdate に dark: variant')
})

test('MessageBoard: 日付を tabular-nums で桁揃えする', () => {
  // Given/When: お知らせ欄を描画する
  const html = renderBoard('ja')
  // Then: 日付は等幅数字で小さめ二次色にする
  assert.match(html, /tabular-nums/, 'tabular-nums を含む')
})

test('MessageBoard: 既存のお知らせ本文・リンクは維持する', () => {
  // Given/When: お知らせ欄を描画する（機能・表示件数は不変）
  const html = renderBoard('ja')
  // Then: 刷新後もタイトルと link 付きお知らせの linkText を描画する
  assert.ok(
    html.includes(translations.ja.announcements.items['2025-04-22'].title),
    'お知らせタイトルを描画する',
  )
  assert.ok(
    html.includes(translations.ja.announcements.items['2025-04-22'].linkText),
    'link 付きお知らせの linkText を描画する',
  )
})
