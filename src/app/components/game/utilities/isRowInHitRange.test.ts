// Issue #371: isRowInHitRange の契約を固定する。
//
// 車の行（vehicleRow）とプレイヤーの行（playerRow）を受け取り、当たり判定をする行かを返す。
// 車の行がプレイヤーの行と同じか、その前後 1 行のときだけ true。
//
// 実行: `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isRowInHitRange } from './isRowInHitRange'

// プレイヤーの行が 0 のときも、0 以外のときと同じ結果になることを確かめる。
const playerRows = [5, 0]

test('車の行がプレイヤーの行と同じなら true', () => {
  for (const playerRow of playerRows) {
    // Given: 差が 0
    // When: 当たり判定をする行かを求める
    // Then: true
    assert.equal(isRowInHitRange(playerRow, playerRow), true, `${playerRow}`)
  }
})

test('車の行がプレイヤーの 1 行先なら true', () => {
  for (const playerRow of playerRows) {
    // Given: 差が +1
    // When: 当たり判定をする行かを求める
    // Then: true
    assert.equal(
      isRowInHitRange(playerRow + 1, playerRow),
      true,
      `${playerRow}`,
    )
  }
})

test('車の行がプレイヤーの 1 行手前なら true', () => {
  for (const playerRow of playerRows) {
    // Given: 差が -1（プレイヤーの行が 0 なら車の行は -1）
    // When: 当たり判定をする行かを求める
    // Then: true
    assert.equal(
      isRowInHitRange(playerRow - 1, playerRow),
      true,
      `${playerRow}`,
    )
  }
})

test('車の行がプレイヤーの 2 行先なら false', () => {
  for (const playerRow of playerRows) {
    // Given: 差が +2
    // When: 当たり判定をする行かを求める
    // Then: false
    assert.equal(
      isRowInHitRange(playerRow + 2, playerRow),
      false,
      `${playerRow}`,
    )
  }
})

test('車の行がプレイヤーの 2 行手前なら false', () => {
  for (const playerRow of playerRows) {
    // Given: 差が -2（プレイヤーの行が 0 なら車の行は -2）
    // When: 当たり判定をする行かを求める
    // Then: false
    assert.equal(
      isRowInHitRange(playerRow - 2, playerRow),
      false,
      `${playerRow}`,
    )
  }
})
