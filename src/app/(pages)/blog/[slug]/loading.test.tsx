import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Loading from './loading'

// tsx は JSX を classic な React.createElement に変換するため、グローバルに React を渡す。
const globalScope = globalThis as Record<string, unknown>
globalScope.React = React

test('blog/[slug]/loading: スケルトンが例外なく描画される', () => {
  // Given/When/Then: Server Component の純粋スケルトンが SSR 描画で throw しない
  assert.doesNotThrow(() => renderToStaticMarkup(<Loading />))
})

test('blog/[slug]/loading: animate-pulse のスケルトンプレースホルダを描画する', () => {
  // Given/When: 記事本文の loading を描画する
  const html = renderToStaticMarkup(<Loading />)
  // Then: ローディング表現として animate-pulse が出力される
  assert.match(html, /animate-pulse/)
})

test('blog/[slug]/loading: プレースホルダに CSS 生成されるテーマ色を用いる', () => {
  // tailwind.config.ts が gray を単一文字列で上書きし gray-<数値> は CSS 未生成のため、
  // 実在テーマ色を使い、未生成シェードでスケルトンが不可視化する回帰を防ぐ。
  const html = renderToStaticMarkup(<Loading />)
  assert.match(html, /bg-gray dark:bg-night-gray/)
  assert.doesNotMatch(html, /bg-gray-\d/)
})
