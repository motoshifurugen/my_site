// getChapters（data/chapters.ts）が返す章の並びを固定する単体テスト（Issue #331）。
//
// #331 で getChapters を ChapterPlayer の外に移し、言語ごとに重なっていたルートの分岐を
// CHAPTERS_BY_LANGUAGE の表引きにまとめた。言語と第6章のルートの組み合わせごとに、
// 前と同じ章データが同じ順で返ることを確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chapter1 } from './chapter1'
import { chapter1 as chapter1Eng } from './chapter1_eng'
import { chapter2 } from './chapter2'
import { chapter2 as chapter2Eng } from './chapter2_eng'
import { chapter3 } from './chapter3'
import { chapter3 as chapter3Eng } from './chapter3_eng'
import { chapter4 } from './chapter4'
import { chapter4 as chapter4Eng } from './chapter4_eng'
import { chapter5 } from './chapter5'
import { chapter5 as chapter5Eng } from './chapter5_eng'
import { chapter6a } from './chapter6a'
import { chapter6a as chapter6aEng } from './chapter6a_eng'
import { chapter6b } from './chapter6b'
import { chapter6b as chapter6bEng } from './chapter6b_eng'
import { chapter6c } from './chapter6c'
import { chapter6c as chapter6cEng } from './chapter6c_eng'
import { type Chapter6Route, getChapters, type Language } from './chapters'

const JA_BASE = [chapter1, chapter2, chapter3, chapter4, chapter5]
const EN_BASE = [
  chapter1Eng,
  chapter2Eng,
  chapter3Eng,
  chapter4Eng,
  chapter5Eng,
]

const CASES: {
  language: Language
  route: Chapter6Route
  expected: unknown[]
}[] = [
  { language: 'ja', route: null, expected: JA_BASE },
  { language: 'ja', route: 'bad_end', expected: [...JA_BASE, chapter6a] },
  { language: 'ja', route: 'true_end', expected: [...JA_BASE, chapter6b] },
  { language: 'ja', route: 'another_end', expected: [...JA_BASE, chapter6c] },
  { language: 'en', route: null, expected: EN_BASE },
  { language: 'en', route: 'bad_end', expected: [...EN_BASE, chapter6aEng] },
  { language: 'en', route: 'true_end', expected: [...EN_BASE, chapter6bEng] },
  {
    language: 'en',
    route: 'another_end',
    expected: [...EN_BASE, chapter6cEng],
  },
]

for (const { language, route, expected } of CASES) {
  test(`getChapters: ${language} / ${route} で決まった章を順に返す`, () => {
    // Given/When
    const chapters = getChapters(language, route)
    // Then: 同じ章データのオブジェクトを同じ順で返す
    assert.equal(chapters.length, expected.length)
    chapters.forEach((chapter, i) => assert.equal(chapter, expected[i]))
  })
}

test('getChapters: 呼ぶたびに新しい配列を返す', () => {
  // Given/When: 同じ引数で 2 回呼ぶ
  const first = getChapters('ja', null)
  const second = getChapters('ja', null)
  // Then: 呼び出し側が配列を書き換えても、ほかの呼び出しの結果に響かない
  assert.notEqual(first, second)
})
