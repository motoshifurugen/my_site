// 背景スケッチがクリック・タップ位置を得る pointerPosition の単体テスト（Issue #173）。
//
// p5 2 系の型は touches を object[] としか宣言しないため、座標の取り出しを p5Pointer.ts の
// 1 か所にまとめた。マウスを押している間はマウス座標、そうでなければ最初のタッチ点を返す。
// どちらの入力もないときは null を返す。入力があるかの判定はこの関数だけが持つ。
//
// p5 本体は Node で import できない（navigator を参照する）ため、P5CanvasInstance の
// 必要なプロパティだけを持つスタブを渡す。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import type { P5CanvasInstance } from '@p5-wrapper/react'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pointerPosition } from './p5Pointer'

function stubSketch(input: {
  mouseIsPressed: boolean
  mouseX: number
  mouseY: number
  touches: object[]
}): P5CanvasInstance {
  return input as unknown as P5CanvasInstance
}

test('pointerPosition: マウスを押している間はマウス座標を返す', () => {
  // Given: マウスを押していて、タッチ点もある
  const p = stubSketch({
    mouseIsPressed: true,
    mouseX: 10,
    mouseY: 20,
    touches: [{ x: 99, y: 98, id: 1 }],
  })
  // When/Then: マウス座標を優先する
  assert.deepEqual(pointerPosition(p), { x: 10, y: 20 })
})

test('pointerPosition: マウスを押していなければ最初のタッチ点の座標を返す', () => {
  // Given: タッチ点が 2 つある
  const p = stubSketch({
    mouseIsPressed: false,
    mouseX: 0,
    mouseY: 0,
    touches: [
      { x: 30, y: 40, id: 1 },
      { x: 50, y: 60, id: 2 },
    ],
  })
  // When/Then: 最初のタッチ点の x, y だけを返す
  assert.deepEqual(pointerPosition(p), { x: 30, y: 40 })
})

test('pointerPosition: マウスもタッチもないときは null を返す', () => {
  // Given: 入力がない
  const p = stubSketch({
    mouseIsPressed: false,
    mouseX: 0,
    mouseY: 0,
    touches: [],
  })
  // When/Then: 位置がないことを null で返す
  assert.equal(pointerPosition(p), null)
})
