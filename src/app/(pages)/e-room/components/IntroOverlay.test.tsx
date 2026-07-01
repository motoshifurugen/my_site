// イントロオーバーレイ（components/IntroOverlay.tsx）の表示契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 現行 page.tsx:245-308 の IntroOverlay を抽出する。props は { onComplete: () => void }。
// カウンタ（"Day N"）・JAPAN/PH ラベル・謝辞文・飛行機アイコンを描画することを固定する。
// setInterval/setTimeout（useEffect 内）は renderToStaticMarkup では走らないため、
// カウンタは初期値 0（"Day 0"）で描画される。IntroOverlay は初回描画されるため
// dynamic 化されない（初期 JS に含める設計）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は components/IntroOverlay.tsx が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

type IntroOverlayProps = { onComplete: () => void }

let IntroOverlay: React.FC<IntroOverlayProps>
before(async () => {
  IntroOverlay = (await import('./IntroOverlay'))
    .default as unknown as React.FC<IntroOverlayProps>
})

const render = () =>
  renderToStaticMarkup(<IntroOverlay onComplete={() => {}} />)

test('IntroOverlay: 例外なく描画される', () => {
  // Given/When/Then: SSR で throw しない（タイマーは走らない）
  assert.doesNotThrow(() => render())
})

test('IntroOverlay: 出発地/目的地ラベル JAPAN と PH を表示する', () => {
  // Given/When: 描画
  const html = render()
  // Then: page.tsx:282-283 のラベルを維持
  assert.ok(html.includes('JAPAN'))
  assert.ok(html.includes('PH'))
})

test('IntroOverlay: カウンタは初期値 "Day 0" を表示する', () => {
  // Given/When: 初期描画（useEffect のカウントアップは SSR では走らない）
  const html = render()
  // Then: "Day 0"（count 初期値 0）
  assert.ok(html.includes('Day 0'))
})

test('IntroOverlay: 謝辞文 "Thank You, the Philippines" を表示する', () => {
  // Given/When/Then: page.tsx:304 の文言を維持
  assert.ok(render().includes('Thank You, the Philippines'))
})

test('IntroOverlay: 飛行機アイコン（svg）を描画する', () => {
  // Given/When: 描画
  // Then: lucide Plane アイコンが svg として出力される
  assert.ok(render().includes('<svg'))
})
