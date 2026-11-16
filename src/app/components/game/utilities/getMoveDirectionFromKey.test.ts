// Issue #371: getMoveDirectionFromKey の契約を固定する。
//
// keydown の event.key を受け取り、プレイヤーの移動の向き（MoveDirection）を返す。
// ArrowUp は forward、ArrowDown は backward、ArrowLeft は left、ArrowRight は right。
// ほかのキーには null を返す。useEventListeners は null のとき preventDefault() を呼ばない。
//
// 実行: `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getMoveDirectionFromKey } from './getMoveDirectionFromKey'

test('ArrowUp は forward を返す', () => {
  // Given: 上矢印キー
  // When: 向きを求める
  // Then: forward
  assert.equal(getMoveDirectionFromKey('ArrowUp'), 'forward')
})

test('ArrowDown は backward を返す', () => {
  // Given: 下矢印キー
  // When: 向きを求める
  // Then: backward
  assert.equal(getMoveDirectionFromKey('ArrowDown'), 'backward')
})

test('ArrowLeft は left を返す', () => {
  // Given: 左矢印キー
  // When: 向きを求める
  // Then: left
  assert.equal(getMoveDirectionFromKey('ArrowLeft'), 'left')
})

test('ArrowRight は right を返す', () => {
  // Given: 右矢印キー
  // When: 向きを求める
  // Then: right
  assert.equal(getMoveDirectionFromKey('ArrowRight'), 'right')
})

test('文字キー a は null を返す', () => {
  // Given: 矢印でない文字キー
  // When: 向きを求める
  // Then: null
  assert.equal(getMoveDirectionFromKey('a'), null)
})

test('Enter は null を返す', () => {
  // Given: 矢印でない特殊キー
  // When: 向きを求める
  // Then: null
  assert.equal(getMoveDirectionFromKey('Enter'), null)
})

test('空文字は null を返す', () => {
  // Given: 空のキー名
  // When: 向きを求める
  // Then: null
  assert.equal(getMoveDirectionFromKey(''), null)
})

test('小文字の arrowup は null を返す（大文字小文字を区別する）', () => {
  // Given: 大文字小文字だけが違うキー名
  // When: 向きを求める
  // Then: null
  assert.equal(getMoveDirectionFromKey('arrowup'), null)
})

test('Object のプロトタイプにある名前は null を返す', () => {
  // オブジェクトを辞書にして map[key] で引く実装だと、プロトタイプ上の関数が返ってしまう。
  for (const key of ['constructor', 'toString', '__proto__']) {
    // Given: Object.prototype にある名前
    // When: 向きを求める
    // Then: null
    assert.equal(getMoveDirectionFromKey(key), null, key)
  }
})
