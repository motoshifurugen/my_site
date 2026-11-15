// Issue #344: player ストアの契約を固定する。
//
// queueMove は行ける移動だけを movesQueue に積む。status が over のとき、
// 端（rowIndex -1、tileIndex minTileIndex - 1 / maxTileIndex + 1）や木に当たるときは積まない。
// 判定には、すでに積んである移動も含める。
// stepCompleted は先頭の移動を 1 つ取り出して位置を 1 動かし、スコアを着いた行の最大値にする。
// currentRow が rows.length - 10 に着くと、マップの行が 20 増える。
// reset は位置と待ち行列を戻す。ref が null でも例外を投げない。
// マップは useMapStore.setState で差し替え、乱数で作った初期の行に頼らない。
//
// 実行: `npm test`（node --import tsx --test）。

import { maxTileIndex, minTileIndex } from '@/app/components/game/const'
import useGameStore from '@/app/components/game/stores/game'
import useMapStore from '@/app/components/game/stores/map'
import type { Row } from '@/types/game-objects'
import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { queueMove, reset, state, stepCompleted } from './player'

// 10 行だと currentRow 0 のまま左右に動くだけで addRows が呼ばれるので、20 行にする。
const initialRowCount = 20

const carRow: Row = {
  type: 'car',
  direction: true,
  speed: 125,
  vehicles: [],
}

const treeTile = 1

const forestRow: Row = {
  type: 'forest',
  trees: [{ tileIndex: treeTile, height: 20 }],
}

const setRows = (rows: Row[]) => useMapStore.setState({ rows })

const carRows = (count: number): Row[] =>
  Array.from({ length: count }, () => carRow)

beforeEach(() => {
  reset()
  useGameStore.setState({ status: 'running', score: 0 })
  setRows(carRows(initialRowCount))
})

test('queueMove は行ける移動を movesQueue に積む', () => {
  // Given: 先頭の行の中央
  // When: forward を積む
  queueMove('forward')
  // Then: movesQueue に forward が入る
  assert.deepEqual(state.movesQueue, ['forward'])
})

test('queueMove は行ける移動を積んだ順に並べる', () => {
  // Given: 先頭の行の中央
  // When: forward、left、right の順に積む
  queueMove('forward')
  queueMove('left')
  queueMove('right')
  // Then: 積んだ順に並ぶ
  assert.deepEqual(state.movesQueue, ['forward', 'left', 'right'])
})

test('status が over のとき、queueMove は積まない', () => {
  // Given: ゲームが終わっている
  useGameStore.setState({ status: 'over' })
  // When: 行ける移動を積もうとする
  queueMove('forward')
  // Then: movesQueue は空のまま
  assert.deepEqual(state.movesQueue, [])
})

test('rowIndex が -1 になる移動は積まない', () => {
  // Given: 先頭の行（currentRow 0）
  // When: backward を積もうとする
  queueMove('backward')
  // Then: movesQueue は空のまま
  assert.deepEqual(state.movesQueue, [])
})

test('tileIndex が minTileIndex - 1 になる移動は積まない', () => {
  // Given: 左端のタイル
  state.currentTile = minTileIndex
  // When: left を積もうとする
  queueMove('left')
  // Then: movesQueue は空のまま
  assert.deepEqual(state.movesQueue, [])
})

test('tileIndex が maxTileIndex + 1 になる移動は積まない', () => {
  // Given: 右端のタイル
  state.currentTile = maxTileIndex
  // When: right を積もうとする
  queueMove('right')
  // Then: movesQueue は空のまま
  assert.deepEqual(state.movesQueue, [])
})

test('木に当たる移動は積まない', () => {
  // Given: rows[0]（rowIndex 1）の treeTile に木がある
  setRows([forestRow, ...carRows(initialRowCount - 1)])
  state.currentTile = treeTile
  // When: 木のあるタイルへ forward を積もうとする
  queueMove('forward')
  // Then: movesQueue は空のまま
  assert.deepEqual(state.movesQueue, [])
})

test('積んである移動を含めると端に当たるなら、次の移動は積まない', () => {
  // Given: 右端の 1 つ内側
  state.currentTile = maxTileIndex - 1
  // When: right を 2 回積もうとする
  queueMove('right')
  queueMove('right')
  // Then: 1 回目（右端へ）だけが積まれる
  assert.deepEqual(state.movesQueue, ['right'])
})

test('積んである移動を含めると rowIndex -1 になるなら、次の移動は積まない', () => {
  // Given: 先頭の行で forward を 1 つ積んである
  queueMove('forward')
  // When: backward を 2 回積もうとする
  queueMove('backward')
  queueMove('backward')
  // Then: 1 回目（rowIndex 0 へ戻る）だけが積まれる
  assert.deepEqual(state.movesQueue, ['forward', 'backward'])
})

test('積んである移動を含めると木に当たるなら、次の移動は積まない', () => {
  // Given: rows[0]（rowIndex 1）の treeTile に木があり、right を 1 つ積んである
  setRows([forestRow, ...carRows(initialRowCount - 1)])
  queueMove('right')
  // When: forward を積もうとする（行き先は rowIndex 1 の treeTile）
  queueMove('forward')
  // Then: right だけが残る
  assert.deepEqual(state.movesQueue, ['right'])
})

test('stepCompleted は forward で currentRow を 1 増やす', () => {
  // Given: forward を積んである
  queueMove('forward')
  // When: 1 歩進める
  stepCompleted()
  // Then: currentRow だけが 1 増える
  assert.equal(state.currentRow, 1)
  assert.equal(state.currentTile, 0)
})

test('stepCompleted は backward で currentRow を 1 減らす', () => {
  // Given: rowIndex 2 にいて、backward を積んである
  state.currentRow = 2
  queueMove('backward')
  // When: 1 歩進める
  stepCompleted()
  // Then: currentRow だけが 1 減る
  assert.equal(state.currentRow, 1)
  assert.equal(state.currentTile, 0)
})

test('stepCompleted は left で currentTile を 1 減らす', () => {
  // Given: left を積んである
  queueMove('left')
  // When: 1 歩進める
  stepCompleted()
  // Then: currentTile だけが 1 減る
  assert.equal(state.currentRow, 0)
  assert.equal(state.currentTile, -1)
})

test('stepCompleted は right で currentTile を 1 増やす', () => {
  // Given: right を積んである
  queueMove('right')
  // When: 1 歩進める
  stepCompleted()
  // Then: currentTile だけが 1 増える
  assert.equal(state.currentRow, 0)
  assert.equal(state.currentTile, 1)
})

test('stepCompleted は待ち行列の先頭を 1 つだけ取り出す', () => {
  // Given: forward、left の順に積んである
  queueMove('forward')
  queueMove('left')
  // When: 1 歩進める
  stepCompleted()
  // Then: 先頭の forward だけが反映され、left が残る
  assert.equal(state.currentRow, 1)
  assert.equal(state.currentTile, 0)
  assert.deepEqual(state.movesQueue, ['left'])
})

test('待ち行列が空なら、stepCompleted は何も変えない', () => {
  // Given: 待ち行列が空で、rows.length - 10 の行にいる
  // （早期 return が無いと addRows が走って行数が変わるので、ここに置く）
  state.currentRow = initialRowCount - 10
  state.currentTile = 2
  useGameStore.setState({ score: initialRowCount - 10 })
  // When: 1 歩進める
  stepCompleted()
  // Then: 位置、待ち行列、スコア、行数は変わらない
  assert.equal(state.currentRow, initialRowCount - 10)
  assert.equal(state.currentTile, 2)
  assert.deepEqual(state.movesQueue, [])
  assert.equal(useGameStore.getState().score, initialRowCount - 10)
  assert.equal(useMapStore.getState().rows.length, initialRowCount)
})

test('stepCompleted のあと、スコアは着いた行になる', () => {
  // Given: forward を 2 つ積んである
  queueMove('forward')
  queueMove('forward')
  // When: 2 歩進める
  stepCompleted()
  stepCompleted()
  // Then: スコアは 2
  assert.equal(useGameStore.getState().score, 2)
})

test('後ろの行に戻っても、スコアは着いた行の最大値のまま', () => {
  // Given: forward を 2 歩進めてスコアが 2
  queueMove('forward')
  queueMove('forward')
  stepCompleted()
  stepCompleted()
  // When: backward で 1 歩戻る
  queueMove('backward')
  stepCompleted()
  // Then: currentRow は 1 だが、スコアは 2 のまま
  assert.equal(state.currentRow, 1)
  assert.equal(useGameStore.getState().score, 2)
})

test('currentRow が rows.length - 10 に着くと、マップの行が 20 増える', () => {
  // Given: rows.length - 10 の 1 つ手前の行
  state.currentRow = initialRowCount - 10 - 1
  queueMove('forward')
  // When: rows.length - 10 へ 1 歩進める
  stepCompleted()
  // Then: 行が 20 増える
  assert.equal(state.currentRow, initialRowCount - 10)
  assert.equal(useMapStore.getState().rows.length, initialRowCount + 20)
})

test('currentRow が rows.length - 10 以外に着いても、マップの行は増えない', () => {
  // Given: rows.length - 10 の 2 つ手前の行
  state.currentRow = initialRowCount - 10 - 2
  queueMove('forward')
  // When: rows.length - 10 の 1 つ手前へ 1 歩進める
  stepCompleted()
  // Then: 行数は変わらない
  assert.equal(useMapStore.getState().rows.length, initialRowCount)
})

test('reset は currentRow と currentTile を 0 に、movesQueue を空に戻す', () => {
  // Given: 位置と待ち行列に値がある
  state.currentRow = 4
  state.currentTile = -3
  queueMove('forward')
  queueMove('left')
  // When: reset を呼ぶ
  reset()
  // Then: 位置は 0、待ち行列は空
  assert.equal(state.currentRow, 0)
  assert.equal(state.currentTile, 0)
  assert.deepEqual(state.movesQueue, [])
})

test('state.ref が null でも、reset は例外を投げない', () => {
  // Given: ref が設定されていない
  state.ref = null
  // When / Then: reset を呼んでも例外を投げない
  assert.doesNotThrow(() => reset())
})
