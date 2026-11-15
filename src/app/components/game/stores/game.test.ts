// Issue #344: game ストアの契約を固定する。
//
// はじめは status が running、score が 0。
// updateScore は今より大きい行だけをスコアに反映し、スコアを下げない。
// endGame は status を over にする。
// reset は requestAnimationFrame を呼ぶので、ここでは扱わない。
//
// 実行: `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import useGameStore from './game'
import { reset as resetPlayerStore } from './player'

beforeEach(() => {
  resetPlayerStore()
  useGameStore.setState({ status: 'running', score: 0 })
})

test('はじめは status が running、score が 0', () => {
  // Given: ストアを作ったときの状態
  // When: 初期状態を読む（beforeEach の setState と区別するため getInitialState を使う）
  const initial = useGameStore.getInitialState()
  // Then: running と 0
  assert.equal(initial.status, 'running')
  assert.equal(initial.score, 0)
})

test('updateScore は今より大きい行をスコアに反映する', () => {
  // Given: score 0
  // When: 行 3 を渡す
  useGameStore.getState().updateScore(3)
  // Then: score は 3
  assert.equal(useGameStore.getState().score, 3)
})

test('updateScore は今より小さい行ではスコアを下げない', () => {
  // Given: score 3
  useGameStore.getState().updateScore(3)
  // When: 行 1 を渡す
  useGameStore.getState().updateScore(1)
  // Then: score は 3 のまま
  assert.equal(useGameStore.getState().score, 3)
})

test('updateScore は今と同じ行ではスコアを変えない', () => {
  // Given: score 3
  useGameStore.getState().updateScore(3)
  // When: 同じ行 3 を渡す
  useGameStore.getState().updateScore(3)
  // Then: score は 3 のまま
  assert.equal(useGameStore.getState().score, 3)
})

test('endGame は status を over にする', () => {
  // Given: status が running
  // When: endGame を呼ぶ
  useGameStore.getState().endGame()
  // Then: status は over
  assert.equal(useGameStore.getState().status, 'over')
})
