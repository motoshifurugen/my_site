// e-room ページ（page.tsx）の合成・イントロゲート契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// リファクタリング後も page.tsx は default export の React コンポーネントであり、
// 初期状態 showIntro=true では IntroOverlay のみを描画する（主要コンテンツ＝チャート/
// ギャラリー/STATS はゲートされ初回描画されない）。この「イントロゲート」挙動は
// dynamic import（重い演出の遅延ロード, 要件#3）が自然に効く前提であり、リファクタ後も維持する。
//
// page.tsx は data/photoRows → photos.ts（実画像）や next/image を読むため、
// __testShims__/resolveAssets.mjs を register してから動的 import する。
// next/dynamic(ssr:false) の遅延コンポーネントは SSR では実体化されない（factory は呼ばれない）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 本テストは現行/リファクタ後いずれでもイントロ描画が成立することを固定する回帰ガード。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

register(
  new URL('./__testShims__/resolveAssets.mjs', import.meta.url).href,
  import.meta.url,
)

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

let ThankYouPage: React.FC
before(async () => {
  ThankYouPage = (await import('./page')).default as unknown as React.FC
})

const render = () => renderToStaticMarkup(<ThankYouPage />)

test('page: default export は React コンポーネント（関数）である', () => {
  // Given/When/Then: ページの default export が関数
  assert.equal(typeof ThankYouPage, 'function')
})

test('page: 初期描画で例外を投げない', () => {
  // Given/When/Then: showIntro=true の初期描画で throw しない
  assert.doesNotThrow(() => render())
})

test('page: 初期描画でイントロ（謝辞文）を表示する', () => {
  // Given/When: 初期描画
  const html = render()
  // Then: IntroOverlay の謝辞文が描画される
  assert.ok(html.includes('Thank You, the Philippines'))
})

test('page: 初期描画では主要コンテンツをゲートする（チャートは描画しない）', () => {
  // Given/When: showIntro=true の初期描画
  const html = render()
  // Then: イントロ後にのみ現れるチャート見出しは初回描画に含まれない
  //       （遅延ロードの前提となるゲート挙動を固定する）
  assert.ok(!html.includes('IELTS Score Progress'))
  assert.ok(!html.includes('Duolingo English Test Score Progress'))
})
