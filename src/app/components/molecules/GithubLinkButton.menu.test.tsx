// GitHub リンクボタン（src/app/components/molecules/GithubLinkButton.tsx）の
// モバイルメニュー内での可視制御契約を固定する単体テスト（Issue #227 UI刷新 5 / TDD 先行）。
//
// #227 はメニュー項目を open トリガの CSS transition（stagger）で毎回再生する。
// ヘッダー最後尾の GithubLinkButton も他項目と同じ可視契約を持つ:
//   - モバイル既定 opacity-0 / open で opacity-100
//   - 開く時だけ stagger（transition-delay に --stagger-delay）
//   - md:opacity-100（デスクトップ回帰防止）
//   - md:animate-fade-in-up（1s keyframe は md 限定）／モバイルでは単独 keyframe 未使用
//   - motion-reduce:transition-none（reduced-motion で即表示）
// 加えて Repository ラベルなど既存の表示内容は変えない。本テストはこれらを固定する。
//
// GithubLinkButton は next/link と FontAwesome に依存する。next/link は素の <a> へ
// 差し替える（FontAwesome はモック不要）。
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

type GithubLinkButtonComponent = React.FC<{ index: number }>

let GithubLinkButton: GithubLinkButtonComponent
before(async () => {
  GithubLinkButton = (await import('./GithubLinkButton'))
    .default as unknown as GithubLinkButtonComponent
})

const render = (index: number): string =>
  renderToStaticMarkup(<GithubLinkButton index={index} />)

test('GithubLinkButton: モバイルでは既定 opacity-0（閉時は不可視）', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: 閉じている間は隠れている
  assert.ok(html.includes('opacity-0'), 'opacity-0 を含む')
})

test('GithubLinkButton: open トリガで opacity-100 へフェードインする', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: nav の open 状態に反応して表示される
  assert.ok(
    html.includes('group-data-[open=true]:opacity-100'),
    'group-data-[open=true]:opacity-100 を含む',
  )
})

test('GithubLinkButton: 開く時だけ stagger する（transition-delay に --stagger-delay）', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: 遅延は open variant にのみ付く
  assert.ok(
    html.includes(
      'group-data-[open=true]:[transition-delay:var(--stagger-delay)]',
    ),
    'group-data-[open=true]:[transition-delay:var(--stagger-delay)] を含む',
  )
})

test('GithubLinkButton: md 以上では常時可視（md:opacity-100）', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: デスクトップでは隠れない
  assert.ok(html.includes('md:opacity-100'), 'md:opacity-100 を含む')
})

test('GithubLinkButton: 1s keyframe はデスクトップ限定（md:animate-fade-in-up）', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: mount フェードは md 限定で温存する
  assert.ok(
    html.includes('md:animate-fade-in-up'),
    'md:animate-fade-in-up を含む',
  )
})

test('GithubLinkButton: モバイルでは単独 animate-fade-in-up を使わない', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: md: を伴わない単独の keyframe クラスは付かない
  assert.doesNotMatch(
    html,
    /(^|[\s"'])animate-fade-in-up/,
    '単独の animate-fade-in-up を含まない（md: 限定のみ）',
  )
})

test('GithubLinkButton: reduced-motion では transition を無効化する', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: prefers-reduced-motion で即表示
  assert.ok(
    html.includes('motion-reduce:transition-none'),
    'motion-reduce:transition-none を含む',
  )
})

test('GithubLinkButton: Repository ラベルは維持する', () => {
  // Given/When: 描画する
  const html = render(5)
  // Then: 既存の表示内容は変えない
  assert.ok(html.includes('Repository'), 'Repository を含む')
})
