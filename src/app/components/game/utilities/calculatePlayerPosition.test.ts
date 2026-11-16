// Issue #364: calculatePlayerPosition の契約を固定する。
//
// いまの行とタイル、移動の向き、進み具合（progress）から、プレイヤーの x・y と子要素の z を返す。
// 始点は x が tileIndex * 42、y が rowIndex * 42。
// 終点は left で x - 42、right で x + 42、forward で y + 42、backward で y - 42。
// x と y は始点と終点を progress で線形補間し、z は sin(progress * π) * 8。
//
// 実行: `npm test`（node --import tsx --test）。

import type { MoveDirection } from '@/types/game-objects'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculatePlayerPosition } from './calculatePlayerPosition'

// 始点は x = 3 * 42 = 126、y = 2 * 42 = 84。0 でない値にして、始点を足し忘れた実装を見逃さない。
const start = { rowIndex: 2, tileIndex: 3 }
const startX = 126
const startY = 84

// sin(π) は 0 ちょうどにならない（約 9.8e-16）ので、progress = 1 の z はこの幅で比べる。
const epsilon = 1e-9

const directions: MoveDirection[] = ['forward', 'backward', 'left', 'right']

test('forward の終点は y だけ 42 増える', () => {
  // Given: 始点から forward に動く
  // When: progress = 1 の位置を求める
  const { x, y } = calculatePlayerPosition(start, 'forward', 1)
  // Then: x はそのまま、y は 84 + 42
  assert.equal(x, startX)
  assert.equal(y, 126)
})

test('backward の終点は y だけ 42 減る', () => {
  // Given: 始点から backward に動く
  // When: progress = 1 の位置を求める
  const { x, y } = calculatePlayerPosition(start, 'backward', 1)
  // Then: x はそのまま、y は 84 - 42
  assert.equal(x, startX)
  assert.equal(y, 42)
})

test('left の終点は x だけ 42 減る', () => {
  // Given: 始点から left に動く
  // When: progress = 1 の位置を求める
  const { x, y } = calculatePlayerPosition(start, 'left', 1)
  // Then: x は 126 - 42、y はそのまま
  assert.equal(x, 84)
  assert.equal(y, startY)
})

test('right の終点は x だけ 42 増える', () => {
  // Given: 始点から right に動く
  // When: progress = 1 の位置を求める
  const { x, y } = calculatePlayerPosition(start, 'right', 1)
  // Then: x は 126 + 42、y はそのまま
  assert.equal(x, 168)
  assert.equal(y, startY)
})

test('progress = 0 なら 4 方向どれでも始点にいて z は 0', () => {
  for (const direction of directions) {
    // Given: 動き始め（progress = 0）
    // When: 位置を求める
    const position = calculatePlayerPosition(start, direction, 0)
    // Then: 始点のまま、跳ねていない
    assert.deepEqual(position, { x: startX, y: startY, z: 0 }, direction)
  }
})

test('progress = 0.5 なら forward は y が始点と終点の中間で z は 8', () => {
  // Given: forward の途中（progress = 0.5）
  // When: 位置を求める
  const position = calculatePlayerPosition(start, 'forward', 0.5)
  // Then: y は 84 と 126 の中間、z は跳ねの頂点
  assert.deepEqual(position, { x: startX, y: 105, z: 8 })
})

test('progress = 0.5 なら backward は y が始点と終点の中間で z は 8', () => {
  // Given: backward の途中（progress = 0.5）
  // When: 位置を求める
  const position = calculatePlayerPosition(start, 'backward', 0.5)
  // Then: y は 84 と 42 の中間、z は跳ねの頂点
  assert.deepEqual(position, { x: startX, y: 63, z: 8 })
})

test('progress = 0.5 なら left は x が始点と終点の中間で z は 8', () => {
  // Given: left の途中（progress = 0.5）
  // When: 位置を求める
  const position = calculatePlayerPosition(start, 'left', 0.5)
  // Then: x は 126 と 84 の中間、z は跳ねの頂点
  assert.deepEqual(position, { x: 105, y: startY, z: 8 })
})

test('progress = 0.5 なら right は x が始点と終点の中間で z は 8', () => {
  // Given: right の途中（progress = 0.5）
  // When: 位置を求める
  const position = calculatePlayerPosition(start, 'right', 0.5)
  // Then: x は 126 と 168 の中間、z は跳ねの頂点
  assert.deepEqual(position, { x: 147, y: startY, z: 8 })
})

test('progress = 1 なら 4 方向どれでも z はほぼ 0 に戻る', () => {
  for (const direction of directions) {
    // Given: 動き終わり（progress = 1）
    // When: 位置を求める
    const { z } = calculatePlayerPosition(start, direction, 1)
    // Then: 着地している
    assert.ok(Math.abs(z) < epsilon, `${direction}: z = ${z}`)
  }
})

test('原点から left に動くと x は負になる', () => {
  // Given: 原点（行 0、タイル 0）から left に動く
  // When: progress = 1 の位置を求める
  const { x, y } = calculatePlayerPosition(
    { rowIndex: 0, tileIndex: 0 },
    'left',
    1,
  )
  // Then: x は -42、y は 0
  assert.equal(x, -42)
  assert.equal(y, 0)
})

test('負のタイルと行からも 42 刻みで始点を求める', () => {
  // Given: 行 -1、タイル -2 から動き始める
  // When: progress = 0 の位置を求める
  const { x, y } = calculatePlayerPosition(
    { rowIndex: -1, tileIndex: -2 },
    'right',
    0,
  )
  // Then: x は -2 * 42、y は -1 * 42
  assert.equal(x, -84)
  assert.equal(y, -42)
})
