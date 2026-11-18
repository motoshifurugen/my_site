// Issue #386 / TDD 先行: /api/likes の articleId を検査する純粋関数の契約を固定する。
//
// GET は Issue が見つからないと作るので、存在しない記事の ID を送るたびに Issue が増える。
// findLikeIssue は articleId を Search クエリ "likes-<articleId>" にそのまま入れる。
// parseArticleId は ^[A-Za-z0-9_-]{1,100}$ に合う文字列だけを通し、ほかは拒否する。
//
// 実行: `npm test`（node --import tsx --test）。実装前は import で RED、実装後に GREEN。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  MAX_ARTICLE_ID_LENGTH,
  MAX_ARTICLE_IDS,
  parseArticleId,
  parseArticleIds,
} from './articleIdValidation'

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

// Issue #390: /api/likes/bulk の articleIds（カンマ区切り）を検査する parseArticleIds の契約。
// getLikeCountsForSlugs は per_page: 100 で 1 ページしか読まないので、101 件以上は拒否する。

const TOO_MANY_ERROR = '記事IDが多すぎます'

const joinedIds = (count: number) =>
  Array.from({ length: count }, (_, i) => `post-${i}`).join(',')

test('上限: MAX_ARTICLE_IDS=100', () => {
  assert.equal(MAX_ARTICLE_IDS, 100)
})

test('parseArticleIds: カンマ区切りの ID を配列にして受け付ける', () => {
  // Given: 形式に合う 2 件をカンマでつないだ値
  // When: 検査する
  // Then: ok=true で、送った順の配列を返す
  assert.deepEqual(parseArticleIds('hello-world,second-post'), {
    ok: true,
    articleIds: ['hello-world', 'second-post'],
  })
})

test('parseArticleIds: 1 件だけの値も受け付ける', () => {
  // Given: カンマを含まない 1 件
  // Then: 要素 1 つの配列を返す
  assert.deepEqual(parseArticleIds('study_english_in_philippines_13'), {
    ok: true,
    articleIds: ['study_english_in_philippines_13'],
  })
})

test('parseArticleIds: 前後の空白を取り、空の要素を捨てる', () => {
  // Given: 前後の空白と空の要素を含む値
  // When: 検査する
  // Then: 空白を取った ID だけが残る（今の route と同じ扱い）
  assert.deepEqual(parseArticleIds(' a , ,b ,'), {
    ok: true,
    articleIds: ['a', 'b'],
  })
})

test('parseArticleIds: 同じ ID が重なっても取り除かない', () => {
  // Given: 同じ ID を 2 回含む値
  // Then: 今の route と同じく、そのまま 2 件で返す
  assert.deepEqual(parseArticleIds('a,a'), {
    ok: true,
    articleIds: ['a', 'a'],
  })
})

for (const [label, rawArticleIds] of [
  ['空文字', ''],
  ['カンマだけ', ','],
  ['空白とカンマだけ', ' , '],
  ['空白だけ', '   '],
] as const) {
  test(`parseArticleIds: ${label}は ID が無いものとして拒否する`, () => {
    // Given: 分けて空白を取ると 1 件も残らない値
    // When: 検査する
    // Then: ok=false で、今と同じ「記事IDが必要です」を返す
    assert.deepEqual(parseArticleIds(rawArticleIds), {
      ok: false,
      error: MISSING_ERROR,
    })
  })
}

for (const [label, rawArticleIds] of [
  ['null（クエリに無い）', null],
  ['undefined', undefined],
  ['数値', 123],
  ['配列', ['hello-world']],
] as const) {
  test(`parseArticleIds: 文字列でない値（${label}）は ID が無いものとして拒否する`, () => {
    // Given: searchParams.get が null を返した場合などの、文字列でない値
    // When: 検査する
    // Then: ok=false で「記事IDが必要です」を返す
    assert.deepEqual(parseArticleIds(rawArticleIds), {
      ok: false,
      error: MISSING_ERROR,
    })
  })
}

for (const [label, malformedId] of [
  ['空白を挟む値', 'hello world'],
  ['" だけの値', '"'],
  ['" を挟む値', 'a"b'],
  ['/ だけの値', '/'],
  ['/ と . を含む値', '../x'],
  ['日本語の値', '記事'],
  ['101 文字の値', 'a'.repeat(101)],
]) {
  test(`parseArticleIds: ${label}を含むと形式違いとして拒否する`, () => {
    // Given: 形式に合う ID と、^[A-Za-z0-9_-]{1,100}$ に合わない ID を 1 つずつ
    // When: 検査する
    // Then: 1 つでも合わなければ全体を拒否し、形式違いの error を返す
    assert.deepEqual(parseArticleIds(`hello-world,${malformedId}`), {
      ok: false,
      error: FORMAT_ERROR,
    })
  })
}

test('parseArticleIds: 形式に合わない ID だけの値も形式違いとして拒否する', () => {
  // Given: 1 件だけで、その ID が形式に合わない
  // Then: 形式違いの error を返す
  assert.deepEqual(parseArticleIds('a"b'), { ok: false, error: FORMAT_ERROR })
})

test('parseArticleIds: 100 文字の ID は受け付ける（ID の長さの境界値）', () => {
  // Given: ちょうど 100 文字の ID
  // Then: ok=true でそのまま返す
  const longId = 'a'.repeat(100)
  assert.deepEqual(parseArticleIds(longId), {
    ok: true,
    articleIds: [longId],
  })
})

test('parseArticleIds: 100 件は受け付ける（件数の境界値）', () => {
  // Given: 形式に合う ID がちょうど MAX_ARTICLE_IDS 件
  // When: 検査する
  // Then: ok=true で 100 件をそのまま返す
  assert.deepEqual(parseArticleIds(joinedIds(100)), {
    ok: true,
    articleIds: joinedIds(100).split(','),
  })
})

test('parseArticleIds: 101 件は多すぎるとして拒否する（件数の境界値）', () => {
  // Given: 形式に合う ID が MAX_ARTICLE_IDS + 1 件
  // When: 検査する
  // Then: ok=false で件数超過の error を返す
  assert.deepEqual(parseArticleIds(joinedIds(101)), {
    ok: false,
    error: TOO_MANY_ERROR,
  })
})

test('parseArticleIds: 件数は空の要素を捨てた後で数える', () => {
  // Given: 100 件の ID の後ろに空の要素がいくつか続く値
  // When: 検査する
  // Then: 空の要素は件数に入れず、100 件として受け付ける
  assert.deepEqual(parseArticleIds(`${joinedIds(100)},, ,`), {
    ok: true,
    articleIds: joinedIds(100).split(','),
  })
})
