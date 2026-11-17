// Issue #374: ChapterPlayer から data/chapterStart.ts へ移した 4 つの関数の動きを固定する。
//
// - getInitialChapterIndex: クエリの chapter から最初の章の番号を決める
// - getInitialSceneIndex: クエリの chapter から最初のシーンの番号を決める
// - isChapter6Route: 選択肢の ID が第6章のルートかを判定する
// - parseLanguage: localStorage の値を 'ja' か 'en' に直す
//
// 移す前の ChapterPlayer と同じ値を返すことを確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chapter5 } from './chapter5'
import {
  getInitialChapterIndex,
  getInitialSceneIndex,
  isChapter6Route,
  parseLanguage,
} from './chapterStart'

test('getInitialChapterIndex: chapter が null なら 0', () => {
  // Given: クエリに chapter が無い
  // When: 最初の章の番号を求める
  // Then: 第1章（0）
  assert.equal(getInitialChapterIndex(null), 0)
})

test('getInitialChapterIndex: chapter が空文字なら 0', () => {
  // Given: ?chapter= のように値が空
  // When: 最初の章の番号を求める
  // Then: 第1章（0）
  assert.equal(getInitialChapterIndex(''), 0)
})

test("getInitialChapterIndex: '1'〜'5' なら 0〜4", () => {
  const cases: [string, number][] = [
    ['1', 0],
    ['2', 1],
    ['3', 2],
    ['4', 3],
    ['5', 4],
  ]
  for (const [chapter, expected] of cases) {
    // Given: 第1章〜第5章の番号
    // When: 最初の章の番号を求める
    // Then: 0 始まりの章の番号
    assert.equal(getInitialChapterIndex(chapter), expected, chapter)
  }
})

test("getInitialChapterIndex: '6' なら第5章の 4", () => {
  // Given: 第6章の番号
  // When: 最初の章の番号を求める
  // Then: 第6章は第5章の選択肢から始めるので、第5章（4）
  assert.equal(getInitialChapterIndex('6'), 4)
})

test('getInitialChapterIndex: 範囲外の番号なら 0', () => {
  for (const chapter of ['0', '7']) {
    // Given: 1〜6 の外の番号
    // When: 最初の章の番号を求める
    // Then: 第1章（0）
    assert.equal(getInitialChapterIndex(chapter), 0, chapter)
  }
})

test('getInitialChapterIndex: 数字でない値なら 0', () => {
  // Given: 数字に読めない値
  // When: 最初の章の番号を求める
  // Then: 第1章（0）
  assert.equal(getInitialChapterIndex('abc'), 0)
})

test("getInitialSceneIndex: '6' なら第5章の最後のシーン", () => {
  // Given: 第6章の番号
  // When: 最初のシーンの番号を求める
  // Then: 選択肢のある第5章の最後のシーン
  assert.equal(getInitialSceneIndex('6'), chapter5.scenes.length - 1)
})

test('getInitialSceneIndex: chapter が null なら 0', () => {
  // Given: クエリに chapter が無い
  // When: 最初のシーンの番号を求める
  // Then: 最初のシーン（0）
  assert.equal(getInitialSceneIndex(null), 0)
})

test("getInitialSceneIndex: '6' 以外の値なら 0", () => {
  for (const chapter of ['', '1', '5', '0', '7', 'abc']) {
    // Given: 第6章でない値
    // When: 最初のシーンの番号を求める
    // Then: 最初のシーン（0）
    assert.equal(getInitialSceneIndex(chapter), 0, chapter)
  }
})

test('isChapter6Route: 第6章のルートの ID なら true', () => {
  for (const choiceId of ['bad_end', 'true_end', 'another_end']) {
    // Given: 第5章の選択肢が持つルートの ID
    // When: 第6章のルートかを判定する
    // Then: true
    assert.equal(isChapter6Route(choiceId), true, choiceId)
  }
})

test('isChapter6Route: ほかの文字列なら false', () => {
  for (const choiceId of ['', 'BAD_END', 'bad_end ', 'ch5_sc3', 'end']) {
    // Given: ルートの ID と完全には一致しない文字列
    // When: 第6章のルートかを判定する
    // Then: false
    assert.equal(isChapter6Route(choiceId), false, choiceId)
  }
})

test("parseLanguage: 'en' なら 'en'", () => {
  // Given: localStorage に英語を保存している
  // When: 言語に直す
  // Then: 'en'
  assert.equal(parseLanguage('en'), 'en')
})

test("parseLanguage: 'ja' なら 'ja'", () => {
  // Given: localStorage に日本語を保存している
  // When: 言語に直す
  // Then: 'ja'
  assert.equal(parseLanguage('ja'), 'ja')
})

test("parseLanguage: null なら 'ja'", () => {
  // Given: localStorage に値が無い
  // When: 言語に直す
  // Then: 'ja'
  assert.equal(parseLanguage(null), 'ja')
})

test("parseLanguage: ほかの文字列なら 'ja'", () => {
  for (const raw of ['EN', '', 'fr', ' en']) {
    // Given: 'en' と完全には一致しない値
    // When: 言語に直す
    // Then: 'ja'
    assert.equal(parseLanguage(raw), 'ja', raw)
  }
})
