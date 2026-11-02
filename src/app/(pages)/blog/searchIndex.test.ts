// ブログ検索インデックス（Issue #7 / TDD 先行）を組み立てる buildPostSearchIndex の契約を、
// 実際の記事（src/posts）で固定する結合テスト。
//
// buildPostSearchIndex(): Promise<PostSearchEntry[]> の規則:
//   - 記事の集合と順序は getAllPostsMeta() と同じ（日付の新しい順・限定公開を除く）
//   - 各要素は PostMeta（slug・title・date・tags）に excerpt を足したもの。本文 content は含めない
//   - excerpt は本文を toPlainText でプレーンテキストにした先頭 200 文字
// ビルド時に静的ルートハンドラ（search-index.json/route.ts）から呼ばれ、JSON として書き出される。
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は searchIndex.ts が無いため import エラーで RED、実装後に GREEN。

import {
  getAllPostsMeta,
  getAllSlugs,
  getPostBySlug,
  isValidSlug,
} from '@/app/api/utils/getPostData'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toPlainText } from './[slug]/articleDescription'
import { buildPostSearchIndex } from './searchIndex'

const EXCERPT_LENGTH = 200
const LIMITED_TAG = '限定公開'

test('buildPostSearchIndex: 記事の集合と順序が getAllPostsMeta() と一致する', async () => {
  // Given
  const metas = await getAllPostsMeta()
  // When
  const index = await buildPostSearchIndex()
  // Then
  assert.ok(index.length > 0, '公開記事がある')
  assert.deepEqual(
    index.map((entry) => entry.slug),
    metas.map((meta) => meta.slug),
  )
})

test('buildPostSearchIndex: 各記事の slug・title・date・tags は getAllPostsMeta() と同じ値を持つ', async () => {
  // Given
  const metas = await getAllPostsMeta()
  // When
  const index = await buildPostSearchIndex()
  // Then
  index.forEach((entry, i) => {
    const { slug, title, date, tags } = entry
    assert.deepEqual(
      { slug, title, date, tags },
      metas[i],
      `${entry.slug} のメタ情報`,
    )
  })
})

test('buildPostSearchIndex: 各記事は PostMeta と excerpt だけを持ち、本文 content を含めない', async () => {
  // Given/When
  const index = await buildPostSearchIndex()
  // Then: JSON を小さく保つ
  for (const entry of index) {
    assert.deepEqual(
      Object.keys(entry).sort(),
      ['date', 'excerpt', 'slug', 'tags', 'title'],
      `${entry.slug} のキー`,
    )
  }
})

test('buildPostSearchIndex: excerpt は本文のプレーンテキストの先頭 200 文字', async () => {
  // Given/When
  const index = await buildPostSearchIndex()
  // Then
  for (const entry of index) {
    const { content } = await getPostBySlug(entry.slug)
    assert.equal(
      entry.excerpt,
      toPlainText(content).slice(0, EXCERPT_LENGTH),
      `${entry.slug} の excerpt`,
    )
  }
})

test('buildPostSearchIndex: excerpt は 200 文字以内で、見出し記号や HTML タグを含まない', async () => {
  // Given/When
  const index = await buildPostSearchIndex()
  // Then
  for (const entry of index) {
    assert.equal(typeof entry.excerpt, 'string', `${entry.slug}: 文字列`)
    assert.ok(
      entry.excerpt.length <= EXCERPT_LENGTH,
      `${entry.slug}: ${EXCERPT_LENGTH} 文字以内（実際: ${entry.excerpt.length}）`,
    )
    assert.ok(!entry.excerpt.includes('#'), `${entry.slug}: # を含まない`)
    assert.ok(
      !/<[^>]+>/.test(entry.excerpt),
      `${entry.slug}: HTML タグを含まない`,
    )
  }
})

test('buildPostSearchIndex: 本文が 200 文字を超える記事は 200 文字ちょうどで切る', async () => {
  // Given: 本文のプレーンテキストが 200 文字を超える公開記事
  const index = await buildPostSearchIndex()
  const longEntries = []
  for (const entry of index) {
    const { content } = await getPostBySlug(entry.slug)
    if (toPlainText(content).length > EXCERPT_LENGTH) {
      longEntries.push(entry)
    }
  }
  assert.ok(longEntries.length > 0, '200 文字を超える公開記事がある')
  // Then
  for (const entry of longEntries) {
    assert.equal(entry.excerpt.length, EXCERPT_LENGTH, entry.slug)
  }
})

test('buildPostSearchIndex: 限定公開の記事を含めない', async () => {
  // Given: src/posts にある記事のうち、限定公開タグを持つ slug
  const allSlugs = (await getAllSlugs()).filter(isValidSlug)
  const allPosts = await Promise.all(
    allSlugs.map((slug) => getPostBySlug(slug)),
  )
  const limitedSlugs = allPosts
    .filter((post) => post.tags.includes(LIMITED_TAG))
    .map((post) => post.slug)
  assert.ok(limitedSlugs.length > 0, '限定公開の記事が src/posts にある')
  // When
  const index = await buildPostSearchIndex()
  // Then
  const indexSlugs = new Set(index.map((entry) => entry.slug))
  for (const slug of limitedSlugs) {
    assert.ok(!indexSlugs.has(slug), `${slug}: インデックスに含めない`)
  }
})
