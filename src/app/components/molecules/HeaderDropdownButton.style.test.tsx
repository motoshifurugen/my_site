// ヘッダードロップダウン（src/app/components/molecules/HeaderDropdownButton.tsx）の
// stagger 表示契約を固定する単体テスト（Issue #224 UI刷新 2/3 / TDD 先行）。
//
// #224 はヘッダー各ボタンを index に応じた段階表示（stagger）へ変える。
// ドロップダウンはヘッダーの links の後に来るため、その index に応じた
// animation-delay と fill-mode: backwards を持つ。本テストはその契約を固定する。
//
// HeaderDropdownButton は next/link と FontAwesome に依存する。FontAwesome は SSR で
// SVG を描画するためモック不要。next/link は href/className/style を反映する素の <a> へ
// 差し替える。ルート要素（stagger の style を持つ <div>）自体は Link ではない。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は animation-delay が無いため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const linkMock =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default function Link(props){return React.createElement('a',{href:props.href,className:props.className,style:props.style},props.children)}",
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

type HeaderDropdownButtonComponent = React.FC<{
  text: string
  subItems: { href: string; text: string }[]
  index: number
}>

let HeaderDropdownButton: HeaderDropdownButtonComponent
before(async () => {
  HeaderDropdownButton = (await import('./HeaderDropdownButton'))
    .default as unknown as HeaderDropdownButtonComponent
})

const render = (index: number): string =>
  renderToStaticMarkup(
    <HeaderDropdownButton
      text="遊び"
      subItems={[{ href: '/game', text: 'ゲーム' }]}
      index={index}
    />,
  )

test('HeaderDropdownButton: index に応じた animation-delay を出力する', () => {
  // Given: links(4件) の直後（index=4）に配置される
  // When: 描画する
  const html = render(4)
  // Then: index * 80ms の遅延が付く
  assert.match(html, /animation-delay:320ms/, 'index=4 → 320ms')
})

test('HeaderDropdownButton: 遅延中に一瞬フル表示しないよう fill-mode を backwards にする', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: animation-fill-mode: backwards
  assert.match(
    html,
    /animation-fill-mode:backwards/,
    'animation-fill-mode:backwards を含む',
  )
})

test('HeaderDropdownButton: フェードイン演出（animate-fade-in-up）は維持する', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: 既存のフェードインは残す
  assert.ok(html.includes('animate-fade-in-up'), 'animate-fade-in-up を含む')
})

test('HeaderDropdownButton: reduced-motion では stagger アニメを無効化する', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: prefers-reduced-motion を尊重し motion-reduce でアニメを止める
  assert.ok(
    html.includes('motion-reduce:animate-none'),
    'motion-reduce:animate-none を含む',
  )
})
