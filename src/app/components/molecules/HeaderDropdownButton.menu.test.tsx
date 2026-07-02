// ヘッダードロップダウン（src/app/components/molecules/HeaderDropdownButton.tsx）の
// モバイルメニュー内での可視制御契約を固定する単体テスト（Issue #227 UI刷新 5 / TDD 先行）。
//
// #227 は各メニュー項目を open トリガの CSS transition（stagger）で毎回再生する。
// ドロップダウンのラッパ <div>（stagger の起点）も HeaderLinkButton と同じ可視契約を持つ:
//   - モバイル既定 opacity-0 / open で opacity-100
//   - 開く時だけ stagger（transition-delay に --stagger-delay）
//   - md:opacity-100（デスクトップ回帰防止）
//   - md:animate-fade-in-up（1s keyframe は md 限定）／モバイルでは単独 keyframe 未使用
//   - motion-reduce:transition-none（reduced-motion で即表示）
// 本テストはこのクラス契約を固定する。
//
// HeaderDropdownButton は next/link と FontAwesome に依存する。FontAwesome は SSR で
// SVG を描画するためモック不要。next/link は素の <a> へ差し替える。
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は該当クラスが無いため RED、実装後に GREEN を期待する。

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

test('HeaderDropdownButton: モバイルでは既定 opacity-0（閉時は不可視）', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: 閉じている間は隠れている
  assert.ok(html.includes('opacity-0'), 'opacity-0 を含む')
})

test('HeaderDropdownButton: open トリガで opacity-100 へフェードインする', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: nav の open 状態に反応して表示される
  assert.ok(
    html.includes('group-data-[open=true]:opacity-100'),
    'group-data-[open=true]:opacity-100 を含む',
  )
})

test('HeaderDropdownButton: 開く時だけ stagger する（transition-delay に --stagger-delay）', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: 遅延は open variant にのみ付く
  assert.ok(
    html.includes(
      'group-data-[open=true]:[transition-delay:var(--stagger-delay)]',
    ),
    'group-data-[open=true]:[transition-delay:var(--stagger-delay)] を含む',
  )
})

test('HeaderDropdownButton: md 以上では常時可視（md:opacity-100）', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: デスクトップでは隠れない
  assert.ok(html.includes('md:opacity-100'), 'md:opacity-100 を含む')
})

test('HeaderDropdownButton: 1s keyframe はデスクトップ限定（md:animate-fade-in-up）', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: mount フェードは md 限定で温存する
  assert.ok(
    html.includes('md:animate-fade-in-up'),
    'md:animate-fade-in-up を含む',
  )
})

test('HeaderDropdownButton: モバイルでは単独 animate-fade-in-up を使わない', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: md: を伴わない単独の keyframe クラスは付かない
  assert.doesNotMatch(
    html,
    /(^|[\s"'])animate-fade-in-up/,
    '単独の animate-fade-in-up を含まない（md: 限定のみ）',
  )
})

test('HeaderDropdownButton: reduced-motion では transition を無効化する', () => {
  // Given/When: 描画する
  const html = render(4)
  // Then: prefers-reduced-motion で即表示
  assert.ok(
    html.includes('motion-reduce:transition-none'),
    'motion-reduce:transition-none を含む',
  )
})
