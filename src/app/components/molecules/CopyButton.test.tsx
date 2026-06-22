import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// CopyButton がスタイル用 CSS Module を import する可能性があるため、
// .css 解決を空モジュールへ差し替えてから動的 import する。
register(
  'data:text/javascript,' +
    encodeURIComponent(
      "export async function resolve(s,c,n){if(s.endsWith('.css'))return{url:'data:text/javascript,export default {}',shortCircuit:true};return n(s,c)}",
    ),
  import.meta.url,
)

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

type CopyButtonComponent = React.FC<{ code: string }>

let CopyButton: CopyButtonComponent
before(async () => {
  CopyButton = (await import('./CopyButton')).default as CopyButtonComponent
})

test('CopyButton: コピー操作のための button 要素を描画する', () => {
  // Given: コピー対象の生コード
  // When: CopyButton を描画する
  const html = renderToStaticMarkup(<CopyButton code={'const x = 1'} />)
  // Then: button が描画される
  assert.match(html, /<button/)
})

test('CopyButton: コピーアイコン(svg)を表示する', () => {
  // Given: コピー対象の生コード
  // When: CopyButton を描画する
  const html = renderToStaticMarkup(<CopyButton code={'const x = 1'} />)
  // Then: react-icons のコピーアイコン svg が初期表示される
  assert.match(html, /<svg/)
})

test('CopyButton: 生コードを描画 DOM へそのまま吐き出さない', () => {
  // Given: HTML 特殊文字を含む生コード（コピー時のみ使用される）
  // When: CopyButton を描画する
  const html = renderToStaticMarkup(
    <CopyButton code={'<script>alert(1)</script>'} />,
  )
  // Then: 生のタグとして DOM に注入されない（コピー用途のみで保持）
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/)
})
