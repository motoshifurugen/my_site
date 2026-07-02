// ヘッダーリンク（src/app/components/molecules/HeaderLinkButton.tsx）の
// stagger 表示契約を固定する単体テスト（Issue #224 UI刷新 2/3 / TDD 先行）。
//
// #224 はヘッダーの各ボタンが同時に animate-fade-in-up で発火していたのを、
// 既に配線済みの index prop を使って左から順に段階表示（stagger）へ変える。
// 各ボタンは style={{ animationDelay: `${index * 80}ms`, animationFillMode:
// 'backwards' }} を持ち、遅延中は fadeInUp の 0% 状態を保持する
// （fill-mode 未指定だと遅延中に一瞬フル表示される）。
// 本テストはこの index → animation-delay の対応と fill-mode を固定する。
//
// HeaderLinkButton は next/link に依存するため、href/className/style を素の <a> へ
// 反映するモックへ resolve フックで張り替える（yomoyo/page.test.tsx と同じ無 import パターン）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は animation-delay が無いため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// next/link を href/className/style/子要素のみ反映する素の <a> へ差し替える。
// data: URL モジュールは bare specifier 'react' を解決できないため、
// テストが設定する globalThis.React（classic JSX runtime 用）を参照する。
const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,style:props.style,target:props.target,rel:props.rel},props.children)}",
  )

const resolveHook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css')) {
    return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  }
  if (specifier === 'next/link') {
    return { url: ${JSON.stringify(linkMock)}, shortCircuit: true }
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

type HeaderLinkButtonComponent = React.FC<{
  href: string
  text: string
  index: number
}>

let HeaderLinkButton: HeaderLinkButtonComponent
before(async () => {
  HeaderLinkButton = (await import('./HeaderLinkButton'))
    .default as unknown as HeaderLinkButtonComponent
})

const render = (index: number): string =>
  renderToStaticMarkup(
    <HeaderLinkButton href="/blog" text="ブログ" index={index} />,
  )

test('HeaderLinkButton: index に応じた animation-delay を出力する', () => {
  // Given: リストの 3 番目（index=2）に配置される
  // When: 描画する
  const html = render(2)
  // Then: 左から順に出現するよう index * 80ms の遅延が付く
  assert.match(html, /animation-delay:160ms/, 'index=2 → 160ms')
})

test('HeaderLinkButton: 先頭（index=0）は遅延なし（0ms）で出現する', () => {
  // Given: リスト先頭
  // When: 描画する
  const html = render(0)
  // Then: 先頭は遅延ゼロ
  assert.match(html, /animation-delay:0ms/, 'index=0 → 0ms')
})

test('HeaderLinkButton: 遅延中に一瞬フル表示しないよう fill-mode を backwards にする', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: animation-fill-mode: backwards で遅延中も 0% 状態を保つ
  assert.match(
    html,
    /animation-fill-mode:backwards/,
    'animation-fill-mode:backwards を含む',
  )
})

test('HeaderLinkButton: フェードイン演出（animate-fade-in-up）は維持する', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: 既存のフェードインアニメーションは残す
  assert.ok(html.includes('animate-fade-in-up'), 'animate-fade-in-up を含む')
})

test('HeaderLinkButton: reduced-motion では stagger アニメを無効化する', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: prefers-reduced-motion を尊重し motion-reduce でアニメを止める
  assert.ok(
    html.includes('motion-reduce:animate-none'),
    'motion-reduce:animate-none を含む',
  )
})
