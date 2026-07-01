// ページフッター（components/PageFooter.tsx）の表示契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 現行 page.tsx:1050-1094 の footer（飛行機演出 + 締め文 + SNS リンク）を PageFooter へ抽出する。
// SNS リンクの href / rel / target と締め文は不変であるため、それらを固定する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は components/PageFooter.tsx が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

let PageFooter: React.FC
before(async () => {
  PageFooter = (await import('./PageFooter')).default as unknown as React.FC
})

const render = () => renderToStaticMarkup(<PageFooter />)

test('PageFooter: 例外なく描画される', () => {
  // Given/When/Then: SSR で throw しない
  assert.doesNotThrow(() => render())
})

test('PageFooter: 締めの見出し "See you again." を表示する', () => {
  // Given/When: フッターを描画
  // Then: 現行 page.tsx:1070-1072 の文言を維持
  assert.ok(render().includes('See you again.'))
})

test('PageFooter: 締め文 "Wishing you beautiful days ahead." を表示する', () => {
  // Given/When/Then: page.tsx:1073-1075 の文言を維持
  assert.ok(render().includes('Wishing you beautiful days ahead.'))
})

test('PageFooter: Instagram への外部リンク href を維持する', () => {
  // Given/When: フッターを描画
  const html = render()
  // Then: 現行 href（page.tsx:1078）を維持
  assert.ok(html.includes('href="https://www.instagram.com/motoshi_cocoa"'))
})

test('PageFooter: X(Twitter) への外部リンク href を維持する', () => {
  // Given/When: フッターを描画
  const html = render()
  // Then: 現行 href（page.tsx:1086）を維持
  assert.ok(html.includes('href="https://x.com/cocoahearts21"'))
})

test('PageFooter: 外部リンクに rel="noopener noreferrer" と target="_blank" を付与する', () => {
  // Given/When: フッターを描画
  const html = render()
  // Then: 新規タブ + セキュリティ属性を維持（page.tsx:1079-1080, 1087-1088）
  assert.ok(html.includes('rel="noopener noreferrer"'))
  assert.ok(html.includes('target="_blank"'))
})
