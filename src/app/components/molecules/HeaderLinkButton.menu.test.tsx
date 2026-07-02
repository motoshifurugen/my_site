// ヘッダーリンク（src/app/components/molecules/HeaderLinkButton.tsx）の
// モバイルメニュー内での可視制御契約を固定する単体テスト（Issue #227 UI刷新 5 / TDD 先行）。
//
// #227 はモバイルメニューの項目を、mount 時のみ発火する 1s keyframe（animate-fade-in-up）
// ではなく、open をトリガーにした軽い CSS transition（stagger）で毎回再生する。
// そのため各項目のルート要素は:
//   - モバイルでは既定 opacity-0（閉時は不可視）
//   - open（nav の group-data-[open=true]）で opacity-100 へフェードイン
//   - 開く時だけ stagger する（transition-delay に --stagger-delay を使う）
//   - md 以上では常時可視（md:opacity-100）で #224 のデスクトップ挙動を回帰させない
//   - 1s keyframe はデスクトップ限定（md:animate-fade-in-up）にし、モバイルでは使わない
//   - prefers-reduced-motion では transition を無効化（motion-reduce:transition-none）
// を満たす className を持つ。本テストはこのクラス契約を固定する。
//
// renderToStaticMarkup は SSR 静的 HTML（jsdom 無し・状態トグル不可）のため、
// 開閉の実挙動ではなく className の存在で契約をロックする（#224 style.test と同方針）。
//
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

test('HeaderLinkButton: モバイルでは既定 opacity-0（閉時は不可視）', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: 閉じている間は隠れている
  assert.ok(html.includes('opacity-0'), 'opacity-0 を含む')
})

test('HeaderLinkButton: open トリガ（group-data-[open=true]）で opacity-100 へフェードインする', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: nav の open 状態に反応して表示される
  assert.ok(
    html.includes('group-data-[open=true]:opacity-100'),
    'group-data-[open=true]:opacity-100 を含む',
  )
})

test('HeaderLinkButton: 開く時だけ stagger する（transition-delay に --stagger-delay を使う）', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: 遅延は open variant にのみ付き、閉じる時は同時フェードアウトになる
  assert.ok(
    html.includes(
      'group-data-[open=true]:[transition-delay:var(--stagger-delay)]',
    ),
    'group-data-[open=true]:[transition-delay:var(--stagger-delay)] を含む',
  )
})

test('HeaderLinkButton: md 以上では常時可視（md:opacity-100）でデスクトップ挙動を回帰させない', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: デスクトップ水平ヘッダーは opacity-0 に隠れない
  assert.ok(html.includes('md:opacity-100'), 'md:opacity-100 を含む')
})

test('HeaderLinkButton: 1s keyframe はデスクトップ限定（md:animate-fade-in-up）にする', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: #224 のデスクトップ mount フェードは md 限定で温存する
  assert.ok(
    html.includes('md:animate-fade-in-up'),
    'md:animate-fade-in-up を含む',
  )
})

test('HeaderLinkButton: モバイルでは 1s keyframe（単独 animate-fade-in-up）を使わない', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: md: を伴わない単独の animate-fade-in-up は付かない（メニュー内では未使用）
  assert.doesNotMatch(
    html,
    /(^|[\s"'])animate-fade-in-up/,
    '単独の animate-fade-in-up を含まない（md: 限定のみ）',
  )
})

test('HeaderLinkButton: reduced-motion では transition を無効化する', () => {
  // Given/When: 描画する
  const html = render(1)
  // Then: prefers-reduced-motion で即表示（transition なし）
  assert.ok(
    html.includes('motion-reduce:transition-none'),
    'motion-reduce:transition-none を含む',
  )
})
