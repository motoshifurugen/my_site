// Issue #382: ChapterPlayer から data/sceneProgress.ts へ移した 2 つの関数の動きを固定する。
//
// - getNextScenePosition: シーンの遷移のあとに進む位置を決める
// - getClickResult: 最後まで読んだ行をクリックしたときの結果を決める
//
// 移す前の ChapterPlayer と同じ判定をすることを確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getClickResult, getNextScenePosition } from './sceneProgress'

// シーンごとの行の数から、偽の章を作る
const chapter = (sceneLineCounts: number[]) => ({
  scenes: sceneLineCounts.map((count) => ({
    lines: Array.from({ length: count }, () => null),
  })),
})

// 第1章〜第6章。どの章もシーンは 3 つ、各シーンの行は 4 つ
const sixChapters = Array.from({ length: 6 }, () => chapter([4, 4, 4]))

// 第6章が無い 5 章の一覧
const fiveChapters = Array.from({ length: 5 }, () => chapter([4, 4, 4]))

test('getNextScenePosition: 章の途中のシーンなら同じ章の次のシーン', () => {
  // Given: 第2章（1）の 2 つめのシーン（1）。この章のシーンは 3 つ
  // When: 進み先を求める
  // Then: 同じ章の 3 つめのシーン
  assert.deepEqual(getNextScenePosition(sixChapters, 1, 1), {
    chapterIndex: 1,
    sceneIndex: 2,
  })
})

test('getNextScenePosition: 章の最初のシーンなら同じ章の 2 つめのシーン', () => {
  // Given: 第1章（0）の最初のシーン（0）
  // When: 進み先を求める
  // Then: 同じ章のシーン 1
  assert.deepEqual(getNextScenePosition(sixChapters, 0, 0), {
    chapterIndex: 0,
    sceneIndex: 1,
  })
})

test('getNextScenePosition: 章の最後のシーンで次の章があれば次の章のシーン 0', () => {
  // Given: 第3章（2）の最後のシーン（2）。第4章がある
  // When: 進み先を求める
  // Then: 第4章（3）のシーン 0
  assert.deepEqual(getNextScenePosition(sixChapters, 2, 2), {
    chapterIndex: 3,
    sceneIndex: 0,
  })
})

test('getNextScenePosition: シーンが 1 つだけの章なら次の章のシーン 0', () => {
  // Given: シーンが 1 つの章のシーン 0。次の章がある
  // When: 進み先を求める
  // Then: 次の章のシーン 0
  const chapters = [chapter([2]), chapter([2, 2])]
  assert.deepEqual(getNextScenePosition(chapters, 0, 0), {
    chapterIndex: 1,
    sceneIndex: 0,
  })
})

test('getNextScenePosition: 最後の章の最後のシーンなら進み先なし', () => {
  // Given: 第6章（5）の最後のシーン（2）。次の章は無い
  // When: 進み先を求める
  // Then: null
  assert.equal(getNextScenePosition(sixChapters, 5, 2), null)
})

test('getNextScenePosition: 章の index が一覧の長さと同じなら例外を投げず進み先なし', () => {
  // Given: 6 章の一覧に対して章の index 6
  // When: 進み先を求める
  // Then: 例外を投げず null
  assert.doesNotThrow(() => getNextScenePosition(sixChapters, 6, 0))
  assert.equal(getNextScenePosition(sixChapters, 6, 0), null)
})

test('getNextScenePosition: 章の index が負の数なら例外を投げず進み先なし', () => {
  // Given: 章の index -1
  // When: 進み先を求める
  // Then: 例外を投げず null
  assert.doesNotThrow(() => getNextScenePosition(sixChapters, -1, 0))
  assert.equal(getNextScenePosition(sixChapters, -1, 0), null)
})

test('getNextScenePosition: 章の一覧が空なら例外を投げず進み先なし', () => {
  // Given: 章が 1 つも無い
  // When: 進み先を求める
  // Then: 例外を投げず null
  assert.doesNotThrow(() => getNextScenePosition([], 0, 0))
  assert.equal(getNextScenePosition([], 0, 0), null)
})

test('getClickResult: 行が残っていれば次の行', () => {
  // Given: 第1章（0）のシーン 0 の行 1。このシーンの行は 4 つ
  // When: クリックの結果を求める
  // Then: 行 2 へ進む
  assert.deepEqual(getClickResult(sixChapters, 0, 0, 1), {
    type: 'nextLine',
    lineIndex: 2,
  })
})

test('getClickResult: 最後から 2 つめの行なら最後の行へ進む', () => {
  // Given: 行が 4 つのシーンの行 2
  // When: クリックの結果を求める
  // Then: 最後の行（3）へ進む
  assert.deepEqual(getClickResult(sixChapters, 0, 0, 2), {
    type: 'nextLine',
    lineIndex: 3,
  })
})

test('getClickResult: 第6章の最後のシーンでも行が残っていれば次の行', () => {
  // Given: 第6章（5）の最後のシーン（2）の行 0
  // When: クリックの結果を求める
  // Then: エンディングではなく行 1 へ進む
  assert.deepEqual(getClickResult(sixChapters, 5, 2, 0), {
    type: 'nextLine',
    lineIndex: 1,
  })
})

test('getClickResult: 第6章の最後のシーンの最後の行ならエンディング', () => {
  // Given: 第6章（5）の最後のシーン（2）の最後の行（3）
  // When: クリックの結果を求める
  // Then: エンディング
  assert.deepEqual(getClickResult(sixChapters, 5, 2, 3), { type: 'ending' })
})

test('getClickResult: 第6章の後に章が続いていても、第6章の最後ならエンディング', () => {
  // Given: 7 章の一覧で、第6章（5）の最後のシーンの最後の行。第7章（6）がある
  // When: クリックの結果を求める
  // Then: 遷移ではなくエンディング
  const sevenChapters = Array.from({ length: 7 }, () => chapter([4, 4, 4]))
  assert.deepEqual(getClickResult(sevenChapters, 5, 2, 3), { type: 'ending' })
})

test('getClickResult: 第6章の途中のシーンの最後の行なら遷移を始める', () => {
  // Given: 第6章（5）の 2 つめのシーン（1）の最後の行（3）。次のシーンがある
  // When: クリックの結果を求める
  // Then: エンディングではなく遷移を始める
  assert.deepEqual(getClickResult(sixChapters, 5, 1, 3), {
    type: 'startTransition',
  })
})

test('getClickResult: 最後の行で同じ章に次のシーンがあれば遷移を始める', () => {
  // Given: 第2章（1）のシーン 0 の最後の行（3）
  // When: クリックの結果を求める
  // Then: 遷移を始める
  assert.deepEqual(getClickResult(sixChapters, 1, 0, 3), {
    type: 'startTransition',
  })
})

test('getClickResult: 章の最後のシーンの最後の行で次の章があれば遷移を始める', () => {
  // Given: 第5章（4）の最後のシーン（2）の最後の行（3）。第6章がある
  // When: クリックの結果を求める
  // Then: 遷移を始める
  assert.deepEqual(getClickResult(sixChapters, 4, 2, 3), {
    type: 'startTransition',
  })
})

test('getClickResult: 行が 1 つだけのシーンなら遷移を始める', () => {
  // Given: 行が 1 つのシーンの行 0。同じ章に次のシーンがある
  // When: クリックの結果を求める
  // Then: 次の行は無いので遷移を始める
  const chapters = [chapter([1, 2])]
  assert.deepEqual(getClickResult(chapters, 0, 0, 0), {
    type: 'startTransition',
  })
})

test('getClickResult: 第6章の無い一覧で最後の章の最後の行なら何もしない', () => {
  // Given: 5 章の一覧で、第5章（4）の最後のシーン（2）の最後の行（3）
  // When: クリックの結果を求める
  // Then: 章の index が 5 ではないのでエンディングにならず、進み先も無いので何もしない
  assert.deepEqual(getClickResult(fiveChapters, 4, 2, 3), { type: 'none' })
})

test('getClickResult: 章の index が一覧の長さと同じなら例外を投げず何もしない', () => {
  // Given: 6 章の一覧に対して章の index 6
  // When: クリックの結果を求める
  // Then: 例外を投げず何もしない
  assert.doesNotThrow(() => getClickResult(sixChapters, 6, 0, 0))
  assert.deepEqual(getClickResult(sixChapters, 6, 0, 0), { type: 'none' })
})

test('getClickResult: 章の index が負の数なら例外を投げず何もしない', () => {
  // Given: 章の index -1
  // When: クリックの結果を求める
  // Then: 例外を投げず何もしない
  assert.doesNotThrow(() => getClickResult(sixChapters, -1, 0, 0))
  assert.deepEqual(getClickResult(sixChapters, -1, 0, 0), { type: 'none' })
})

test('getClickResult: シーンの index が範囲の外なら例外を投げず何もしない', () => {
  // Given: シーンが 3 つの章に対してシーンの index 3
  // When: クリックの結果を求める
  // Then: 例外を投げず何もしない
  assert.doesNotThrow(() => getClickResult(sixChapters, 0, 3, 0))
  assert.deepEqual(getClickResult(sixChapters, 0, 3, 0), { type: 'none' })
})
