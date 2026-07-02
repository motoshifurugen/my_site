// GitHub リンクボタン（src/app/components/molecules/GithubLinkButton.tsx）の
// index 配線と stagger 表示契約を固定する単体テスト（Issue #224 UI刷新 2/3 / TDD 先行）。
//
// #224 では GithubLinkButton にも index prop を新設し、ヘッダー最後尾として
// links.length + 1 相当の index を受け取り、index に応じた animation-delay と
// fill-mode: backwards で他ボタンと揃った段階表示にする。現状は index prop が無く
// 遅延なしで発火するため、本テストは新設 prop の契約と遅延出力を固定する。
//
// GithubLinkButton は next/link と FontAwesome に依存する。next/link は
// href/className/style を反映する素の <a> へ差し替える（FontAwesome はモック不要）。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は index prop 未対応で animation-delay が無いため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

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

type GithubLinkButtonComponent = React.FC<{ index: number }>

let GithubLinkButton: GithubLinkButtonComponent
before(async () => {
  GithubLinkButton = (await import('./GithubLinkButton'))
    .default as unknown as GithubLinkButtonComponent
})

const render = (index: number): string =>
  renderToStaticMarkup(<GithubLinkButton index={index} />)

test('GithubLinkButton: index に応じた animation-delay を出力する', () => {
  // Given: ヘッダー最後尾（links.length + 1 = 5）に配置される
  // When: 描画する
  const html = render(5)
  // Then: 他ボタンと揃うよう index * 80ms の遅延が付く
  assert.match(html, /animation-delay:400ms/, 'index=5 → 400ms')
})

test('GithubLinkButton: 遅延中に一瞬フル表示しないよう fill-mode を backwards にする', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: animation-fill-mode: backwards
  assert.match(
    html,
    /animation-fill-mode:backwards/,
    'animation-fill-mode:backwards を含む',
  )
})

test('GithubLinkButton: フェードイン演出（animate-fade-in-up）は維持する', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: 既存のフェードインは残す
  assert.ok(html.includes('animate-fade-in-up'), 'animate-fade-in-up を含む')
})

test('GithubLinkButton: Repository ラベルは維持する', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: 既存の表示内容は変えない
  assert.ok(html.includes('Repository'), 'Repository を含む')
})

test('GithubLinkButton: reduced-motion では stagger アニメを無効化する', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: prefers-reduced-motion を尊重し motion-reduce でアニメを止める
  assert.ok(
    html.includes('motion-reduce:animate-none'),
    'motion-reduce:animate-none を含む',
  )
})
