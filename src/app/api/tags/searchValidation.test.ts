// Issue #378 / TDD 先行: /api/tags の search を検査する純粋関数の契約を固定する。
//
// route は search を .or() の文字列へそのまま入れる。.or() は , で条件を区切るので、
// 呼び出す側は search に , を入れて条件を足せてしまう。parseSearch は .or() の構文に
// 使う , ( ) " \ を含む値と 100 文字を超える値を拒否し、ほかの値は今と同じく通す。
//
// 実行: `npm test`（node --import tsx --test）。実装前は import で RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MAX_SEARCH_LENGTH, parseSearch } from './searchValidation'

const assertSearchError = (rawSearch: string) => {
  const result = parseSearch(rawSearch)
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(typeof result.error, 'string')
  assert.match(result.error, /search/)
}

test('上限: MAX_SEARCH_LENGTH=100', () => {
  assert.equal(MAX_SEARCH_LENGTH, 100)
})

test('parseSearch: null（クエリに無い）は絞り込み無しとして受け付ける', () => {
  // Given: searchParams.get('search') が null
  // When: 検査する
  // Then: ok=true・search=null
  assert.deepEqual(parseSearch(null), { ok: true, search: null })
})

test('parseSearch: 空文字は絞り込み無しとして受け付ける', () => {
  // Given: search= のように値が空
  // When: 検査する
  // Then: null と同じく ok=true・search=null
  assert.deepEqual(parseSearch(''), { ok: true, search: null })
})

for (const rawSearch of ['react', 'Next.js', '50%', 'type script', '短歌']) {
  test(`parseSearch: '${rawSearch}' はそのまま受け付ける`, () => {
    // Given: , ( ) " \ を含まず 100 文字以下の値（. % 空白 日本語は通す）
    // When: 検査する
    // Then: ok=true で値を変えずに返す
    assert.deepEqual(parseSearch(rawSearch), { ok: true, search: rawSearch })
  })
}

test('parseSearch: 100 文字の値は受け付ける（上限の境界値）', () => {
  // Given: ちょうど 100 文字
  // Then: ok=true で値を変えずに返す
  const rawSearch = 'a'.repeat(100)
  assert.deepEqual(parseSearch(rawSearch), { ok: true, search: rawSearch })
})

test('parseSearch: 101 文字の値は拒否する（上限の境界値）', () => {
  // Given: 上限を 1 文字超える値
  // Then: ok=false で search についての error を返す
  assertSearchError('a'.repeat(101))
})

for (const [label, rawSearch] of [
  [',', 'a,b'],
  ['(', 'a(b'],
  [')', 'a)b'],
  ['"', 'a"b'],
  ['\\', 'a\\b'],
]) {
  test(`parseSearch: ${label} を含む値は拒否する`, () => {
    // Given: .or() の構文に使う文字を含む値
    // When: 検査する
    // Then: ok=false で search についての error を返す
    assertSearchError(rawSearch)
  })
}

test('parseSearch: or に条件を足す値は拒否する（Issue #378 の例）', () => {
  // Given: , で区切って id.gt.0 を足そうとする値
  // Then: ok=false で search についての error を返す
  assertSearchError('a%,id.gt.0,name.ilike.%b')
})

test('parseSearch: 拒否する文字が先頭・末尾にあっても拒否する', () => {
  // Given: 拒否する文字が値の端にある
  // Then: どれも ok=false
  assertSearchError(',react')
  assertSearchError('react,')
  assertSearchError('(react)')
  assertSearchError('"react"')
  assertSearchError('react\\')
})

test('parseSearch: 拒否する文字だけの値も拒否する', () => {
  assertSearchError(',')
  assertSearchError('\\')
})
