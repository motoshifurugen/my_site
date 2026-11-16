// Issue #361: calculateVehiclePosition の契約を固定する。
//
// 車とトラックの次の x 座標を返す。行の始まりは -420、終わりは 420。
// direction が true なら speed * delta だけ進め、420 を越えていれば -420 に戻す。
// direction が false なら speed * delta だけ戻し、-420 を下回っていれば 420 に戻す。
// ちょうど ±420 のときは端に戻さず進める。
//
// 実行: `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateVehiclePosition } from './calculateVehiclePosition'

// 進む量は 100 * 0.5 = 50。2 進数で正確に表せる値にして浮動小数の誤差を避ける。
const speed = 100
const delta = 0.5

test('direction が true で x が 420 以下なら x + speed * delta を返す', () => {
  // Given: 右向きで行の中ほど（x = 0）にいる
  // When: 次の x を求める
  // Then: 50 だけ進む
  assert.equal(calculateVehiclePosition(0, true, speed, delta), 50)
})

test('direction が true で x が 420 より大きければ -420 を返す', () => {
  // Given: 右向きで行の終わりを越えている（x = 421）
  // When: 次の x を求める
  // Then: 行の始まりに戻る
  assert.equal(calculateVehiclePosition(421, true, speed, delta), -420)
})

test('direction が true で x がちょうど 420 なら戻さずに進める', () => {
  // Given: 右向きで行の終わりちょうど（x = 420）にいる
  // When: 次の x を求める
  // Then: 戻さずに 50 だけ進む
  assert.equal(calculateVehiclePosition(420, true, speed, delta), 470)
})

test('direction が false で x が -420 以上なら x - speed * delta を返す', () => {
  // Given: 左向きで行の中ほど（x = 0）にいる
  // When: 次の x を求める
  // Then: 50 だけ戻る
  assert.equal(calculateVehiclePosition(0, false, speed, delta), -50)
})

test('direction が false で x が -420 より小さければ 420 を返す', () => {
  // Given: 左向きで行の始まりを越えている（x = -421）
  // When: 次の x を求める
  // Then: 行の終わりに戻る
  assert.equal(calculateVehiclePosition(-421, false, speed, delta), 420)
})

test('direction が false で x がちょうど -420 なら戻さずに進める', () => {
  // Given: 左向きで行の始まりちょうど（x = -420）にいる
  // When: 次の x を求める
  // Then: 戻さずに 50 だけ戻る
  assert.equal(calculateVehiclePosition(-420, false, speed, delta), -470)
})
