// ブログ一覧の検索とタグ件数（Issue #7 / TDD 先行）を決める純関数の契約を固定する単体テスト。
//
// searchPosts(posts, { query, tag }) の規則:
//   - 検索語と対象文字列をどちらも NFKC 正規化 + 小文字化して比べる（全角英数字・全角スペースも吸収）
//   - 検索語を空白で語に分け、すべての語が含まれる記事だけ残す（AND）
//   - 1 語が当たればよい対象は、タイトル・どれかのタグ・excerpt のいずれか
//   - 検索語が空、または空白だけなら検索語では絞らない
//   - tag が null でなければ post.tags.includes(tag) の完全一致で絞る。検索語とは AND
//   - 入力の順を保ち、入力の配列と記事を変えない
//   - excerpt を持たない PostMeta も受け付ける（インデックスの読み込み前・失敗時）
// countTags(posts) の規則:
//   - { tag, count }[] を返す。1 記事の中の重複タグは 1 回と数える
//   - 件数の多い順。同数なら入力に最初に出た順（3 つ目の並び順は足さない）
//
// 実行: プロジェクトルートで `npm test`（node --import tsx --test）。
// 実装前は postSearch.ts が無いため import エラーで RED、実装後に GREEN。

import { getAllPostsMeta } from '@/app/api/utils/getPostData'
import type { PostMeta, PostSearchEntry } from '@/types/posts'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { countTags, searchPosts } from './postSearch'

const createEntry = (overrides: Partial<PostSearchEntry>): PostSearchEntry => ({
  slug: 'post',
  title: 'タイトル',
  date: '2025-01-01',
  tags: [],
  excerpt: '',
  ...overrides,
})

const createMeta = (overrides: Partial<PostMeta>): PostMeta => ({
  slug: 'post',
  title: 'タイトル',
  date: '2025-01-01',
  tags: [],
  ...overrides,
})

const slugsOf = (posts: PostMeta[]): string[] => posts.map((post) => post.slug)

const NO_TAG = null

// --- 検索語: 検索対象 ---

test('searchPosts: タイトルに検索語を含む記事を返す', () => {
  // Given
  const posts = [
    createEntry({ slug: 'hit', title: 'Next.js で静的書き出し' }),
    createEntry({ slug: 'miss', title: '短歌を詠む' }),
  ]
  // When
  const result = searchPosts(posts, { query: '静的', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: タグに検索語を含む記事を返す', () => {
  // Given: タイトルと excerpt には検索語が無い
  const posts = [
    createEntry({ slug: 'hit', title: '日記', tags: ['ブログ', 'TypeScript'] }),
    createEntry({ slug: 'miss', title: '日記', tags: ['ブログ'] }),
  ]
  // When
  const result = searchPosts(posts, { query: 'TypeScript', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: タグの一部だけを含む検索語でも当たる', () => {
  // Given: 検索語はタグ「Next.js」の一部
  const posts = [
    createEntry({ slug: 'hit', tags: ['Next.js'] }),
    createEntry({ slug: 'miss', tags: ['React'] }),
  ]
  // When
  const result = searchPosts(posts, { query: 'next', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: 本文冒頭（excerpt）に検索語を含む記事を返す', () => {
  // Given: タイトルとタグには検索語が無い
  const posts = [
    createEntry({ slug: 'hit', excerpt: 'useEffect の依存配列について書く' }),
    createEntry({ slug: 'miss', excerpt: '旅行の記録' }),
  ]
  // When
  const result = searchPosts(posts, { query: '依存配列', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: どの対象にも検索語が無ければ空配列を返す', () => {
  // Given
  const posts = [
    createEntry({
      slug: 'a',
      title: 'React',
      tags: ['ブログ'],
      excerpt: '本文',
    }),
  ]
  // When
  const result = searchPosts(posts, { query: 'Vue', tag: NO_TAG })
  // Then
  assert.deepEqual(result, [])
})

test('searchPosts: slug や日付は検索対象にしない', () => {
  // Given: 検索語が slug と date にだけ含まれる
  const posts = [
    createEntry({
      slug: 'secret-slug',
      date: '2024-12-25',
      title: 'タイトル',
      tags: ['ブログ'],
      excerpt: '本文',
    }),
  ]
  // When
  const bySlug = searchPosts(posts, { query: 'secret', tag: NO_TAG })
  const byDate = searchPosts(posts, { query: '2024-12-25', tag: NO_TAG })
  // Then
  assert.deepEqual(bySlug, [])
  assert.deepEqual(byDate, [])
})

// --- 検索語: 正規化 ---

test('searchPosts: 大文字と小文字を区別しない（検索語が大文字）', () => {
  // Given
  const posts = [createEntry({ slug: 'hit', title: 'react の基本' })]
  // When
  const result = searchPosts(posts, { query: 'REACT', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: 大文字と小文字を区別しない（対象が大文字）', () => {
  // Given
  const posts = [createEntry({ slug: 'hit', tags: ['GITHUB'] })]
  // When
  const result = searchPosts(posts, { query: 'github', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: 全角英数字の検索語で半角の対象に当たる', () => {
  // Given
  const posts = [createEntry({ slug: 'hit', title: 'React 19 の新機能' })]
  // When
  const result = searchPosts(posts, { query: 'ＲＥＡＣＴ　１９', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: 半角の検索語で全角英数字の対象に当たる', () => {
  // Given: 対象側が全角
  const posts = [
    createEntry({ slug: 'hit', excerpt: 'ＴｙｐｅＳｃｒｉｐｔ を学ぶ' }),
  ]
  // When
  const result = searchPosts(posts, { query: 'typescript', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

// --- 検索語: 複数語 ---

test('searchPosts: 複数語はすべてを含む記事だけ返す（AND）', () => {
  // Given
  const posts = [
    createEntry({ slug: 'both', title: 'React と Next.js' }),
    createEntry({ slug: 'react-only', title: 'React 入門' }),
    createEntry({ slug: 'next-only', title: 'Next.js 入門' }),
  ]
  // When
  const result = searchPosts(posts, { query: 'React Next', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['both'])
})

test('searchPosts: 複数語はそれぞれ別の対象で当たってもよい', () => {
  // Given: 1 語目はタイトル、2 語目はタグ、3 語目は excerpt にだけある
  const posts = [
    createEntry({
      slug: 'hit',
      title: 'ポートフォリオ',
      tags: ['Three.js'],
      excerpt: 'ゲームを作った',
    }),
  ]
  // When
  const result = searchPosts(posts, {
    query: 'ポートフォリオ three ゲーム',
    tag: NO_TAG,
  })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: 全角スペースでも語に分ける', () => {
  // Given: 2 語をつなげた文字列はどの対象にも無い
  const posts = [
    createEntry({ slug: 'hit', title: 'React', excerpt: 'フック' }),
    createEntry({ slug: 'miss', title: 'React', excerpt: '状態' }),
  ]
  // When
  const result = searchPosts(posts, { query: 'React　フック', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

test('searchPosts: 語の間の連続した空白と前後の空白を無視する', () => {
  // Given
  const posts = [
    createEntry({ slug: 'hit', title: 'React', excerpt: 'フック' }),
    createEntry({ slug: 'miss', title: 'Vue', excerpt: 'フック' }),
  ]
  // When
  const result = searchPosts(posts, {
    query: '  React   フック  ',
    tag: NO_TAG,
  })
  // Then
  assert.deepEqual(slugsOf(result), ['hit'])
})

// --- 検索語: 空 ---

test('searchPosts: 検索語が空なら全件を返す', () => {
  // Given
  const posts = [createEntry({ slug: 'a' }), createEntry({ slug: 'b' })]
  // When
  const result = searchPosts(posts, { query: '', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['a', 'b'])
})

test('searchPosts: 検索語が空白だけなら全件を返す', () => {
  // Given: 半角・全角・タブ・改行の空白
  const posts = [createEntry({ slug: 'a' }), createEntry({ slug: 'b' })]
  // When
  const result = searchPosts(posts, { query: ' 　\t\n', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['a', 'b'])
})

test('searchPosts: 記事が 0 件なら空配列を返す', () => {
  // Given/When
  const result = searchPosts([], { query: 'React', tag: NO_TAG })
  // Then
  assert.deepEqual(result, [])
})

// --- タグ絞り込み ---

test('searchPosts: tag を指定するとそのタグを持つ記事だけ返す', () => {
  // Given
  const posts = [
    createEntry({ slug: 'react', tags: ['React', 'ブログ'] }),
    createEntry({ slug: 'blog', tags: ['ブログ'] }),
    createEntry({ slug: 'none', tags: [] }),
  ]
  // When
  const result = searchPosts(posts, { query: '', tag: 'React' })
  // Then
  assert.deepEqual(slugsOf(result), ['react'])
})

test('searchPosts: tag は完全一致で比べる（部分一致しない）', () => {
  // Given: 「Next」は「Next.js」の一部
  const posts = [createEntry({ slug: 'next', tags: ['Next.js'] })]
  // When
  const result = searchPosts(posts, { query: '', tag: 'Next' })
  // Then
  assert.deepEqual(result, [])
})

test('searchPosts: tag は大文字と小文字を区別する（既存の ?tag= 絞り込みと同じ）', () => {
  // Given
  const posts = [createEntry({ slug: 'react', tags: ['React'] })]
  // When
  const result = searchPosts(posts, { query: '', tag: 'react' })
  // Then
  assert.deepEqual(result, [])
})

test('searchPosts: tag に当たる記事が無ければ空配列を返す', () => {
  // Given
  const posts = [createEntry({ slug: 'a', tags: ['React'] })]
  // When
  const result = searchPosts(posts, { query: '', tag: '存在しないタグ' })
  // Then
  assert.deepEqual(result, [])
})

test('searchPosts: tag と検索語の両方を満たす記事だけ返す（AND）', () => {
  // Given
  const posts = [
    createEntry({ slug: 'both', title: 'フック入門', tags: ['React'] }),
    createEntry({ slug: 'tag-only', title: '状態管理', tags: ['React'] }),
    createEntry({ slug: 'query-only', title: 'フック入門', tags: ['Vue'] }),
  ]
  // When
  const result = searchPosts(posts, { query: 'フック', tag: 'React' })
  // Then
  assert.deepEqual(slugsOf(result), ['both'])
})

// --- excerpt の無い記事 ---

test('searchPosts: excerpt の無い記事でもタイトルとタグで検索できる', () => {
  // Given: インデックス読み込み前の PostMeta
  const posts = [
    createMeta({ slug: 'title-hit', title: 'React 入門' }),
    createMeta({ slug: 'tag-hit', tags: ['React'] }),
    createMeta({ slug: 'miss', title: 'Vue 入門' }),
  ]
  // When
  const result = searchPosts(posts, { query: 'react', tag: NO_TAG })
  // Then
  assert.deepEqual(slugsOf(result), ['title-hit', 'tag-hit'])
})

test('searchPosts: excerpt の無い記事を tag で絞り込める', () => {
  // Given
  const posts = [
    createMeta({ slug: 'react', tags: ['React'] }),
    createMeta({ slug: 'vue', tags: ['Vue'] }),
  ]
  // When
  const result = searchPosts(posts, { query: '', tag: 'Vue' })
  // Then
  assert.deepEqual(slugsOf(result), ['vue'])
})

// --- 入出力の形 ---

test('searchPosts: 入力の順を保つ', () => {
  // Given: 日付の古い順に並べた入力
  const posts = [
    createEntry({ slug: 'old', date: '2020-01-01', title: 'React' }),
    createEntry({ slug: 'new', date: '2025-01-01', title: 'React' }),
    createEntry({ slug: 'middle', date: '2023-01-01', title: 'React' }),
  ]
  // When
  const result = searchPosts(posts, { query: 'react', tag: NO_TAG })
  // Then: 並び替えない
  assert.deepEqual(slugsOf(result), ['old', 'new', 'middle'])
})

test('searchPosts: 入力の記事をそのままの形で返す', () => {
  // Given
  const entry = createEntry({
    slug: 'a',
    title: 'React',
    tags: ['React'],
    excerpt: '本文',
  })
  // When
  const result = searchPosts([entry], { query: 'react', tag: 'React' })
  // Then: フィールドを足したり削ったりしない
  assert.deepEqual(result, [entry])
  assert.equal(result[0], entry)
})

test('searchPosts: 入力の配列と記事を変えない', () => {
  // Given
  const posts = [
    createEntry({ slug: 'a', title: 'ＲＥＡＣＴ', tags: ['React'] }),
    createEntry({ slug: 'b', title: 'Vue', tags: ['Vue'] }),
  ]
  const snapshot = structuredClone(posts)
  // When
  searchPosts(posts, { query: 'react', tag: 'React' })
  // Then
  assert.deepEqual(posts, snapshot)
})

// --- countTags ---

test('countTags: タグごとに記事の件数を数える', () => {
  // Given
  const posts = [
    createMeta({ slug: 'a', tags: ['React', 'ブログ'] }),
    createMeta({ slug: 'b', tags: ['React'] }),
    createMeta({ slug: 'c', tags: ['React', 'ブログ', 'Next.js'] }),
  ]
  // When
  const tagCounts = countTags(posts)
  // Then
  assert.deepEqual(tagCounts, [
    { tag: 'React', count: 3 },
    { tag: 'ブログ', count: 2 },
    { tag: 'Next.js', count: 1 },
  ])
})

test('countTags: 1 記事の中で重複したタグは 1 回と数える', () => {
  // Given: a は React を 2 回持つ
  const posts = [
    createMeta({ slug: 'a', tags: ['React', 'React'] }),
    createMeta({ slug: 'b', tags: ['React'] }),
  ]
  // When
  const tagCounts = countTags(posts)
  // Then
  assert.deepEqual(tagCounts, [{ tag: 'React', count: 2 }])
})

test('countTags: 件数の多い順に並べる', () => {
  // Given: 最初に出るタグほど件数が少ない
  const posts = [
    createMeta({ slug: 'a', tags: ['one'] }),
    createMeta({ slug: 'b', tags: ['two', 'three'] }),
    createMeta({ slug: 'c', tags: ['two', 'three'] }),
    createMeta({ slug: 'd', tags: ['three'] }),
  ]
  // When
  const tagCounts = countTags(posts)
  // Then
  assert.deepEqual(
    tagCounts.map(({ tag }) => tag),
    ['three', 'two', 'one'],
  )
})

test('countTags: 件数が同じなら入力に最初に出た順に並べる', () => {
  // Given: B・A・C の順に初出。B と A は 2 件で同数
  const posts = [
    createMeta({ slug: 'a', tags: ['B'] }),
    createMeta({ slug: 'b', tags: ['A', 'C'] }),
    createMeta({ slug: 'c', tags: ['A', 'B'] }),
  ]
  // When
  const tagCounts = countTags(posts)
  // Then: 名前順などの 3 つ目の並び順を足さない
  assert.deepEqual(tagCounts, [
    { tag: 'B', count: 2 },
    { tag: 'A', count: 2 },
    { tag: 'C', count: 1 },
  ])
})

test('countTags: 記事が 0 件なら空配列を返す', () => {
  // Given/When/Then
  assert.deepEqual(countTags([]), [])
})

test('countTags: タグの無い記事だけなら空配列を返す', () => {
  // Given
  const posts = [createMeta({ slug: 'a', tags: [] })]
  // When/Then
  assert.deepEqual(countTags(posts), [])
})

test('countTags: 入力の配列と記事を変えない', () => {
  // Given
  const posts = [
    createMeta({ slug: 'a', tags: ['B', 'B'] }),
    createMeta({ slug: 'b', tags: ['A', 'B'] }),
  ]
  const snapshot = structuredClone(posts)
  // When
  countTags(posts)
  // Then
  assert.deepEqual(posts, snapshot)
})

// --- 実際の記事一覧との結合 ---

test('countTags: 公開記事の各タグの件数は、そのタグを持つ公開記事の数に等しい', async () => {
  // Given: ブログ一覧と同じく getAllPostsMeta() の結果を渡す
  const allPosts = await getAllPostsMeta()
  assert.ok(allPosts.length > 0, '公開記事がある')
  // When
  const tagCounts = countTags(allPosts)
  // Then
  const expectedTags = new Set(allPosts.flatMap((post) => post.tags))
  assert.equal(tagCounts.length, expectedTags.size, 'タグの種類数が一致する')
  for (const { tag, count } of tagCounts) {
    const expected = allPosts.filter((post) => post.tags.includes(tag)).length
    assert.equal(count, expected, `${tag} の件数`)
  }
})

test('searchPosts: 公開記事を tag で絞り込むと、そのタグを持つ記事だけが一覧の順で残る', async () => {
  // Given
  const allPosts = await getAllPostsMeta()
  for (const { tag } of countTags(allPosts)) {
    // When
    const result = searchPosts(allPosts, { query: '', tag })
    // Then
    assert.deepEqual(
      slugsOf(result),
      slugsOf(allPosts.filter((post) => post.tags.includes(tag))),
      `${tag} で絞り込んだ結果`,
    )
  }
})
