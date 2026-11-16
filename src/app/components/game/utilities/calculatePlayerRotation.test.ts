// Issue #364: calculatePlayerRotation の契約を固定する。
//
// いまの回転、移動の向き、進み具合（progress）から、プレイヤーの子要素の回転（z 軸）を返す。
// 回転の終点は forward が 0、left が π / 2、backward が π、right が -π / 2。
// 返す値は、いまの回転と終点を progress で線形補間したもの。
//
// 実行: `npm test`（node --import tsx --test）。

import type { MoveDirection } from '@/types/game-objects'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculatePlayerRotation } from './calculatePlayerRotation'

// いまの回転は 0 でない値にして、終点を返さずいまの回転を返す実装や、その逆を見逃さない。
const currentRotation = 1.3

const epsilon = 1e-9

const endRotations: Record<MoveDirection, number> = {
  forward: 0,
  left: Math.PI / 2,
  backward: Math.PI,
  right: -Math.PI / 2,
}

test('forward の回転の終点は 0', () => {
  // Given: forward に動く
  // When: progress = 1 の回転を求める
  // Then: 0
  assert.equal(calculatePlayerRotation(currentRotation, 'forward', 1), 0)
})

test('left の回転の終点は π / 2', () => {
  // Given: left に動く
  // When: progress = 1 の回転を求める
  // Then: π / 2
  assert.equal(calculatePlayerRotation(currentRotation, 'left', 1), Math.PI / 2)
})

test('backward の回転の終点は π', () => {
  // Given: backward に動く
  // When: progress = 1 の回転を求める
  // Then: π
  assert.equal(calculatePlayerRotation(currentRotation, 'backward', 1), Math.PI)
})

test('right の回転の終点は -π / 2', () => {
  // Given: right に動く
  // When: progress = 1 の回転を求める
  // Then: -π / 2
  assert.equal(
    calculatePlayerRotation(currentRotation, 'right', 1),
    -Math.PI / 2,
  )
})

test('progress = 1 なら いまの回転によらず終点に一致する', () => {
  for (const direction of Object.keys(endRotations) as MoveDirection[]) {
    for (const rotation of [0, -Math.PI, 2.5]) {
      // Given: いまの回転がさまざまな値
      // When: progress = 1 の回転を求める
      // Then: 向きごとの終点
      assert.equal(
        calculatePlayerRotation(rotation, direction, 1),
        endRotations[direction],
        `${direction} from ${rotation}`,
      )
    }
  }
})

test('progress = 0 なら 4 方向どれでもいまの回転のまま', () => {
  for (const direction of Object.keys(endRotations) as MoveDirection[]) {
    // Given: 動き始め（progress = 0）
    // When: 回転を求める
    // Then: いまの回転から変わらない
    assert.equal(
      calculatePlayerRotation(currentRotation, direction, 0),
      currentRotation,
      direction,
    )
  }
})

test('progress = 0.5 なら いまの回転と終点の中間になる', () => {
  for (const direction of Object.keys(endRotations) as MoveDirection[]) {
    // Given: 動きの途中（progress = 0.5）
    // When: 回転を求める
    const rotation = calculatePlayerRotation(currentRotation, direction, 0.5)
    // Then: いまの回転と終点の平均
    const expected = (currentRotation + endRotations[direction]) / 2
    assert.ok(
      Math.abs(rotation - expected) < epsilon,
      `${direction}: ${rotation} != ${expected}`,
    )
  }
})
