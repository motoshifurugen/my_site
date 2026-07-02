// SubmitButton の刷新（inset 擬似ボーダー撤去・塗りボタン化・タイポ緩和・
// パディング縮小・hover を色深化＋軽い浮き上がりに）の className 契約を固定する
// 単体テスト（Issue #225 UI刷新 3/3 / TDD 先行）。
//
// SubmitButton は React のみに依存し、CSS Module も next/* も import しないため、
// 追加の resolve フックは不要。classic JSX runtime のため React をグローバルに渡す。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は inset 影・uppercase tracking-widest・px-20/px-32 のままのため RED、
// 実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

let SubmitButton: React.FC<{ children: React.ReactNode }>
before(async () => {
  SubmitButton = (await import('./SubmitButton'))
    .default as unknown as React.FC<{ children: React.ReactNode }>
})

const render = (): string =>
  renderToStaticMarkup(<SubmitButton>送信する</SubmitButton>)

test('SubmitButton: inset 影による擬似ボーダーを撤去する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: inset 影の擬似ボーダー（shadow-[inset_0_0_0_...]）を含まない
  assert.ok(!html.includes('inset_0_0_0'), 'inset_0_0_0 を含まない')
})

test('SubmitButton: uppercase を撤去する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 英字を強制大文字化する uppercase を含まない
  assert.ok(!html.includes('uppercase'), 'uppercase を含まない')
})

test('SubmitButton: tracking-widest を緩和する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 過度な字間 tracking-widest は使わない
  assert.ok(!html.includes('tracking-widest'), 'tracking-widest を含まない')
})

test('SubmitButton: 字間は tracking-wide 程度に緩和する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: tracking-widest ではない tracking-wide が付与されている
  assert.match(html, /tracking-wide(?![a-z])/, 'tracking-wide を含む')
})

test('SubmitButton: 過大パディング px-20 を縮小する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: px-20 を含まない（px-10 前後へ縮小）
  assert.ok(!html.includes('px-20'), 'px-20 を含まない')
})

test('SubmitButton: 過大パディング md:px-32 を縮小する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: px-32 を含まない
  assert.ok(!html.includes('px-32'), 'px-32 を含まない')
})

test('SubmitButton: hover は全反転（hover:bg-main-black）にしない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 背景を黒へ全反転する hover:bg-main-black を含まない
  assert.ok(
    !html.includes('hover:bg-main-black'),
    'hover:bg-main-black を含まない',
  )
})

test('SubmitButton: hover で軽く浮き上がる（hover:-translate-y）', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: ホバー時に上方向へ移動する軽い浮き上がり演出がある
  assert.match(html, /hover:-translate-y-/, 'hover:-translate-y- を含む')
})

test('SubmitButton: 無用化した内側 <p> ラッパを持たない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 塗りボタン化で不要になった <p>（button 内の不正な入れ子）を残さない
  assert.ok(!html.includes('<p'), '<p> を含まない')
})

test('SubmitButton: 文字色・太字クラスを button に集約する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: font-bold と text-main-white が（<p> ではなく）button 上に付与されている
  assert.ok(html.includes('font-bold'), 'font-bold を含む')
  assert.ok(html.includes('text-main-white'), 'text-main-white を含む')
})
