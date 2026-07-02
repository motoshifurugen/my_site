// TextArrowLinkButton の hover 反応を軽量化する className 契約を固定する単体テスト
// （Issue #225 UI刷新 3/3 / TDD 先行）。
//
// #225 は円枠矢印ボタンの hover 塗り反転（group-hover:bg-main-white 等）を撤去し、
// テキストに下線（group-hover:underline）＋矢印がわずかに右へ動く
// （group-hover:translate-x-）軽量な反応へ置き換える。
//
// TextArrowLinkButton は next.config.mjs と FontAwesome に依存するが、いずれも
// SSR 描画で問題なく解決される。CSS Module も next/navigation も import しないため
// 追加の resolve フックは不要。classic JSX runtime のため React をグローバルに渡す。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は塗り反転のままのため RED、実装後に GREEN を期待する。

import assert from 'node:assert/strict'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
;(globalThis as Record<string, unknown>).React = React

let TextArrowLinkButton: React.FC<{ text: string; href: string }>
before(async () => {
  TextArrowLinkButton = (await import('./TextArrowLinkButton'))
    .default as unknown as React.FC<{ text: string; href: string }>
})

const render = (): string =>
  renderToStaticMarkup(
    <TextArrowLinkButton text="もっと見る" href="/profile" />,
  )

test('TextArrowLinkButton: hover の塗り反転（group-hover:bg-main-white）を撤去する', () => {
  // Given/When: 矢印リンクボタンを描画する
  const html = render()
  // Then: 円枠を白で塗り潰す全反転 hover は含まない
  assert.ok(
    !html.includes('group-hover:bg-main-white'),
    'group-hover:bg-main-white を含まない',
  )
})

test('TextArrowLinkButton: hover でテキストに下線を付ける', () => {
  // Given/When: 矢印リンクボタンを描画する
  const html = render()
  // Then: ホバー時にテキストへ下線が付く
  assert.ok(
    html.includes('group-hover:underline'),
    'group-hover:underline を含む',
  )
})

test('TextArrowLinkButton: hover で矢印がわずかに右へ動く', () => {
  // Given/When: 矢印リンクボタンを描画する
  const html = render()
  // Then: ホバー時に矢印が右方向へ移動する
  assert.match(
    html,
    /group-hover:translate-x-/,
    'group-hover:translate-x- を含む',
  )
})
