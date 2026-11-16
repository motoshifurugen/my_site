// Issue #355 / TDD 先行: /api/tanka の page・limit を検査する純粋関数の契約を固定する。
//
// 現行 route.tsx は parseInt を通すだけなので、`abc` は NaN、`0` は offset -12、
// `2abc` は 2、`1.5` は 1 として Supabase の .range() に渡ってしまう。
// parsePagination は「数字だけの文字列で範囲内の整数」だけを受け付け、
// 未指定（null）のときだけ既定値を使う。
//
// 実行: `npm test`（node --import tsx --test）。実装前は import で RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  parsePagination,
} from './paginationValidation'

const assertPageError = (rawPage: string | null, rawLimit: string | null) => {
  const result = parsePagination(rawPage, rawLimit)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(typeof result.error, 'string')
  assert.match(result.error, /page/)
}

const assertLimitError = (rawPage: string | null, rawLimit: string | null) => {
  const result = parsePagination(rawPage, rawLimit)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(typeof result.error, 'string')
  assert.match(result.error, /limit/)
}

test('既定値と上限: DEFAULT_PAGE=1・DEFAULT_LIMIT=12・MAX_LIMIT=100', () => {
  // Given: Issue で決めた既定値と上限
  // Then: 今までの既定値（page=1・limit=12）と上限 100
  assert.equal(DEFAULT_PAGE, 1)
  assert.equal(DEFAULT_LIMIT, 12)
  assert.equal(MAX_LIMIT, 100)
})

test('parsePagination: 両方未指定（null）なら page=1・limit=12', () => {
  // Given: searchParams.get() が両方 null
  // When: 検査する
  // Then: 既定値で受け付ける
  assert.deepEqual(parsePagination(null, null), {
    ok: true,
    page: 1,
    limit: 12,
  })
})

test('parsePagination: page だけ未指定なら page=1 で limit は指定値', () => {
  // Given: page=null・limit='5'
  // Then: page は既定値、limit は 5
  assert.deepEqual(parsePagination(null, '5'), { ok: true, page: 1, limit: 5 })
})

test('parsePagination: limit だけ未指定なら limit=12 で page は指定値', () => {
  // Given: page='3'・limit=null
  // Then: limit は既定値、page は 3
  assert.deepEqual(parsePagination('3', null), {
    ok: true,
    page: 3,
    limit: 12,
  })
})

test('parsePagination: 正しい値は数値にして返す', () => {
  // Given: page='2'・limit='5'
  // Then: 数値の 2 と 5
  assert.deepEqual(parsePagination('2', '5'), { ok: true, page: 2, limit: 5 })
})

test('parsePagination: page=1 は受け付ける（下限の境界値）', () => {
  assert.deepEqual(parsePagination('1', '12'), {
    ok: true,
    page: 1,
    limit: 12,
  })
})

test('parsePagination: page に上限は無い（大きいページ番号も受け付ける）', () => {
  // Given: 大きいが安全な整数の page
  // Then: 受け付ける（上限があるのは limit だけ）
  assert.deepEqual(parsePagination('100000', '12'), {
    ok: true,
    page: 100000,
    limit: 12,
  })
})

test('parsePagination: limit=1 は受け付ける（下限の境界値）', () => {
  assert.deepEqual(parsePagination('1', '1'), { ok: true, page: 1, limit: 1 })
})

test('parsePagination: limit=100 は受け付ける（上限の境界値）', () => {
  assert.deepEqual(parsePagination('1', '100'), {
    ok: true,
    page: 1,
    limit: 100,
  })
})

test('parsePagination: 先頭の 0 は数字なので受け付ける（01 → 1）', () => {
  // Given: 数字だけの文字列 '01'
  // Then: 1 として受け付ける
  assert.deepEqual(parsePagination('01', '012'), {
    ok: true,
    page: 1,
    limit: 12,
  })
})

for (const rawPage of ['abc', '0', '-1', '1.5', '2abc', '']) {
  test(`parsePagination: page='${rawPage}' は拒否する`, () => {
    // Given: 数字だけでない、または 1 未満の page
    // When: 検査する
    // Then: ok=false で page についての error を返す
    assertPageError(rawPage, '12')
  })
}

for (const rawLimit of ['abc', '0', '-1', '101', '5x', '']) {
  test(`parsePagination: limit='${rawLimit}' は拒否する`, () => {
    // Given: 数字だけでない、または 1〜100 の外の limit
    // When: 検査する
    // Then: ok=false で limit についての error を返す
    assertLimitError('1', rawLimit)
  })
}

test('parsePagination: 前後の空白や + 記号付きは拒否する（Number() の寛容さを通さない）', () => {
  // Given: Number() なら 1 になってしまう文字列
  // Then: 数字だけではないので拒否する
  assertPageError(' 1', '12')
  assertPageError('1 ', '12')
  assertPageError('+1', '12')
  assertLimitError('1', ' 5')
  assertLimitError('1', '+5')
})

test('parsePagination: 指数表記・16 進表記は拒否する', () => {
  // Given: Number() なら整数になる表記
  // Then: 数字だけではないので拒否する
  assertPageError('1e2', '12')
  assertPageError('0x10', '12')
  assertLimitError('1', '1e1')
})

test('parsePagination: 全角数字は拒否する（ASCII の 0-9 だけを数字とみなす）', () => {
  assertPageError('１', '12')
  assertLimitError('1', '５')
})

test('parsePagination: 安全な整数を超える巨大な page は拒否する', () => {
  // Given: Number.MAX_SAFE_INTEGER を超える数字列
  // Then: 整数として正確に扱えないので拒否する
  assertPageError('9007199254740993', '12')
  assertPageError('9'.repeat(400), '12')
})

test('parsePagination: page と limit が両方不正なら page の error を先に返す', () => {
  // Given: page='abc'・limit='abc'
  // Then: page についての error（limit の error ではない）
  const result = parsePagination('abc', 'abc')
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.match(result.error, /page/)
  assert.doesNotMatch(result.error, /limit/)
})
