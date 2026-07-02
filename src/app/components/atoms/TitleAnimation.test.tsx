// ヒーロー演出（src/app/components/atoms/TitleAnimation.tsx）の刷新後の
// 表示契約を固定する単体テスト（Issue #224 UI刷新 2/3 / TDD 先行）。
//
// #224 は GSAP TextPlugin による 1 文字ずつのタイプライター描画をやめ、
// フェードイン（opacity + わずかな blur + 軽い上移動）へ差し替える。これに伴い
// タイトル文字「Furugen」「Island」は JSX で直接描画され、初期マークアップから
// 可視になる（＝ JS/アニメーションに依存せず即時表示できる）。これは
// prefers-reduced-motion: reduce 時に「即時表示」を満たす前提でもある。
// また縦書き "scroll" の下のテキスト「↓」は細い線のアイコン（faArrowDown）へ
// 置き換える。本テストはこれらの静的マークアップ契約を固定する。
//
// reduced-motion の実挙動（matchMedia による分岐）は useEffect 依存のランタイム
// 挙動で、renderToStaticMarkup は effect を実行しないため本テストの対象外。ここでは
// 「初期マークアップにタイトル文字が存在する」ことで、reduce/no-JS でも文字が
// 見える回帰不変条件を固定する（旧実装は空 div へ後から text を注入していた）。
//
// 既存の style テスト群と同じく node 組み込み node:test と
// react-dom/server の renderToStaticMarkup のみで構成する。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は TextPlugin による空 div＋テキスト「↓」のため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// CSS Module（もし import されても）を無害化する resolve フック。
const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
`
register(
  'data:text/javascript,' + encodeURIComponent(resolveHook),
  import.meta.url,
)

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

let TitleAnimation: React.FC
before(async () => {
  TitleAnimation = (await import('./TitleAnimation'))
    .default as unknown as React.FC
})

const render = (): string => renderToStaticMarkup(<TitleAnimation />)

test('TitleAnimation: 例外なく描画される', () => {
  // Given/When/Then: フェードイン化後も SSR 描画で throw しない
  assert.doesNotThrow(() => render())
})

test('TitleAnimation: タイトル文字を初期マークアップに描画する（Furugen）', () => {
  // Given/When: ヒーローを描画する
  const html = render()
  // Then: JSX 直接描画により「Furugen」が初期マークアップに含まれる
  //（旧実装は空 div へ後から注入するため初期マークアップには存在しなかった）
  assert.ok(html.includes('Furugen'), 'Furugen を含む')
})

test('TitleAnimation: タイトル文字を初期マークアップに描画する（Island）', () => {
  // Given/When: ヒーローを描画する
  const html = render()
  // Then: 2 行目「Island」も初期マークアップに含まれる
  assert.ok(html.includes('Island'), 'Island を含む')
})

test('TitleAnimation: 縦書き "scroll" ラベルは維持する', () => {
  // Given/When: ヒーローを描画する
  const html = render()
  // Then: 世界観を変えないため scroll ラベルは残す
  assert.ok(html.includes('scroll'), 'scroll を含む')
})

test('TitleAnimation: テキストの「↓」をやめアイコン（SVG）へ置き換える', () => {
  // Given/When: ヒーローを描画する
  const html = render()
  // Then: 生の矢印文字は使わず、細い線のアイコンへ置き換える
  assert.ok(!html.includes('↓'), 'テキストの ↓ を含まない')
})

test('TitleAnimation: 下向き矢印を faArrowDown アイコンで描画する', () => {
  // Given/When: ヒーローを描画する
  const html = render()
  // Then: FontAwesome の下矢印アイコン（arrow-down）が SVG として描画される
  assert.match(html, /data-icon="arrow-down"/, 'arrow-down アイコンを含む')
})

test('TitleAnimation: 初期マークアップにフェード開始状態（opacity:0）を焼き込まない', () => {
  // FOUC 対策（フェード開始状態を pre-paint で確定）は useLayoutEffect 側で行い、
  // JSX/インライン style に opacity:0 を焼き込まないことが不変条件。焼き込むと
  // no-JS / reduced-motion 時にタイトルが不可視になり回帰する。
  // Given/When: ヒーローを SSR 描画する（effect は実行されない）
  const html = render()
  // Then: 初期マークアップの style に opacity:0 が現れない（＝即時可視を保つ）
  assert.ok(!/opacity:\s*0/.test(html), '初期 style に opacity:0 を含まない')
})
