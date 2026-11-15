// Issue #343: endsUpInValidPosition の契約を固定する。
//
// 行き先がマップの端（rowIndex -1、tileIndex minTileIndex - 1 / maxTileIndex + 1）
// か、森の行の木と同じタイルなら false を返す。行き先の行は rows[rowIndex - 1]。
// マップは useMapStore.setState で差し替え、乱数で作った初期の行に頼らない。
//
// 実行: `npm test`（node --import tsx --test）。

import { maxTileIndex, minTileIndex } from '@/app/components/game/const'
import useMapStore from '@/app/components/game/stores/map'
import type { Row } from '@/types/game-objects'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { endsUpInValidPosition } from './endsUpInValidPosition'

const treeTile = 3

const forestRow: Row = {
  type: 'forest',
  trees: [{ tileIndex: treeTile, height: 20 }],
}

const carRow: Row = {
  type: 'car',
  direction: true,
  speed: 125,
  vehicles: [{ initialTileIndex: treeTile, color: 0xa52523 }],
}

const truckRow: Row = {
  type: 'truck',
  direction: false,
  speed: 156,
  vehicles: [{ initialTileIndex: treeTile, color: 0xbdb638 }],
}

const setRows = (rows: Row[]) => useMapStore.setState({ rows })

test('rowIndex が -1 になる移動は false', () => {
  // Given: 先頭の行（rowIndex 0）
  // When: backward で -1 へ
  // Then: 端なので false
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: 0 }, ['backward']),
    false,
  )
})

test('tileIndex が minTileIndex - 1 になる移動は false', () => {
  // Given: 左端のタイル
  // When: left で minTileIndex - 1 へ
  // Then: 端なので false
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: minTileIndex }, ['left']),
    false,
  )
})

test('tileIndex が maxTileIndex + 1 になる移動は false', () => {
  // Given: 右端のタイル
  // When: right で maxTileIndex + 1 へ
  // Then: 端なので false
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: maxTileIndex }, ['right']),
    false,
  )
})

test('tileIndex が minTileIndex ちょうどになる移動は true', () => {
  // Given: 左端の 1 つ内側
  // When: left で minTileIndex へ
  // Then: 端の内側なので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: minTileIndex + 1 }, [
      'left',
    ]),
    true,
  )
})

test('tileIndex が maxTileIndex ちょうどになる移動は true', () => {
  // Given: 右端の 1 つ内側
  // When: right で maxTileIndex へ
  // Then: 端の内側なので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: maxTileIndex - 1 }, [
      'right',
    ]),
    true,
  )
})

test('行き先の森の行で、同じ tileIndex に木があれば false', () => {
  // Given: rows[0] が森で tile 3 に木、rows[1] は車の行
  setRows([forestRow, carRow])
  // When: rowIndex 0 → 1（rows[0] を見る）、tile 3 へ forward
  // Then: 木に当たるので false
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile }, ['forward']),
    false,
  )
})

test('行き先の森の行で、木が無いタイルは true', () => {
  // Given: rows[0] が森で tile 3 にだけ木
  setRows([forestRow, carRow])
  // When: tile 4 へ forward
  // Then: 木が無いので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile + 1 }, [
      'forward',
    ]),
    true,
  )
})

test('行き先の判定は rows[rowIndex - 1] を見る（rows[rowIndex] ではない）', () => {
  // Given: rows[0] は車の行、rows[1] が森で tile 3 に木
  setRows([carRow, forestRow])
  // When: rowIndex 0 → 1、tile 3 へ forward（見るのは rows[0]）
  // Then: rows[0] は車の行なので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile }, ['forward']),
    true,
  )
})

test('行き先の行が車の行なら true', () => {
  // Given: rows[0] が車の行（tile 3 に車がある）
  setRows([carRow])
  // When: tile 3 へ forward
  // Then: 車は移動を止めないので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile }, ['forward']),
    true,
  )
})

test('行き先の行がトラックの行なら true', () => {
  // Given: rows[0] がトラックの行（tile 3 にトラックがある）
  setRows([truckRow])
  // When: tile 3 へ forward
  // Then: トラックは移動を止めないので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile }, ['forward']),
    true,
  )
})

test('複数の移動では途中ではなく行き着いた位置で判定する', () => {
  // Given: rows[0] が森で tile 3 に木
  setRows([forestRow])
  // When: tile 2 から forward → right で (1, 3) へ
  // Then: 行き着いた先が木なので false
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile - 1 }, [
      'forward',
      'right',
    ]),
    false,
  )
})

test('複数の移動で途中のタイルにだけ木があれば true', () => {
  // Given: rows[0] が森で tile 2 にだけ木
  setRows([
    { type: 'forest', trees: [{ tileIndex: treeTile - 1, height: 20 }] },
  ])
  // When: tile 2 から forward → right で、木のある (1, 2) を通って (1, 3) へ
  // Then: 行き着いた先に木が無いので true
  assert.equal(
    endsUpInValidPosition({ rowIndex: 0, tileIndex: treeTile - 1 }, [
      'forward',
      'right',
    ]),
    true,
  )
})
