// Issue #383: book ページから bookPages.ts へ移した 2 つの関数の動きを固定する。
//
// - splitTextIntoPages: 本文を改行で分け、maxLines 行ごとに 1 ページにまとめる
// - buildPageMapping: 表紙 → 目次 → 各章の本文 → 章末の栞 → 裏表紙の対応表を作る
//
// 移す前の page.tsx と同じ結果を返すことを確かめる。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  type BookmarkData,
  type ChapterContent,
  buildPageMapping,
  splitTextIntoPages,
} from './bookPages'

// 1 行目から count 行目までを「行1」「行2」… として改行でつなぐ
const linesText = (count: number) =>
  Array.from({ length: count }, (_, i) => `行${i + 1}`).join('\n')

test('splitTextIntoPages: 10 行ちょうどなら 1 ページ', () => {
  // Given: 10 行の本文
  // When: maxLines を渡さずに分ける
  const pages = splitTextIntoPages(linesText(10))

  // Then: 10 行すべてが 1 ページに入る
  assert.deepEqual(pages, [linesText(10)])
})

test('splitTextIntoPages: 11 行なら 2 ページで、2 ページ目は 11 行目だけ', () => {
  // Given: 11 行の本文
  // When: maxLines を渡さずに分ける
  const pages = splitTextIntoPages(linesText(11))

  // Then: 1 ページ目は 1〜10 行目、2 ページ目は 11 行目
  assert.deepEqual(pages, [linesText(10), '行11'])
})

test('splitTextIntoPages: 9 行なら 1 ページ', () => {
  // Given: 9 行の本文
  // When: maxLines を渡さずに分ける
  const pages = splitTextIntoPages(linesText(9))

  // Then: 9 行すべてが 1 ページに入る
  assert.deepEqual(pages, [linesText(9)])
})

test('splitTextIntoPages: maxLines を渡すとその行数で分かれる', () => {
  // Given: 7 行の本文
  // When: maxLines に 3 を渡して分ける
  const pages = splitTextIntoPages(linesText(7), 3)

  // Then: 3 行・3 行・1 行の 3 ページになる
  assert.deepEqual(pages, ['行1\n行2\n行3', '行4\n行5\n行6', '行7'])
})

test('splitTextIntoPages: 空行を 1 行として数え、そのまま残す', () => {
  // Given: 間に空行が 1 つある 3 行の本文
  // When: maxLines に 2 を渡して分ける
  const pages = splitTextIntoPages('a\n\nb', 2)

  // Then: 空行は消えず、1 ページ目の 2 行目になる
  assert.deepEqual(pages, ['a\n', 'b'])
})

test('splitTextIntoPages: 空行を含む本文が 1 ページに収まるときは元の文字列のまま', () => {
  // Given: 間に空行がある 3 行の本文
  // When: maxLines を渡さずに分ける
  const pages = splitTextIntoPages('a\n\nb')

  // Then: 空行を保った 1 ページになる
  assert.deepEqual(pages, ['a\n\nb'])
})

test('splitTextIntoPages: 空文字なら空文字 1 つのページを返す', () => {
  // Given: 空文字の本文（split すると [''] の 1 行になる）
  // When: 分ける
  const pages = splitTextIntoPages('')

  // Then: 移す前の実装と同じく [''] になる
  assert.deepEqual(pages, [''])
})

// 偽の栞と章
const firstBookmark: BookmarkData = { title: '栞その1', content: '栞の裏' }

// 第1章: 本文 2 ページ、栞あり
// 第2章: 本文 1 ページ、栞なし（キーを持たない）
// 第3章: 本文 3 ページ、栞が null
const chapters: ChapterContent[] = [
  { title: '第1章', pages: ['1-1', '1-2'], bookmark: firstBookmark },
  { title: '第2章', pages: ['2-1'] },
  { title: '第3章', pages: ['3-1', '3-2', '3-3'], bookmark: null },
]

test('buildPageMapping: 先頭は表紙、2 番目は目次', () => {
  // Given: 3 つの章
  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: 0 番目が cover、1 番目が table-of-contents
  assert.deepEqual(mapping[0], { type: 'cover' })
  assert.deepEqual(mapping[1], { type: 'table-of-contents' })
})

test('buildPageMapping: 末尾は裏表紙', () => {
  // Given: 3 つの章
  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: 最後の要素が back-cover
  assert.deepEqual(mapping[mapping.length - 1], { type: 'back-cover' })
})

test('buildPageMapping: 栞のある章では本文ページの直後に栞が 1 つ入る', () => {
  // Given: 第1章（本文 2 ページ、栞あり）が先頭の章
  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: 表紙・目次・第1章の 2 ページの次（4 番目）が栞で、渡した栞をそのまま持つ
  assert.deepEqual(mapping[4], { type: 'bookmark', bookmark: firstBookmark })
  assert.equal(mapping[4].bookmark, firstBookmark)
  // Then: 栞の次は第2章の 1 ページ目で、栞は続かない
  assert.deepEqual(mapping[5], {
    type: 'content',
    chapterIndex: 1,
    pageIndex: 0,
  })
})

test('buildPageMapping: 栞のキーが無い章にも栞が null の章にも栞は入らない', () => {
  // Given: 栞は第1章だけにある（第2章はキーなし、第3章は null）
  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: bookmark の要素は第1章の 1 つだけ
  const bookmarks = mapping.filter((entry) => entry.type === 'bookmark')
  assert.deepEqual(bookmarks, [{ type: 'bookmark', bookmark: firstBookmark }])
})

test('buildPageMapping: 本文ページは章の順、章の中ではページの順に並ぶ', () => {
  // Given: 本文が 2・1・3 ページの 3 つの章
  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: content の要素が (章, ページ) の順に並び、余計なキーを持たない
  const contents = mapping.filter((entry) => entry.type === 'content')
  assert.deepEqual(contents, [
    { type: 'content', chapterIndex: 0, pageIndex: 0 },
    { type: 'content', chapterIndex: 0, pageIndex: 1 },
    { type: 'content', chapterIndex: 1, pageIndex: 0 },
    { type: 'content', chapterIndex: 2, pageIndex: 0 },
    { type: 'content', chapterIndex: 2, pageIndex: 1 },
    { type: 'content', chapterIndex: 2, pageIndex: 2 },
  ])
})

test('buildPageMapping: 全体の長さは 2 + 本文ページの合計 + 栞の数 + 1', () => {
  // Given: 本文ページの合計が 6、栞が 1 つの章
  const contentPageCount = chapters.reduce(
    (sum, chapter) => sum + chapter.pages.length,
    0,
  )
  const bookmarkCount = chapters.filter((chapter) => chapter.bookmark).length

  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: 表紙と目次の 2、本文 6、栞 1、裏表紙 1 で 10
  assert.equal(contentPageCount, 6)
  assert.equal(bookmarkCount, 1)
  assert.equal(mapping.length, 2 + contentPageCount + bookmarkCount + 1)
})

test('buildPageMapping: 対応表全体が 表紙 → 目次 → 本文と栞 → 裏表紙 の順になる', () => {
  // Given: 3 つの章
  // When: 対応表を作る
  const mapping = buildPageMapping(chapters)

  // Then: 要素の type が決まった順に並ぶ
  assert.deepEqual(
    mapping.map((entry) => entry.type),
    [
      'cover',
      'table-of-contents',
      'content',
      'content',
      'bookmark',
      'content',
      'content',
      'content',
      'content',
      'back-cover',
    ],
  )
})

test('buildPageMapping: 章が 0 個なら表紙・目次・裏表紙の 3 つだけ', () => {
  // Given: 章の無い一覧
  // When: 対応表を作る
  const mapping = buildPageMapping([])

  // Then: 本文も栞も入らない
  assert.deepEqual(mapping, [
    { type: 'cover' },
    { type: 'table-of-contents' },
    { type: 'back-cover' },
  ])
})
