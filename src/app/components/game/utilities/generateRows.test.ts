// Issue #343: generateRows の契約を固定する。
//
// 森・車・トラックの行を乱数で作る。森は木 4 本（tileIndex は重ならない）、
// 車は 3 台（2 以上離れる）、トラックは 2 台（3 以上離れる）。
// 乱数を使うので、行を多めに作って全行で確かめる。
//
// 実行: `npm test`（node --import tsx --test）。

import { maxTileIndex, minTileIndex } from '@/app/components/game/const'
import type { Row } from '@/types/game-objects'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { generateRows } from './generateRows'

type ForestRow = Extract<Row, { type: 'forest' }>
type CarRow = Extract<Row, { type: 'car' }>
type TruckRow = Extract<Row, { type: 'truck' }>

const sampleSize = 500
const rows = generateRows(sampleSize)
const forestRows = rows.filter((row): row is ForestRow => row.type === 'forest')
const carRows = rows.filter((row): row is CarRow => row.type === 'car')
const truckRows = rows.filter((row): row is TruckRow => row.type === 'truck')

const minGap = (indexes: number[]) => {
  let gap = Infinity
  for (let i = 0; i < indexes.length; i++) {
    for (let j = i + 1; j < indexes.length; j++) {
      gap = Math.min(gap, Math.abs(indexes[i] - indexes[j]))
    }
  }
  return gap
}

test('generateRows(0) は空の配列を返す', () => {
  // Given: 0 行
  // When: 行を作る
  // Then: 空の配列
  assert.deepEqual(generateRows(0), [])
})

test('generateRows(n) は n 行を返す', () => {
  // Given: 1 行と 3 行
  // When: 行を作る
  // Then: 指定した数の行
  assert.equal(generateRows(1).length, 1)
  assert.equal(generateRows(3).length, 3)
  assert.equal(rows.length, sampleSize)
})

test('森・車・トラックの行がどれも 1 行以上出る', () => {
  // Given: 500 行
  // When: 種類ごとに分ける
  // Then: どの種類も 0 行ではない（下の全行チェックが空回りしない）
  assert.ok(forestRows.length > 0, 'forest の行が無い')
  assert.ok(carRows.length > 0, 'car の行が無い')
  assert.ok(truckRows.length > 0, 'truck の行が無い')
  assert.equal(
    forestRows.length + carRows.length + truckRows.length,
    sampleSize,
  )
})

test('森の行は木が 4 本', () => {
  // Given/When: 500 行のうち森の行
  // Then: どの行も木が 4 本
  for (const row of forestRows) {
    assert.equal(row.trees.length, 4)
  }
})

test('森の行の木の tileIndex は重ならない', () => {
  // Given/When: 500 行のうち森の行
  // Then: 4 本の tileIndex がすべて違う
  for (const row of forestRows) {
    const tiles = row.trees.map((tree) => tree.tileIndex)
    assert.equal(new Set(tiles).size, tiles.length, `重なり: ${tiles}`)
  }
})

test('森の行の木の tileIndex は minTileIndex〜maxTileIndex に収まる', () => {
  // Given/When: 500 行のうち森の行
  // Then: どの木も範囲内の整数
  for (const row of forestRows) {
    for (const { tileIndex } of row.trees) {
      assert.ok(Number.isInteger(tileIndex), `整数でない: ${tileIndex}`)
      assert.ok(
        tileIndex >= minTileIndex && tileIndex <= maxTileIndex,
        `範囲外: ${tileIndex}`,
      )
    }
  }
})

test('車の行は車が 3 台', () => {
  // Given/When: 500 行のうち車の行
  // Then: どの行も 3 台
  for (const row of carRows) {
    assert.equal(row.vehicles.length, 3)
  }
})

test('トラックの行はトラックが 2 台', () => {
  // Given/When: 500 行のうちトラックの行
  // Then: どの行も 2 台
  for (const row of truckRows) {
    assert.equal(row.vehicles.length, 2)
  }
})

test('車とトラックの initialTileIndex は minTileIndex〜maxTileIndex - 1 に収まる', () => {
  // Given/When: 500 行のうち車とトラックの行
  // Then: どの台も範囲内の整数
  for (const row of [...carRows, ...truckRows]) {
    for (const { initialTileIndex } of row.vehicles) {
      assert.ok(
        Number.isInteger(initialTileIndex),
        `整数でない: ${initialTileIndex}`,
      )
      assert.ok(
        initialTileIndex >= minTileIndex &&
          initialTileIndex <= maxTileIndex - 1,
        `範囲外 (${row.type}): ${initialTileIndex}`,
      )
    }
  }
})

test('車どうしの initialTileIndex は 2 以上離れる', () => {
  // Given/When: 500 行のうち車の行
  // Then: どの 2 台も差が 2 以上
  for (const row of carRows) {
    const tiles = row.vehicles.map((vehicle) => vehicle.initialTileIndex)
    assert.ok(minGap(tiles) >= 2, `近すぎる: ${tiles}`)
  }
})

test('トラックどうしの initialTileIndex は 3 以上離れる', () => {
  // Given/When: 500 行のうちトラックの行
  // Then: 2 台の差が 3 以上
  for (const row of truckRows) {
    const tiles = row.vehicles.map((vehicle) => vehicle.initialTileIndex)
    assert.ok(minGap(tiles) >= 3, `近すぎる: ${tiles}`)
  }
})
