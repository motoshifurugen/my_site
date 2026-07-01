// 写真マーキー（components/PhotoFilmRoll.tsx）の表示契約を固定する単体テスト
// （Issue #162 / TDD 先行）。
//
// 現行 page.tsx:333-455 の PhotoFilmRoll を抽出する。props は { photoRows: PhotoRows }
// （3 行の写真配列）。各行の画像を <Image> で描画し、行ごとに alt を
// "Memory N" / "Memory reverse N" / "Memory third N" と付与する（page.tsx:411,428,445）。
// rAF スクロール（useEffect）は renderToStaticMarkup では走らないため描画のみ検証する。
//
// next/image を使うため __testShims__/resolveAssets.mjs を register して interop を正規化する。
// data/photoRows.ts への依存を避けるため、StaticImageData 相当のスタブ配列を props に渡す。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は components/PhotoFilmRoll.tsx が未存在のため RED、実装後に GREEN になることを期待する。

import assert from 'node:assert/strict'
import { register } from 'node:module'
import { before, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

register(
  new URL('../__testShims__/resolveAssets.mjs', import.meta.url).href,
  import.meta.url,
)

// tsx は classic JSX runtime へ変換するため React をグローバルに渡す。
;(globalThis as Record<string, unknown>).React = React

type PhotoRows = unknown[][]
type PhotoFilmRollProps = { photoRows: PhotoRows }

// StaticImageData 相当のスタブ（next/image は object.src を参照する）。
const stub = (n: number) => ({ src: `/stub-${n}.jpg`, height: 100, width: 100 })
const photoRows: PhotoRows = [
  [stub(1), stub(2)],
  [stub(3), stub(4)],
  [stub(5), stub(6)],
]

let PhotoFilmRoll: React.FC<PhotoFilmRollProps>
before(async () => {
  PhotoFilmRoll = (await import('./PhotoFilmRoll'))
    .default as unknown as React.FC<PhotoFilmRollProps>
})

const render = () =>
  renderToStaticMarkup(<PhotoFilmRoll photoRows={photoRows} />)

test('PhotoFilmRoll: 例外なく描画される', () => {
  // Given/When/Then: 3 行の photoRows を渡して throw しない（rAF は SSR では走らない）
  assert.doesNotThrow(() => render())
})

test('PhotoFilmRoll: 画像（<img>）を描画する', () => {
  // Given/When: 描画
  // Then: next/image が <img> を出力する
  assert.ok(render().includes('<img'))
})

test('PhotoFilmRoll: 1 行目の画像 alt を "Memory N" とする', () => {
  // Given/When: 描画
  // Then: page.tsx:411 の alt 規則を維持
  assert.ok(render().includes('alt="Memory 1"'))
})

test('PhotoFilmRoll: 2 行目の画像 alt を "Memory reverse N" とする', () => {
  // Given/When: 描画
  // Then: page.tsx:428 の alt 規則を維持
  assert.ok(render().includes('alt="Memory reverse 1"'))
})

test('PhotoFilmRoll: 3 行目の画像 alt を "Memory third N" とする', () => {
  // Given/When: 描画
  // Then: page.tsx:445 の alt 規則を維持
  assert.ok(render().includes('alt="Memory third 1"'))
})

test('PhotoFilmRoll: 各行の画像を 2 セット複製して描画する（無限スクロール用）', () => {
  // Given: 各行 2 枚 ×（1 行目のみ検証）
  // When: 描画
  const html = render()
  // Then: [...row, ...row] により 1 行目は "Memory 1"〜"Memory 4" を含む
  //       （2 枚 × 2 セット = 4 枚）
  for (const i of [1, 2, 3, 4]) {
    assert.ok(
      html.includes(`alt="Memory ${i}"`),
      `Memory ${i} が複製描画される`,
    )
  }
})
