// Issue #386 / TDD 先行: /api/likes の articleId を検査する純粋関数の契約を固定する。
//
// GET は Issue が見つからないと作るので、存在しない記事の ID を送るたびに Issue が増える。
// findLikeIssue は articleId を Search クエリ "likes-<articleId>" にそのまま入れる。
// parseArticleId は ^[A-Za-z0-9_-]{1,100}$ に合う文字列だけを通し、ほかは拒否する。
//
// 実行: `npm test`（node --import tsx --test）。実装前は import で RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MAX_ARTICLE_ID_LENGTH, parseArticleId } from './articleIdValidation'

const MISSING_ERROR = '記事IDが必要です'
const FORMAT_ERROR = '記事IDの形式が不正です'

test('上限: MAX_ARTICLE_ID_LENGTH=100', () => {
  assert.equal(MAX_ARTICLE_ID_LENGTH, 100)
})

for (const rawArticleId of [
  'hello-world',
  'study_english_in_philippines_13',
  'ABC-xyz_09',
  'a',
]) {
  test(`parseArticleId: '${rawArticleId}' はそのまま受け付ける`, () => {
    // Given: 英数字・-・_ だけの 1〜100 文字の値
    // When: 検査する
    // Then: ok=true で値を変えずに返す
    assert.deepEqual(parseArticleId(rawArticleId), {
      ok: true,
      articleId: rawArticleId,
    })
  })
}

test('parseArticleId: 100 文字の値は受け付ける（上限の境界値）', () => {
  // Given: ちょうど 100 文字
  // Then: ok=true で値を変えずに返す
  const rawArticleId = 'a'.repeat(100)
  assert.deepEqual(parseArticleId(rawArticleId), {
    ok: true,
    articleId: rawArticleId,
  })
})

test('parseArticleId: 101 文字の値は形式違いとして拒否する（上限の境界値）', () => {
  // Given: 上限を 1 文字超える値
  // Then: ok=false で形式違いの error を返す
  assert.deepEqual(parseArticleId('a'.repeat(101)), {
    ok: false,
    error: FORMAT_ERROR,
  })
})

for (const [label, rawArticleId] of [
  ['空白', 'a b'],
  ['"', 'a"b'],
  [',', 'a,b'],
  ['/ と .', '../x'],
  ['末尾の改行', 'hello-world\n'],
  ['先頭の改行', '\nhello-world'],
  ['日本語', '記事'],
  [':', 'is:issue'],
]) {
  test(`parseArticleId: ${label} を含む値は形式違いとして拒否する`, () => {
    // Given: 英数字・-・_ 以外の文字を含む値
    // When: 検査する
    // Then: ok=false で形式違いの error を返す
    assert.deepEqual(parseArticleId(rawArticleId), {
      ok: false,
      error: FORMAT_ERROR,
    })
  })
}

test('parseArticleId: 空文字は ID が無いものとして拒否する', () => {
  // Given: articleId= のように値が空
  // When: 検査する
  // Then: ok=false で、今と同じ「記事IDが必要です」を返す
  assert.deepEqual(parseArticleId(''), { ok: false, error: MISSING_ERROR })
})

test('parseArticleId: null（クエリに無い）は ID が無いものとして拒否する', () => {
  // Given: searchParams.get('articleId') が null
  // Then: ok=false で「記事IDが必要です」を返す
  assert.deepEqual(parseArticleId(null), { ok: false, error: MISSING_ERROR })
})

test('parseArticleId: undefined（body に無い）は ID が無いものとして拒否する', () => {
  // Given: POST の body に articleId が無い
  // Then: ok=false で「記事IDが必要です」を返す
  assert.deepEqual(parseArticleId(undefined), {
    ok: false,
    error: MISSING_ERROR,
  })
})

for (const [label, rawArticleId] of [
  ['数値', 123],
  ['配列', ['hello-world']],
  ['オブジェクト', { id: 'hello-world' }],
  ['boolean', true],
] as const) {
  test(`parseArticleId: 文字列でない値（${label}）は拒否する`, () => {
    // Given: POST の body に文字列でない articleId が入っている
    // When: 検査する
    // Then: 文字列に変換して通さず、今と同じ「記事IDが必要です」を返す
    assert.deepEqual(parseArticleId(rawArticleId), {
      ok: false,
      error: MISSING_ERROR,
    })
  })
}
