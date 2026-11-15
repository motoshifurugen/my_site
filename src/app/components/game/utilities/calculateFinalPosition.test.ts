// Issue #343: calculateFinalPosition の契約を固定する。
//
// 今の位置と移動の列から、行き着く位置を返す。forward / backward は rowIndex を、
// left / right は tileIndex を 1 ずつ動かし、移動は順に足し合わせる。
//
// 実行: `npm test`（node --import tsx --test）。

import type { MoveDirection } from '@/types/game-objects'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateFinalPosition } from './calculateFinalPosition'

const start = { rowIndex: 5, tileIndex: 2 }

test('空の移動列は今の位置をそのまま返す', () => {
  // Given: 移動が 1 つも無い
  // When: 行き着く位置を求める
  // Then: 今の位置と同じ
  assert.deepEqual(calculateFinalPosition(start, []), start)
})

test('forward は rowIndex を 1 増やす', () => {
  // Given: forward を 1 手
  // When: 行き着く位置を求める
  // Then: rowIndex だけ +1
  assert.deepEqual(calculateFinalPosition(start, ['forward']), {
    rowIndex: 6,
    tileIndex: 2,
  })
})

test('backward は rowIndex を 1 減らす', () => {
  // Given: backward を 1 手
  // When: 行き着く位置を求める
  // Then: rowIndex だけ -1
  assert.deepEqual(calculateFinalPosition(start, ['backward']), {
    rowIndex: 4,
    tileIndex: 2,
  })
})

test('left は tileIndex を 1 減らす', () => {
  // Given: left を 1 手
  // When: 行き着く位置を求める
  // Then: tileIndex だけ -1
  assert.deepEqual(calculateFinalPosition(start, ['left']), {
    rowIndex: 5,
    tileIndex: 1,
  })
})

test('right は tileIndex を 1 増やす', () => {
  // Given: right を 1 手
  // When: 行き着く位置を求める
  // Then: tileIndex だけ +1
  assert.deepEqual(calculateFinalPosition(start, ['right']), {
    rowIndex: 5,
    tileIndex: 3,
  })
})

test('複数の移動は順に足し合わせた位置を返す', () => {
  // Given: forward 2 手、left 1 手、right 2 手
  const moves: MoveDirection[] = [
    'forward',
    'forward',
    'left',
    'right',
    'right',
  ]
  // When: 行き着く位置を求める
  // Then: rowIndex +2、tileIndex +1
  assert.deepEqual(calculateFinalPosition(start, moves), {
    rowIndex: 7,
    tileIndex: 3,
  })
})

test('逆向きの移動は打ち消し合う', () => {
  // Given: 4 方向を 1 手ずつ
  const moves: MoveDirection[] = ['forward', 'right', 'backward', 'left']
  // When: 行き着く位置を求める
  // Then: 今の位置に戻る
  assert.deepEqual(calculateFinalPosition(start, moves), start)
})

test('今の位置のオブジェクトを書き換えない', () => {
  // Given: 今の位置
  const current = { rowIndex: 0, tileIndex: 0 }
  // When: 移動して行き着く位置を求める
  calculateFinalPosition(current, ['forward', 'right'])
  // Then: 渡した位置は元のまま
  assert.deepEqual(current, { rowIndex: 0, tileIndex: 0 })
})
