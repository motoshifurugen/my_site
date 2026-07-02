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

test('SubmitButton: 太字クラスを button に集約する', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: font-bold が（<p> ではなく）button 上に付与されている
  assert.ok(html.includes('font-bold'), 'font-bold を含む')
})

// ── Issue #241 UI刷新(11): 送信ボタンのトーンダウン（TDD 先行） ──
// 濃色塗り bg-teal(#0F8277)＋白文字を、#233 で確立したチップ体系
// 「不透明淡色地＋濃色文字」（Tags.tsx: bg-teal-50 text-teal-700）へ揃える。
// ダーク側の最終トークン（night-teal 系の淡い表現）は draft のコントラスト実測に
// 委ねられているため、ここでは特定トークンを固定せず「旧強塗りの撤去」と
// 「ダーク配色の存在」のみを契約化して過剰拘束を避ける。
// 実装前は bg-teal / text-main-white 等が残るため RED、実装後に GREEN を期待する。

test('SubmitButton: ライト地を不透明淡色 bg-teal-50 で塗る', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 静かなトーンに揃える #233 チップの淡地トークンを採用している
  assert.match(html, /\bbg-teal-50\b/, 'bg-teal-50 を含む')
})

test('SubmitButton: ライト文字を濃色 text-teal-700 にする', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 淡地に対し AA を満たす濃色文字（#0A5952）を採用している
  assert.match(html, /\btext-teal-700\b/, 'text-teal-700 を含む')
})

test('SubmitButton: 濃色 DEFAULT 塗り bg-teal（根本原因）を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 主張の強い濃色塗り bg-teal(#0F8277) を撤去する。
  //       bg-teal-50 / hover:bg-teal-100 等のスケール値には一致させない。
  assert.ok(!/bg-teal(?![-\w/])/.test(html), '単体の bg-teal を含まない')
})

test('SubmitButton: 白文字 text-main-white を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 濃色塗り前提の白文字は淡色地では成立しないため撤去する
  assert.ok(!html.includes('text-main-white'), 'text-main-white を含まない')
})

test('SubmitButton: 旧 hover 濃色化 hover:bg-teal-600 を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 濃色塗り時代の hover 深化は淡地トーンに合わないため撤去する
  assert.ok(!html.includes('hover:bg-teal-600'), 'hover:bg-teal-600 を含まない')
})

test('SubmitButton: ライトの淡地 hover は同系の淡色（hover:bg-teal-100）', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 淡地ボタンの hover は同系の一段濃い淡色で軽く反応する
  assert.match(html, /\bhover:bg-teal-100\b/, 'hover:bg-teal-100 を含む')
})

test('SubmitButton: 不透明濃塗りシャドウ shadow-card を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 浮遊感を強めるカードシャドウは静かなトーンに合わないため撤去する。
  //       hover:shadow-card-hover も同時に消える。
  assert.ok(!html.includes('shadow-card'), 'shadow-card を含まない')
})

test('SubmitButton: ダーク強塗り hover dark:hover:bg-teal-400 を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: ダークで浮く強い hover 塗りは撤去する（A/B いずれの回避策でも不採用）
  assert.ok(
    !html.includes('dark:hover:bg-teal-400'),
    'dark:hover:bg-teal-400 を含まない',
  )
})

test('SubmitButton: ダーク不透明 solid 塗り dark:bg-night-teal を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 不透明 solid の dark:bg-night-teal（旧強塗り）を撤去する。
  //       淡い表現 dark:bg-night-teal/10 等（スラッシュ付き）は許容する。
  assert.ok(
    !/dark:bg-night-teal(?![-\w/])/.test(html),
    '不透明 solid の dark:bg-night-teal を含まない',
  )
})

test('SubmitButton: ダークモード配色（night-teal 系の淡い表現）を持つ', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: ライト/ダーク一貫のため dark: 変種のスタイルが付与されている
  assert.match(html, /\bdark:/, 'dark: バリアントを含む')
})

// ── #241 リグレッション: ダークモード文字コントラスト AA（family_tag: dark-AA） ──
// night-gray(#4B4B5A) コンテナ上で dark:text-night-teal を night-teal 低不透明地に
// 載せると 2.31:1 で AA 未達（supervisor VAL-NEW-SubmitButton-L16-darkAA）。
// 明るい dark:text-teal-100 へ変更し base 5.74:1 / hover 5.17:1（実測）へ引き上げた。
// 再発防止のため AA 未達トークンの不在と AA 合格トークンの存在を契約化する。

test('SubmitButton: ダーク文字は AA 未達の text-night-teal を残さない', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: night-teal 低不透明地の上で 2.31:1（AA 未達）になる暗い文字色を撤去する
  assert.ok(
    !/dark:text-night-teal\b/.test(html),
    'dark:text-night-teal を含まない',
  )
})

test('SubmitButton: ダーク文字は AA 合格の明色 text-teal-100 にする', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: night-teal 低不透明地に対し 5.74:1（hover 5.17:1）で AA を満たす明色文字を採用する
  assert.match(html, /\bdark:text-teal-100\b/, 'dark:text-teal-100 を含む')
})

test('SubmitButton: 送信ボタンと分かるアフォーダンス（境界か淡地）を残す', () => {
  // Given/When: 送信ボタンを描画する
  const html = render()
  // Then: 境界（border）か淡い地色（bg-teal-50）の少なくとも一方でボタンと識別できる
  const hasBorder = /\bborder\b/.test(html)
  const hasLightFill = /\bbg-teal-50\b/.test(html)
  assert.ok(
    hasBorder || hasLightFill,
    'border か bg-teal-50 の少なくとも一方を含む',
  )
})
